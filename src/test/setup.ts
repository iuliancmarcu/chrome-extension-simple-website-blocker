import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Keep tests isolated: unmount React trees, restore stubbed globals (e.g. the
// chrome mock) and any fake timers between tests.
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
