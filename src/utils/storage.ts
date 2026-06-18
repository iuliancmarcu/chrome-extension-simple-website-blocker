import { DEFAULT_OPTIONS } from './options';
import type { IExtensionOptions } from './types';

export async function getOptions(onLoad?: (data: IExtensionOptions) => void) {
  return new Promise<IExtensionOptions>(resolve => {
    chrome.storage.sync.get(DEFAULT_OPTIONS, items => {
      onLoad?.(items as IExtensionOptions);
      resolve(items as IExtensionOptions);
    });
  });
}

export async function setOptions(data: IExtensionOptions) {
  return new Promise<void>(resolve => {
    chrome.storage.sync.set(data, resolve);
  });
}
