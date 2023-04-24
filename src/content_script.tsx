import { getOptions } from './utils/storage';
import type { IExtensionOptions } from './utils/types';

async function run() {
  const options = await getOptions();

  if (
    !options.websites.some(website =>
      window.location.origin
        .toLowerCase()
        .includes(website.address.toLowerCase()),
    )
  ) {
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

function blockPage(options: IExtensionOptions) {
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

run();
