import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { OptionsTitle } from './OptionsTitle';

describe('OptionsTitle', () => {
  it('renders the title as a heading', () => {
    render(<OptionsTitle title="Warning Message" description="desc" />);

    expect(
      screen.getByRole('heading', { name: 'Warning Message' }),
    ).toBeInTheDocument();
  });

  it('renders a plain-text description', () => {
    render(<OptionsTitle title="t" description="A helpful description" />);

    expect(screen.getByText('A helpful description')).toBeInTheDocument();
  });

  it('renders a React node description', () => {
    render(<OptionsTitle title="t" description={<a href="/x">link</a>} />);

    expect(screen.getByRole('link', { name: 'link' })).toBeInTheDocument();
  });
});
