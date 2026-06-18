import { useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { sanitizeOptions } from '../utils/options';
import { getOptions, setOptions } from '../utils/storage';
import type { IExtensionOptions } from '../utils/types';

export type SaveStatus = 'saving' | 'saved';

const DEBOUNCE_MS = 400;

/**
 * Loads the persisted options into the form, then automatically saves any
 * change (debounced) so edits can't be lost by forgetting to click a button.
 * A pending save is flushed immediately if the page is hidden/closed. Returns
 * the current save status for display.
 */
export function useAutoSaveOptions(
  form: UseFormReturn<IExtensionOptions>,
): SaveStatus {
  const { reset, watch } = form;
  const [status, setStatus] = useState<SaveStatus>('saved');

  // Serialized snapshot of what is currently in storage.
  const lastSaved = useRef<string>('');
  // Latest sanitized options awaiting a write, if any.
  const pending = useRef<IExtensionOptions | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // Load persisted options once on mount. lastSaved is seeded before reset so
  // the reset-triggered change below is recognized as a no-op.
  useEffect(() => {
    getOptions(data => {
      lastSaved.current = JSON.stringify(sanitizeOptions(data));
      reset(data);
    });
  }, [reset]);

  // Auto-save on change, and flush before the page goes away.
  useEffect(() => {
    const flush = () => {
      clearTimeout(timer.current);
      if (!pending.current) {
        return;
      }
      const data = pending.current;
      pending.current = null;
      setOptions(data);
      lastSaved.current = JSON.stringify(data);
      setStatus('saved');
    };

    const subscription = watch(value => {
      const sanitized = sanitizeOptions(value as IExtensionOptions);
      const snapshot = JSON.stringify(sanitized);

      // Nothing that gets persisted has changed (initial load, or typing inside
      // an incomplete row). Cancel any pending write and report saved.
      if (snapshot === lastSaved.current) {
        pending.current = null;
        clearTimeout(timer.current);
        setStatus('saved');
        return;
      }

      pending.current = sanitized;
      setStatus('saving');
      clearTimeout(timer.current);
      timer.current = setTimeout(flush, DEBOUNCE_MS);
    });

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flush();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimeout(timer.current);
    };
  }, [watch]);

  return status;
}
