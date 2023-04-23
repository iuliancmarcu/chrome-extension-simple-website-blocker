import { useCallback, useEffect } from 'react';

import type { IExtensionOptions } from '../utils/types';

export function useExtensionOptions(onLoad: (data: IExtensionOptions) => void) {
  useEffect(() => {
    chrome.storage.sync.get(
      {
        warningMessage:
          'You are trying to access a website that is marked as restricted.',
        websites: [],
        enableDismiss: true,
      } as IExtensionOptions,
      items => onLoad(items as IExtensionOptions),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveOptions = useCallback((data: IExtensionOptions) => {
    chrome.storage.sync.set(data);
  }, []);

  return saveOptions;
}
