import type { IExtensionOptions } from './types';

export async function getOptions(onLoad?: (data: IExtensionOptions) => void) {
  return new Promise<IExtensionOptions>(resolve => {
    chrome.storage.sync.get(
      {
        warningMessage:
          'You are trying to access a website that is marked as restricted.',
        websites: [],
        enableConfirm: true,
      } as IExtensionOptions,
      items => {
        onLoad?.(items as IExtensionOptions);
        resolve(items as IExtensionOptions);
      },
    );
  });
}

export async function setOptions(data: IExtensionOptions) {
  return new Promise<void>(resolve => {
    chrome.storage.sync.set(data, resolve);
  });
}
