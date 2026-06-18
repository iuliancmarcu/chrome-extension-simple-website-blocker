import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { OptionsPage } from './OptionsPage';
import { installChromeMock } from './test/chromeMock';

describe('OptionsPage', () => {
  it('loads stored options into the form', async () => {
    installChromeMock({
      warningMessage: 'Stay focused',
      websites: [{ address: 'x.com' }],
      enableConfirm: true,
    });

    render(<OptionsPage />);

    // The form is populated asynchronously once storage resolves.
    expect(await screen.findByDisplayValue('Stay focused')).toBeInTheDocument();
    expect(screen.getByDisplayValue('x.com')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('renders the section titles and a saved status', async () => {
    installChromeMock();

    render(<OptionsPage />);

    expect(await screen.findByText('All changes saved')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Warning Message' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Confirm' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Blocked Websites' }),
    ).toBeInTheDocument();
  });
});
