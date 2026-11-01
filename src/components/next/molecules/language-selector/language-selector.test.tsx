import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  type LanguageCode,
  languageNames,
} from '../../../../lib/l10n/languages';
import { LanguageSelector } from './language-selector';

afterEach(cleanup);

const openMenu = () => fireEvent.click(screen.getByRole('button'));

describe('Component: LanguageSelector', { tags: ['component'] }, () => {
  it('shows the current language on the toggle', () => {
    render(<LanguageSelector lang='en' onChange={vi.fn()} />);

    const selector = screen.getByRole('button');

    expect(selector.textContent).toContain(languageNames.en);
  });

  it('keeps the menu closed until the toggle is clicked', () => {
    render(<LanguageSelector lang='en' onChange={vi.fn()} />);

    const list = screen.queryByRole('listbox');

    expect(list).toBeNull();
  });

  it.each(Object.entries(languageNames))(
    'lists %s as %s when opened',
    async (_, name) => {
      render(<LanguageSelector lang='en' onChange={vi.fn()} />);
      openMenu();

      expect(await screen.findByRole('option', { name })).toBeTruthy();
    },
  );

  it('marks only the current language as selected', async () => {
    render(<LanguageSelector lang='fr' onChange={vi.fn()} />);
    openMenu();

    const selected = await screen.findAllByRole('option', { selected: true });

    expect(selected).toHaveLength(1);
    expect(selected[0].textContent).toContain(languageNames.fr);
  });

  it('calls onChange with the language code when an option is chosen', async () => {
    const onChange = vi.fn<(lang: LanguageCode) => void>();
    render(<LanguageSelector lang='en' onChange={onChange} />);
    openMenu();

    const option = await screen.findByRole('option', {
      name: languageNames.ja,
    });
    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledExactlyOnceWith('ja');
  });

  it('closes the menu after a language is chosen', async () => {
    render(<LanguageSelector lang='en' onChange={vi.fn()} />);
    openMenu();

    const option = await screen.findByRole('option', {
      name: languageNames.es,
    });
    fireEvent.click(option);

    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  });
});
