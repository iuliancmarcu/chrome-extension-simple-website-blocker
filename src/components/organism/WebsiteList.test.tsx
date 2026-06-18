import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import type { IExtensionOptions } from '../../utils/types';
import { WebsiteList } from './WebsiteList';

function renderWebsiteList(websites: { address: string }[] = []) {
  function Wrapper() {
    const methods = useForm<IExtensionOptions>({ defaultValues: { websites } });
    return (
      <FormProvider {...methods}>
        <WebsiteList />
      </FormProvider>
    );
  }

  return render(<Wrapper />);
}

const addressInputs = () => screen.getAllByPlaceholderText(/Website address/);
const removeIcons = () =>
  screen
    .getAllByRole('button')
    .filter(element => element.tagName.toLowerCase() === 'svg');

describe('WebsiteList', () => {
  it('renders an input for each blocked website', () => {
    renderWebsiteList([{ address: 'x.com' }, { address: 'reddit.com' }]);

    const inputs = addressInputs();
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveValue('x.com');
    expect(inputs[1]).toHaveValue('reddit.com');
  });

  it('shows an empty state when there are no websites', () => {
    renderWebsiteList([]);

    expect(screen.getByText('No websites found.')).toBeInTheDocument();
  });

  it('prepends an empty row when the add button is clicked', async () => {
    renderWebsiteList([{ address: 'x.com' }]);

    await userEvent.click(screen.getByTitle('Add new website'));

    const inputs = addressInputs();
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveValue('');
    expect(inputs[1]).toHaveValue('x.com');
  });

  it('removes a row when its remove icon is clicked', async () => {
    renderWebsiteList([{ address: 'x.com' }]);

    expect(removeIcons()).toHaveLength(1);
    await userEvent.click(removeIcons()[0]);

    expect(screen.queryByDisplayValue('x.com')).not.toBeInTheDocument();
    expect(screen.getByText('No websites found.')).toBeInTheDocument();
  });

  it('filters the list by the search query', async () => {
    renderWebsiteList([{ address: 'x.com' }, { address: 'reddit.com' }]);

    await userEvent.type(screen.getByPlaceholderText('Search...'), 'red');

    expect(screen.getByDisplayValue('reddit.com')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('x.com')).not.toBeInTheDocument();
  });

  it('normalizes a pasted URL to a bare domain on blur', async () => {
    renderWebsiteList([{ address: '' }]);
    const input = addressInputs()[0];

    await userEvent.type(input, 'https://www.Example.com/path');
    await userEvent.tab();

    expect(input).toHaveValue('example.com');
  });
});
