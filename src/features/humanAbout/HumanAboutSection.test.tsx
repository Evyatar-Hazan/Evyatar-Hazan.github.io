import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HumanAboutSection from './HumanAboutSection';
import {
  getHumanAboutContent,
  humanAboutSourceIds,
  type HumanAboutPillarId,
} from './content';
import { humanAboutRegistration } from './index';

const expectedPillarIds: HumanAboutPillarId[] = [
  'background',
  'workingStyle',
  'collaboration',
];

describe('HumanAboutSection', () => {
  it('registers the feature in the approved task and slot', () => {
    expect(humanAboutRegistration.taskId).toBe('t03');
    expect(humanAboutRegistration.slot).toBe('home.humanAbout');
    expect(humanAboutRegistration.Component).toBe(HumanAboutSection);
  });

  it.each([
    ['en', 'Full-stack thinking, with a practical way of working.', 'Working together'],
    ['he', 'חשיבה מקצה לקצה, בדרך עבודה מעשית.', 'איך עובדים יחד'],
  ] as const)('renders the complete professional profile in %s', (language, title, collaborationTitle) => {
    const { container } = render(<HumanAboutSection language={language} />);

    expect(screen.getByRole('heading', { level: 2, name: title })).toHaveAttribute(
      'id',
      'human-about-title',
    );
    expect(screen.getByRole('heading', { level: 3, name: collaborationTitle })).toBeInTheDocument();
    expect(container.querySelector('[data-portfolio-slot="home.humanAbout"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-human-about-pillar]')).toHaveLength(3);
  });

  it('keeps both languages structurally equivalent and every pillar source-backed', () => {
    const english = getHumanAboutContent('en');
    const hebrew = getHumanAboutContent('he');

    expect(english.pillars.map(({ id }) => id)).toEqual(expectedPillarIds);
    expect(hebrew.pillars.map(({ id }) => id)).toEqual(expectedPillarIds);
    expect(english.pillars.map(({ sourceId }) => sourceId)).toEqual(humanAboutSourceIds);
    expect(hebrew.pillars.map(({ sourceId }) => sourceId)).toEqual(humanAboutSourceIds);

    for (const content of [english, hebrew]) {
      expect(content.eyebrow.trim()).not.toBe('');
      expect(content.title.trim()).not.toBe('');
      expect(content.introduction.trim()).not.toBe('');
      content.pillars.forEach((pillar) => {
        expect(pillar.title.trim()).not.toBe('');
        expect(pillar.body.trim()).not.toBe('');
      });
    }
  });

  it('forwards a host-provided class name without changing the slot contract', () => {
    const { container } = render(
      <HumanAboutSection language="en" className="integration-spacing" />,
    );

    expect(container.firstElementChild).toHaveClass('integration-spacing');
  });
});
