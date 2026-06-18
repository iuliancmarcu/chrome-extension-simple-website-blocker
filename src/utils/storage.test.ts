import { describe, expect, it, vi } from 'vitest';

import { installChromeMock } from '../test/chromeMock';
import { DEFAULT_OPTIONS } from './options';
import { getOptions, setOptions } from './storage';

describe('getOptions', () => {
  it('returns the defaults when nothing is stored', async () => {
    installChromeMock();

    await expect(getOptions()).resolves.toEqual(DEFAULT_OPTIONS);
  });

  it('overlays stored values on top of the defaults', async () => {
    installChromeMock({
      websites: [{ address: 'x.com' }],
      enableConfirm: false,
    });

    const options = await getOptions();

    expect(options.websites).toEqual([{ address: 'x.com' }]);
    expect(options.enableConfirm).toBe(false);
    expect(options.warningMessage).toBe(DEFAULT_OPTIONS.warningMessage);
  });

  it('invokes the onLoad callback with the loaded options', async () => {
    installChromeMock({ warningMessage: 'Stop' });
    const onLoad = vi.fn();

    await getOptions(onLoad);

    expect(onLoad).toHaveBeenCalledWith(
      expect.objectContaining({ warningMessage: 'Stop' }),
    );
  });
});

describe('setOptions', () => {
  it('writes the options to chrome.storage.sync', async () => {
    const chrome = installChromeMock();
    const data = {
      warningMessage: 'No entry',
      websites: [{ address: 'x.com' }],
      enableConfirm: true,
    };

    await setOptions(data);

    expect(chrome.set).toHaveBeenCalledWith(data, expect.any(Function));
    expect(chrome.store).toMatchObject(data);
  });
});
