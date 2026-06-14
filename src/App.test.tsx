import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const changeLanguageMock = vi.fn().mockResolvedValue(undefined);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: changeLanguageMock },
  }),
}));

import App from './App';

describe('App', () => {
  it('renders the main navigation and hero section', () => {
    render(<App />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(document.querySelector('#home')).toBeInTheDocument();
  });

  it('locks and unlocks body scroll when mobile menu toggles', () => {
    render(<App />);

    const menuToggle = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(menuToggle);

    expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }));
    expect(document.body.style.overflow).toBe('unset');
  });

  it('updates i18n and localStorage when language toggle is clicked', () => {
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem');
    render(<App />);

    const languageButtons = screen.getAllByRole('button', { name: /toggle language/i });
    fireEvent.click(languageButtons[0]);

    expect(setItemSpy).toHaveBeenCalledWith('i18nextLng', 'he');
    expect(changeLanguageMock).toHaveBeenCalledWith('he');
  });

  it('marks the active nav item with aria-current', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: 'nav.About' }));
    expect(screen.getByRole('link', { name: 'nav.About' })).toHaveAttribute('aria-current', 'page');
  });

  it('closes the mobile menu when clicking the backdrop', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByTestId('mobile-menu-backdrop'));
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('unset');
  });

  it('restores body scroll when app unmounts with mobile menu open', () => {
    const { unmount } = render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('unset');
  });
});
