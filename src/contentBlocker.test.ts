import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { maybeBlock } from './contentBlocker';
import { getOptions } from './utils/storage';
import type { IExtensionOptions } from './utils/types';

vi.mock('./utils/storage', () => ({ getOptions: vi.fn() }));

const getOptionsMock = vi.mocked(getOptions);

function options(
  overrides: Partial<IExtensionOptions> = {},
): IExtensionOptions {
  return {
    warningMessage: 'Blocked',
    enableConfirm: false,
    websites: [{ address: 'x.com' }],
    ...overrides,
  };
}

describe('maybeBlock', () => {
  let writeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.spyOn(document, 'open').mockImplementation(() => document);
    vi.spyOn(document, 'close').mockImplementation(() => undefined);
    writeSpy = vi.spyOn(document, 'write').mockImplementation(() => undefined);
    // jsdom does not implement window.stop, and confirm needs to be scripted.
    vi.stubGlobal('stop', vi.fn());
    vi.stubGlobal('confirm', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('does nothing when the hostname is not blocked', async () => {
    getOptionsMock.mockResolvedValue(
      options({ websites: [{ address: 'x.com' }] }),
    );

    await maybeBlock('www.imgix.com');

    expect(writeSpy).not.toHaveBeenCalled();
  });

  it('blocks immediately when confirmation is disabled', async () => {
    getOptionsMock.mockResolvedValue(
      options({ enableConfirm: false, warningMessage: 'Get back to work' }),
    );

    await maybeBlock('www.x.com');

    expect(writeSpy).toHaveBeenCalledOnce();
    expect(writeSpy.mock.calls[0][0]).toContain('Get back to work');
    expect(window.stop).toHaveBeenCalled();
  });

  it('blocks when the user declines the confirmation', async () => {
    getOptionsMock.mockResolvedValue(options({ enableConfirm: true }));
    vi.mocked(window.confirm).mockReturnValue(false);

    await maybeBlock('x.com');

    expect(writeSpy).toHaveBeenCalledOnce();
  });

  it('does not block when the user accepts the confirmation', async () => {
    getOptionsMock.mockResolvedValue(options({ enableConfirm: true }));
    vi.mocked(window.confirm).mockReturnValue(true);

    await maybeBlock('x.com');

    expect(writeSpy).not.toHaveBeenCalled();
  });
});
