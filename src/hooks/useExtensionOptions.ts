import { useCallback, useEffect } from 'react';

import { getOptions } from '../utils/storage';
import type { IExtensionOptions } from '../utils/types';

export function useExtensionOptions(onLoad: (data: IExtensionOptions) => void) {
  useEffect(() => {
    getOptions(onLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveOptions = useCallback((data: IExtensionOptions) => {
    chrome.storage.sync.set(data);
  }, []);

  return saveOptions;
}
