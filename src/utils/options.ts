import { isValidAddress, normalizeAddress } from './matching';
import type { IExtensionOptions } from './types';

/** The options used before the user has saved anything. */
export const DEFAULT_OPTIONS: IExtensionOptions = {
  warningMessage:
    'You are trying to access a website that is marked as restricted.',
  websites: [],
  enableConfirm: true,
};

/**
 * Produce the options that should actually be persisted: drop website rows that
 * are empty or malformed, normalize the survivors to bare domains, and fall back
 * to the default warning message when it has been left blank. This lets the form
 * hold half-typed rows without writing garbage to storage.
 */
export function sanitizeOptions(data: IExtensionOptions): IExtensionOptions {
  return {
    warningMessage: data.warningMessage?.trim()
      ? data.warningMessage
      : DEFAULT_OPTIONS.warningMessage,
    enableConfirm: data.enableConfirm,
    websites: (data.websites ?? [])
      .filter(website => isValidAddress(website.address))
      .map(website => ({ address: normalizeAddress(website.address) })),
  };
}
