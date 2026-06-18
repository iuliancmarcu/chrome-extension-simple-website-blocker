import { vi } from 'vitest';

export interface ChromeMock {
  store: Record<string, unknown>;
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
}

/**
 * Install a minimal in-memory `chrome.storage.sync` on the global object.
 * `get(defaults, cb)` returns the defaults overlaid with anything stored;
 * `set(items, cb)` merges into the store. Restored between tests by
 * `vi.unstubAllGlobals()` in the shared setup file.
 */
export function installChromeMock(
  initial: Record<string, unknown> = {},
): ChromeMock {
  const store: Record<string, unknown> = { ...initial };

  const get = vi.fn(
    (
      defaults: Record<string, unknown>,
      callback: (items: Record<string, unknown>) => void,
    ) => {
      callback({ ...defaults, ...store });
    },
  );

  const set = vi.fn((items: Record<string, unknown>, callback?: () => void) => {
    Object.assign(store, items);
    callback?.();
  });

  vi.stubGlobal('chrome', { storage: { sync: { get, set } } });

  return { store, get, set };
}
