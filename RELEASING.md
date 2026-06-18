# Releasing

Publishing to the Chrome Web Store is automated by
[`.github/workflows/publish.yml`](.github/workflows/publish.yml): pushing a `v*`
tag builds the extension and uploads + publishes it via
[`chrome-webstore-upload-cli`](https://github.com/fregante/chrome-webstore-upload-cli).

## One-time setup

The workflow needs five repository secrets. You only have to do this once.

1. **Enable the API.** In the [Google Cloud Console](https://console.cloud.google.com/),
   create (or pick) a project and enable the **Chrome Web Store API**.
2. **Create an OAuth client.** APIs & Services → Credentials → *Create credentials* →
   *OAuth client ID* → application type **Desktop app**. Note the **Client ID** and
   **Client secret**. (Configure the OAuth consent screen if prompted; you can leave it
   in "testing" and add yourself as a test user.)
3. **Get a refresh token.** Follow the CLI's guide:
   <https://github.com/fregante/chrome-webstore-upload-keys>. It walks through the OAuth
   consent flow and prints a **refresh token**.
4. **Find the extension ID and publisher ID.** The **extension ID** is the long id in the
   item's Web Store URL / Developer Dashboard (the extension must already exist on the store —
   the first upload of a brand-new item is done manually through the dashboard). The
   **publisher ID** is your developer-account id, shown in the Developer Dashboard URL while
   logged in: `chrome.google.com/webstore/devconsole/<PUBLISHER_ID>`.
5. **Add the secrets.** Repo → Settings → Secrets and variables → Actions → *New
   repository secret*, for each of:

   | Secret          | Value                                       |
   | --------------- | ------------------------------------------- |
   | `EXTENSION_ID`  | The extension's store ID                    |
   | `PUBLISHER_ID`  | Your Chrome Web Store developer-account ID  |
   | `CLIENT_ID`     | OAuth client ID                             |
   | `CLIENT_SECRET` | OAuth client secret                         |
   | `REFRESH_TOKEN` | Refresh token from step 3                   |

> **Heads up:** a refresh token that goes unused for ~6 months is revoked by Google. If
> releases are infrequent, re-generate it (step 3) or run a periodic job that exercises
> the credentials.

## Cutting a release

1. Bump the version in **both** [`public/manifest.json`](public/manifest.json) and
   [`package.json`](package.json) (keep them in sync — the workflow fails if the tag and
   `manifest.json` disagree).
2. Commit the bump.
3. Tag and push:

   ```bash
   git tag v0.0.2
   git push origin v0.0.2
   ```

4. Watch the **publish** workflow in the Actions tab. On success the new version is
   submitted to the Web Store (it may then sit in Google's review queue before going live).

## Building locally

```bash
npm ci
npm test
npm run build   # outputs the unpacked extension to dist/
```

Load `dist/` via `chrome://extensions` → *Load unpacked* to test before tagging.
