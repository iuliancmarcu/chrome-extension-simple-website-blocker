import { describe, expect, it } from 'vitest';

import {
  hostnameMatchesDomain,
  isBlocked,
  isValidAddress,
  normalizeAddress,
} from './matching';

describe('normalizeAddress', () => {
  it('lowercases and trims', () => {
    expect(normalizeAddress('  X.COM  ')).toBe('x.com');
  });

  it('strips the protocol', () => {
    expect(normalizeAddress('https://x.com')).toBe('x.com');
    expect(normalizeAddress('http://x.com')).toBe('x.com');
  });

  it('strips a leading www.', () => {
    expect(normalizeAddress('www.x.com')).toBe('x.com');
  });

  it('strips path, query, hash and port', () => {
    expect(normalizeAddress('https://www.x.com:8080/path?q=1#h')).toBe('x.com');
  });

  it('keeps non-www subdomains intact', () => {
    expect(normalizeAddress('sub.x.com')).toBe('sub.x.com');
  });
});

describe('isValidAddress', () => {
  it('accepts bare domains', () => {
    expect(isValidAddress('x.com')).toBe(true);
    expect(isValidAddress('sub.example.co.uk')).toBe(true);
  });

  it('accepts addresses that normalize to a domain', () => {
    expect(isValidAddress('https://www.x.com/path')).toBe(true);
  });

  it('rejects values without a dot', () => {
    expect(isValidAddress('xcom')).toBe(false);
  });

  it('rejects empty input', () => {
    expect(isValidAddress('')).toBe(false);
    expect(isValidAddress('   ')).toBe(false);
  });
});

describe('hostnameMatchesDomain', () => {
  it('matches an exact host', () => {
    expect(hostnameMatchesDomain('x.com', 'x.com')).toBe(true);
  });

  it('matches subdomains of the blocked domain', () => {
    expect(hostnameMatchesDomain('www.x.com', 'x.com')).toBe(true);
    expect(hostnameMatchesDomain('m.x.com', 'x.com')).toBe(true);
    expect(hostnameMatchesDomain('a.b.x.com', 'x.com')).toBe(true);
  });

  it('does not match an unrelated host that merely ends in the domain', () => {
    expect(hostnameMatchesDomain('imgix.com', 'x.com')).toBe(false);
    expect(hostnameMatchesDomain('notx.com', 'x.com')).toBe(false);
  });

  it('does not match a suffix-spoofing host', () => {
    expect(hostnameMatchesDomain('x.com.evil.com', 'x.com')).toBe(false);
  });

  it('treats a stored www. domain the same as the bare domain', () => {
    expect(hostnameMatchesDomain('x.com', 'www.x.com')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(hostnameMatchesDomain('WWW.X.COM', 'x.com')).toBe(true);
  });

  it('never matches an empty domain', () => {
    expect(hostnameMatchesDomain('x.com', '')).toBe(false);
  });
});

describe('isBlocked', () => {
  it('does not block imgix.com when x.com is blocked (the reported bug)', () => {
    expect(isBlocked('www.imgix.com', [{ address: 'x.com' }])).toBe(false);
  });

  it('blocks the domain and its subdomains', () => {
    expect(isBlocked('x.com', [{ address: 'x.com' }])).toBe(true);
    expect(isBlocked('www.x.com', [{ address: 'x.com' }])).toBe(true);
  });

  it('blocks a subdomain when a www. domain was stored', () => {
    expect(isBlocked('m.x.com', [{ address: 'www.x.com' }])).toBe(true);
  });

  it('matches against any entry in the list', () => {
    const list = [{ address: 'x.com' }, { address: 'reddit.com' }];
    expect(isBlocked('old.reddit.com', list)).toBe(true);
  });

  it('blocks nothing when the list is empty', () => {
    expect(isBlocked('example.com', [])).toBe(false);
  });
});
