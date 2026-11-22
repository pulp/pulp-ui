import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { StatusIndicator, type StatusTone } from './status-indicator';

afterEach(cleanup);

describe('Component: StatusIndicator', { tags: ['component'] }, () => {
  it('renders the given text', () => {
    const text = 'Placholder';
    render(<StatusIndicator tone='success' text={text} />);

    const indicator = screen.getByText(text);

    expect(indicator).toBeTruthy();
  });

  it.each<[StatusTone, string]>([
    ['success', 'pulp-status-indicator--success'],
    ['warning', 'pulp-status-indicator--warning'],
    ['danger', 'pulp-status-indicator--danger'],
    ['neutral', 'pulp-status-indicator--neutral'],
  ])('applies the %s modifier class', (tone, expectedClass) => {
    render(<StatusIndicator tone={tone} text='Status' />);

    const indicator = screen.getByRole('status');

    expect(indicator.classList.contains(expectedClass)).toStrictEqual(true);
  });

  it('does not mix modifier classes between tones', () => {
    render(<StatusIndicator tone='danger' text='Service down' />);

    const indicator = screen.getByRole('status');

    expect(indicator.classList.contains('pulp-status-indicator--danger')).toStrictEqual(true);
    expect(indicator.classList.contains('pulp-status-indicator--success')).toStrictEqual(false);
  })
});
