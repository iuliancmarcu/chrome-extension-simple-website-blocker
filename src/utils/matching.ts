import type { IWebsite } from './types';

/** The shape of a valid website address: a bare domain such as "google.com". */
export const WEBSITE_ADDRESS_PATTERN = /^[\w-]+(\.[\w-]+)+$/;

/**
 * Reduce a user-entered address to a bare hostname for comparison: lowercased,
 * trimmed, and stripped of protocol, port, path, and a leading "www.".
 *
 * The leading "www." is only removed when another label remains (so "www.com"
 * stays "www.com" rather than collapsing to "com").
 */
export function normalizeAddress(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, '') // protocol
    .replace(/[/?#].*$/, '') // path, query, hash
    .replace(/:\d+$/, '') // port
    .replace(/^www\.(?=.*\.)/, ''); // leading www.
}

/** Whether an entered address normalizes to a valid bare domain. */
export function isValidAddress(input: string): boolean {
  return WEBSITE_ADDRESS_PATTERN.test(normalizeAddress(input));
}

/**
 * Whether `hostname` should be blocked given a single blocked `domain`.
 * Matches the domain exactly or any of its subdomains, so "x.com" blocks
 * "x.com" and "www.x.com" but not "imgix.com".
 */
export function hostnameMatchesDomain(
  hostname: string,
  domain: string,
): boolean {
  const host = normalizeAddress(hostname);
  const target = normalizeAddress(domain);

  if (!target) {
    return false;
  }

  return host === target || host.endsWith(`.${target}`);
}

/** Whether `hostname` matches any blocked website in the list. */
export function isBlocked(hostname: string, websites: IWebsite[]): boolean {
  return websites.some(website =>
    hostnameMatchesDomain(hostname, website.address),
  );
}
