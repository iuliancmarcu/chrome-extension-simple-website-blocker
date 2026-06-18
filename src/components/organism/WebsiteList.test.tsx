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

  it('prompts for a first website and disables search when empty', () => {
    renderWebsiteList([]);

    expect(screen.getByText(/add your first website/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeDisabled();
    expect(screen.queryByText('No websites found.')).not.toBeInTheDocument();
  });

  it('keeps the add button available when the list is empty', () => {
    renderWebsiteList([]);

    expect(screen.getByTitle('Add new website')).toBeInTheDocument();
  });

  it('prepends an empty row when the add button is clicked', async () => {
    renderWebsiteList([{ address: 'x.com' }]);

    await userEvent.click(screen.getByTitle('Add new website'));

    const inputs = addressInputs();
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveValue('');
    expect(inputs[1]).toHaveValue('x.com');
  });

  it('removes a row and returns to the empty prompt', async () => {
    renderWebsiteList([{ address: 'x.com' }]);

    expect(removeIcons()).toHaveLength(1);
    await userEvent.click(removeIcons()[0]);

    expect(screen.queryByDisplayValue('x.com')).not.toBeInTheDocument();
    expect(screen.getByText(/add your first website/i)).toBeInTheDocument();
  });

  it('filters the list by the search query', async () => {
    renderWebsiteList([{ address: 'x.com' }, { address: 'reddit.com' }]);

    await userEvent.type(screen.getByPlaceholderText('Search...'), 'red');

    expect(screen.getByDisplayValue('reddit.com')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('x.com')).not.toBeInTheDocument();
  });

  it('shows "No websites found." only when a search matches nothing', async () => {
    renderWebsiteList([{ address: 'x.com' }]);

    await userEvent.type(screen.getByPlaceholderText('Search...'), 'zzz');

    expect(screen.getByText('No websites found.')).toBeInTheDocument();
    expect(
      screen.queryByText(/add your first website/i),
    ).not.toBeInTheDocument();
  });

  it('hides the add button while searching', async () => {
    renderWebsiteList([{ address: 'x.com' }]);
    expect(screen.getByTitle('Add new website')).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText('Search...'), 'x');

    expect(screen.queryByTitle('Add new website')).not.toBeInTheDocument();
  });

  it('normalizes a pasted URL to a bare domain on blur', async () => {
    renderWebsiteList([{ address: '' }]);
    const input = addressInputs()[0];

    await userEvent.type(input, 'https://www.Example.com/path');
    await userEvent.tab();

    expect(input).toHaveValue('example.com');
  });
});
