import { describe, expect, it } from 'vitest';

import { DEFAULT_OPTIONS, sanitizeOptions } from './options';

describe('DEFAULT_OPTIONS', () => {
  it('has a non-empty warning message, no websites, and confirmation on', () => {
    expect(DEFAULT_OPTIONS.warningMessage.length).toBeGreaterThan(0);
    expect(DEFAULT_OPTIONS.websites).toEqual([]);
    expect(DEFAULT_OPTIONS.enableConfirm).toBe(true);
  });
});

describe('sanitizeOptions', () => {
  it('drops empty and invalid website rows', () => {
    const result = sanitizeOptions({
      warningMessage: 'Blocked',
      enableConfirm: true,
      websites: [{ address: '' }, { address: 'xcom' }, { address: 'x.com' }],
    });

    expect(result.websites).toEqual([{ address: 'x.com' }]);
  });

  it('normalizes kept website addresses', () => {
    const result = sanitizeOptions({
      warningMessage: 'Blocked',
      enableConfirm: true,
      websites: [{ address: 'https://www.Reddit.com/r/all' }],
    });

    expect(result.websites).toEqual([{ address: 'reddit.com' }]);
  });

  it('falls back to the default warning message when blank', () => {
    expect(
      sanitizeOptions({
        warningMessage: '   ',
        enableConfirm: true,
        websites: [],
      }).warningMessage,
    ).toBe(DEFAULT_OPTIONS.warningMessage);
  });

  it('keeps a non-blank warning message as written', () => {
    expect(
      sanitizeOptions({
        warningMessage: 'Get back to work!',
        enableConfirm: true,
        websites: [],
      }).warningMessage,
    ).toBe('Get back to work!');
  });

  it('preserves the enableConfirm flag', () => {
    expect(
      sanitizeOptions({
        warningMessage: 'Blocked',
        enableConfirm: false,
        websites: [],
      }).enableConfirm,
    ).toBe(false);
  });
});
