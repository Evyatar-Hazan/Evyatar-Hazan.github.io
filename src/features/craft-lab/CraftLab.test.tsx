import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import CraftLab from './CraftLab';
import { craftLabContent } from './craftLabContent';

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
    [
      'en',
      'Product thinking, tested in the smallest states.',
      'Three original interface studies showing how I turn failure, progress, and workflow decisions into clear next steps',
      'Self-initiated studies using synthetic scenarios and sample data. They demonstrate product thinking; they are not client work, customer data, production systems, or evidence of production results.',
    ],
    [
      'he',
      'חשיבה מוצרית, במבחן של המצבים הקטנים.',
      'שלושה ניסויי ממשק מקוריים שמראים איך אני הופך כשל, התקדמות והחלטות בתהליך לצעדים ברורים להמשך',
      'ניסויים עצמאיים המבוססים על תרחישים סינתטיים ומידע לדוגמה. הם מדגימים חשיבה מוצרית; הם אינם עבודת לקוח, מידע של לקוחות, מערכות פרודקשן או ראיה לתוצאות בפרודקשן.',
    ],
  ] as const)('positions the %s lab as product-thinking evidence while separating it from client and production work', (language, title, introduction, disclosure) => {
    render(<CraftLab language={language} buildPath={buildPath} />);

    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(introduction))).toBeInTheDocument();
    expect(screen.getAllByText(disclosure, { exact: true })).toHaveLength(2);
    expect(screen.getAllByText(language === 'he' ? 'תרחיש סינתטי' : 'Synthetic scenario')).toHaveLength(3);
    expect(document.querySelectorAll('[data-experiment]')).toHaveLength(3);
  });

  it.each([
    ['en', 'Make every system state clear', 'Show the decision, not just the flow', 'Synthetic'],
    ['he', 'להבהיר כל מצב במערכת', 'להציג את ההחלטה, לא רק את הזרימה', 'סינתטי'],
  ] as const)('connects the %s upload and diagram copy to reusable product principles', (language, uploadTitle, diagramTitle, syntheticTerm) => {
    const content = craftLabContent[language];

    expect(content.upload.title).toBe(uploadTitle);
    expect(content.upload.summary).toMatch(/what happened|מה קרה/);
    expect(Object.values(content.upload.status)).toHaveLength(6);
    expect(Object.values(content.upload.status).join(' ')).toMatch(new RegExp(syntheticTerm, 'i'));
    expect(Object.values(content.upload.status)).toEqual(language === 'en' ? [
      'Load the synthetic sample to inspect the upload flow.',
      'Synthetic sample queued. No transfer has started.',
      'Simulated transfer is 48% complete.',
      'Simulated transfer complete. Processing the sample.',
      'Synthetic preview ready for review.',
      'Simulated transfer stopped at 48%. The sample is available to retry.',
    ] : [
      'טענו את הדוגמה הסינתטית כדי לבדוק את תהליך ההעלאה.',
      'הדוגמה הסינתטית בתור. ההעברה טרם התחילה.',
      'ההעברה המדומה הושלמה ב־48%.',
      'ההעברה המדומה הושלמה. הדוגמה בעיבוד.',
      'התצוגה הסינתטית מוכנה לבדיקה.',
      'ההעברה המדומה נעצרה ב־48%. הדוגמה זמינה לניסיון חוזר.',
    ]);
    expect(content.diagram.title).toBe(diagramTitle);
    expect(content.diagram.summary).toMatch(/why the workflow|למה התהליך/);
    expect(content.diagram.nodes).toHaveLength(4);
    expect(content.diagram.nodes.every((node) => node.outcome.length > 40)).toBe(true);
    expect(content.diagram.nodes.map((node) => node.outcome).join(' ')).toMatch(/synthetic|sample|סינתט/);
  });

  it.each([
    {
      language: 'en',
      summary: 'A sample report fails to generate before export. The interface keeps the filters, offers two recovery paths, and confirms when the report is ready.',
      run: 'Generate sample report',
      alertTitle: 'The report could not be generated.',
      preserved: 'Your fictional inventory filters are preserved exactly as selected—there is nothing to rebuild.',
      workspace: 'Fictional studio inventory',
      retry: 'Retry the sample export',
      alternative: 'Open the sample CSV instead',
      recovered: 'Recovery complete: the sample report is ready, with the original fictional filters preserved.',
    },
    {
      language: 'he',
      summary: 'יצירת דוח לדוגמה נעצרת לפני הייצוא. הממשק שומר את המסננים, מציע שתי דרכי התאוששות ומאשר כשהדוח מוכן.',
      run: 'יצירת דוח לדוגמה',
      alertTitle: 'לא ניתן היה ליצור את הדוח.',
      preserved: 'מסנני המלאי הבדיוני נשמרו בדיוק כפי שנבחרו — אין צורך לבנות אותם מחדש.',
      workspace: 'מלאי סטודיו בדיוני',
      retry: 'ניסיון חוזר לייצוא הדוגמה',
      alternative: 'פתיחת ה־CSV לדוגמה במקום',
      recovered: 'ההתאוששות הושלמה: הדוח לדוגמה מוכן, עם המסננים הבדיוניים המקוריים שנשמרו.',
    },
  ] as const)('shows a useful $language error, preserves context, and offers recovery', ({ language, summary, run, alertTitle, preserved, workspace, retry, alternative, recovered }) => {
    render(<CraftLab language={language} buildPath={buildPath} />);

    expect(screen.getByText(summary, { exact: true })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: run }));

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(alertTitle);
    expect(alert).toHaveAttribute('aria-live', 'assertive');
    expect(alert).toHaveAttribute('aria-atomic', 'true');
    expect(alert).toHaveTextContent(preserved);
    expect(screen.getByText(workspace)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: retry })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: alternative })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: retry }));
    const recoveredStatus = screen.getByRole('status');
    expect(recoveredStatus).toHaveTextContent(recovered);
    expect(recoveredStatus).toHaveAttribute('aria-live', 'polite');
    expect(recoveredStatus).toHaveAttribute('aria-atomic', 'true');
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
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Start simulation' }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '48');
    expect(screen.getByText('Simulated transfer is 48% complete.')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Simulate failure' }));
    expect(screen.getByText('Needs attention')).toBeInTheDocument();
    const uploadError = screen.getByRole('alert');
    expect(uploadError).toHaveTextContent('Simulated transfer stopped at 48%. The sample is available to retry.');
    expect(uploadError).toHaveAttribute('aria-live', 'assertive');

    fireEvent.click(screen.getByRole('button', { name: 'Retry simulation' }));
    fireEvent.click(screen.getByRole('button', { name: 'Advance state' }));
    expect(screen.getByText('Processing')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Advance state' }));
    const readyStatus = screen.getByRole('status');
    expect(readyStatus).toHaveTextContent('Synthetic preview ready for review.');
    expect(readyStatus).toHaveAttribute('aria-live', 'polite');
    expect(document.querySelectorAll('[role="status"]')).toHaveLength(1);
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
    expect(screen.getByText(/stops transparently when evidence is missing while preserving the draft for recovery/i)).toBeInTheDocument();
  });

  it('delegates all links to the injected localized path builder', () => {
    render(<CraftLab language="he" buildPath={buildPath} />);

    expect(screen.getByRole('link', { name: 'לצפייה בעבודות שנמסרו' })).toHaveAttribute('href', '/he/#projects');
    expect(screen.getByRole('link', { name: 'לשיחה על פרויקט אמיתי' })).toHaveAttribute('href', '/he/contact/');
    expect(buildPath).toHaveBeenCalledWith('he', { route: 'projects' });
    expect(buildPath).toHaveBeenCalledWith('he', { route: 'contact' });
  });
});
