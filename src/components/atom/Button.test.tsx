import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('defaults to type="button"', () => {
    render(<Button>Go</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('honors an explicit type', () => {
    render(<Button type="submit">Go</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('forwards the onClick handler', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('merges custom class names over the defaults', () => {
    render(<Button className="bg-green-600">X</Button>);

    expect(screen.getByRole('button')).toHaveClass('bg-green-600');
  });

  it('passes through the disabled attribute', () => {
    render(<Button disabled>X</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
