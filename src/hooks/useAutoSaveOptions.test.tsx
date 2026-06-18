import { act, renderHook, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import { installChromeMock } from '../test/chromeMock';
import type { IExtensionOptions } from '../utils/types';
import { useAutoSaveOptions } from './useAutoSaveOptions';

function setup() {
  return renderHook(() => {
    const form = useForm<IExtensionOptions>();
    const status = useAutoSaveOptions(form);
    return { form, status };
  });
}

describe('useAutoSaveOptions', () => {
  it('loads stored options into the form', async () => {
    installChromeMock({
      warningMessage: 'Stay focused',
      websites: [{ address: 'x.com' }],
      enableConfirm: true,
    });

    const { result } = setup();

    await waitFor(() =>
      expect(result.current.form.getValues('warningMessage')).toBe(
        'Stay focused',
      ),
    );
    expect(result.current.form.getValues('websites')).toEqual([
      { address: 'x.com' },
    ]);
  });

  it('auto-saves a change after the debounce and reports status', async () => {
    const chrome = installChromeMock({
      warningMessage: 'old',
      websites: [],
      enableConfirm: true,
    });
    const { result } = setup();
    await waitFor(() =>
      expect(result.current.form.getValues('warningMessage')).toBe('old'),
    );

    act(() => {
      result.current.form.setValue('warningMessage', 'new message', {
        shouldDirty: true,
      });
    });
    expect(result.current.status).toBe('saving');

    await waitFor(() => expect(result.current.status).toBe('saved'));
    expect(chrome.set).toHaveBeenCalled();
    expect(chrome.store.warningMessage).toBe('new message');
  });

  it('flushes a pending save when the page is hidden', async () => {
    const chrome = installChromeMock({
      warningMessage: 'old',
      websites: [],
      enableConfirm: true,
    });
    const { result } = setup();
    await waitFor(() =>
      expect(result.current.form.getValues('warningMessage')).toBe('old'),
    );

    act(() => {
      result.current.form.setValue('warningMessage', 'flushed', {
        shouldDirty: true,
      });
    });
    expect(result.current.status).toBe('saving');

    act(() => {
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        configurable: true,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(chrome.set).toHaveBeenCalled();
    expect(chrome.store.warningMessage).toBe('flushed');
    expect(result.current.status).toBe('saved');

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true,
    });
  });

  it('does not persist when typing an incomplete website row', async () => {
    const chrome = installChromeMock({
      warningMessage: 'old',
      websites: [],
      enableConfirm: true,
    });
    const { result } = setup();
    await waitFor(() =>
      expect(result.current.form.getValues('warningMessage')).toBe('old'),
    );

    act(() => {
      result.current.form.setValue('websites', [{ address: 'inv' }], {
        shouldDirty: true,
      });
    });

    expect(chrome.set).not.toHaveBeenCalled();
    expect(result.current.status).toBe('saved');
  });
});
