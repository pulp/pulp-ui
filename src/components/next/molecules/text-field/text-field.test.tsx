import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TextField } from './text-field';

afterEach(cleanup);

const base = {
  id: 'username',
  label: 'Username',
  value: '',
  onInputChange: () => undefined,
};

describe('Component: TextField', { tags: ['component'] }, () => {
  it('labels the input with the given label', () => {
    render(<TextField {...base} />);

    const input = screen.getByLabelText(base.label);

    expect(input.id).toStrictEqual(base.id);
    expect(input.getAttribute('type')).toStrictEqual('text');
  });

  it('renders a password input with autocomplete', () => {
    render(
      <TextField
        {...base}
        label='Password'
        type='password'
        autoComplete='current-password'
      />,
    );

    const input = screen.getByLabelText('Password');

    expect(input.getAttribute('type')).toStrictEqual('password');
    expect(input.getAttribute('autocomplete')).toStrictEqual(
      'current-password',
    );
  });

  it('shows the error and links it to the input', () => {
    render(<TextField {...base} error='Enter your username.' />);

    const input = screen.getByLabelText('Username');
    const error = screen.getByText('Enter your username.');

    expect(error).toBeTruthy();
    expect(input.getAttribute('aria-describedby')).toStrictEqual(
      'username-error',
    );
    expect(input.getAttribute('aria-invalid')).toStrictEqual('true');
  });

  it('shows no error when there is no error', () => {
    render(<TextField {...base} />);

    const input = screen.getByLabelText('Username');

    expect(screen.queryByText('Enter your username.')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });

  it('disables the input when requested', () => {
    render(<TextField {...base} isDisabled />);

    const input = screen.getByLabelText('Username');

    expect(input.hasAttribute('disabled')).toStrictEqual(true);
  });

  it('reports changes with the new value', () => {
    const onChange = vi.fn();
    render(<TextField {...base} onInputChange={onChange} />);

    const input = screen.getByLabelText('Username');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(onChange).toHaveBeenCalledWith(expect.anything(), 'test');
  });
});
