import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import CraftLab from './CraftLab';

const buildPath = vi.fn<LocalizedPathBuilder>((language, target) => {
  if (target.route === 'projects') return `/${language}/#projects`;
  if (target.route === 'contact') return `/${language}/contact/`;
  return `/${language}/`;
});

afterEach(() => {
  buildPath.mockClear();
  vi.unstubAllGlobals();
});

describe('CraftLab', () => {
  it.each([
    ['en', 'Small states. Serious product decisions.', 'These are self-initiated experiments built with synthetic scenarios.'],
    ['he', 'מצבים קטנים. החלטות מוצר רציניות.', 'אלה ניסויים עצמאיים שנבנו מתרחישים סינתטיים.'],
  ] as const)('identifies the %s lab as synthetic experimentation rather than client delivery', (language, title, disclosure) => {
    render(<CraftLab language={language} buildPath={buildPath} />);

    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(disclosure))).toHaveLength(2);
    expect(screen.getAllByText(language === 'he' ? 'תרחיש סינתטי' : 'Synthetic scenario')).toHaveLength(3);
    expect(document.querySelectorAll('[data-experiment]')).toHaveLength(3);
  });

  it('shows a useful error, preserves context, and offers recovery', () => {
    render(<CraftLab language="en" buildPath={buildPath} />);

    fireEvent.click(screen.getByRole('button', { name: 'Generate sample report' }));

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('The report could not be generated.');
    expect(alert).toHaveTextContent('Your report filters are still here.');
    expect(screen.getByText('Fictional studio inventory')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry safely' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use sample CSV instead' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Retry safely' }));
    expect(screen.getByRole('status')).toHaveTextContent('The original filters were preserved.');
  });

  it('simulates upload states without selecting or sending a real file', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { container } = render(<CraftLab language="en" buildPath={buildPath} />);

    expect(container.querySelector('input[type="file"]')).not.toBeInTheDocument();
    expect(container.querySelector('video, iframe')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Load synthetic sample' }));
    expect(screen.getByText('sample-launch-cut.mp4')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0');

    fireEvent.click(screen.getByRole('button', { name: 'Start simulation' }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '48');
    expect(screen.getByText('Simulated transfer is 48% complete.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Simulate failure' }));
    expect(screen.getByText('Needs attention')).toBeInTheDocument();
    expect(screen.getByText(/sample remains available to retry/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Retry simulation' }));
    fireEvent.click(screen.getByRole('button', { name: 'Advance state' }));
    expect(screen.getByText('Processing')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Advance state' }));
    expect(screen.getByText('Synthetic preview ready for review.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('makes every diagram node keyboard-addressable and exposes the selected decision', () => {
    render(<CraftLab language="en" buildPath={buildPath} />);

    const diagram = screen.getByRole('group', { name: 'Interactive fictional release workflow' });
    const nodes = within(diagram).getAllByRole('button');
    expect(nodes).toHaveLength(4);
    expect(nodes[0]).toHaveAttribute('aria-pressed', 'true');

    const rightsCheck = within(diagram).getByRole('button', { name: /Rights check/i });
    rightsCheck.focus();
    fireEvent.keyDown(rightsCheck, { key: 'Enter' });
    fireEvent.click(rightsCheck);

    expect(rightsCheck).toHaveFocus();
    expect(rightsCheck).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/Block publication when ownership or consent is unknown/i)).toBeInTheDocument();
    expect(screen.getByText(/protects both the team and the people represented by the media/i)).toBeInTheDocument();
  });

  it('delegates all links to the injected localized path builder', () => {
    render(<CraftLab language="he" buildPath={buildPath} />);

    expect(screen.getByRole('link', { name: 'לצפייה בעבודות שנמסרו' })).toHaveAttribute('href', '/he/#projects');
    expect(screen.getByRole('link', { name: 'לשיחה על פרויקט אמיתי' })).toHaveAttribute('href', '/he/contact/');
    expect(buildPath).toHaveBeenCalledWith('he', { route: 'projects' });
    expect(buildPath).toHaveBeenCalledWith('he', { route: 'contact' });
  });
});
