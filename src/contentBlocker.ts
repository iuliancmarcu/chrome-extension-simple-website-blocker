import { isBlocked } from './utils/matching';
import { getOptions } from './utils/storage';
import type { IExtensionOptions } from './utils/types';

/** Replace the current page with the "Blocked" notice and stop loading. */
export function blockPage(options: IExtensionOptions) {
  document.open();
  document.write(`
    <html>
      <head>
        <title>Blocked</title>
      </head>
      <body>
        <h1>Blocked</h1>
        <p>${options.warningMessage}</p>
      </body>
    </html>
  `);
  document.close();

  window.stop();
}

/**
 * Block the given hostname (defaulting to the current page) if it matches the
 * user's blocklist. When confirmation is enabled, the user is given a chance to
 * proceed before the page is blocked.
 */
export async function maybeBlock(
  hostname: string = window.location.hostname,
): Promise<void> {
  const options = await getOptions();

  if (!isBlocked(hostname, options.websites)) {
    return;
  }

  if (!options.enableConfirm) {
    blockPage(options);
    return;
  }

  if (
    !window.confirm(
      `This website was blocked. Do you want to proceed to the website?`,
    )
  ) {
    blockPage(options);
  }
}
