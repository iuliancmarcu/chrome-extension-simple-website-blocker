import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('renders an input with the given placeholder', () => {
    render(<TextInput placeholder="Message" />);

    expect(screen.getByPlaceholderText('Message')).toBeInTheDocument();
  });

  it('forwards the ref to the underlying input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextInput ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('spreads input props such as onChange', async () => {
    const onChange = vi.fn();
    render(<TextInput placeholder="p" onChange={onChange} />);

    await userEvent.type(screen.getByPlaceholderText('p'), 'a');

    expect(onChange).toHaveBeenCalled();
  });

  it('renders the left and right icons', () => {
    render(
      <TextInput
        placeholder="p"
        iconLeft={<span data-testid="left" />}
        iconRight={<span data-testid="right" />}
      />,
    );

    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });
});
