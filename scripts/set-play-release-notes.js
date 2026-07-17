// Sets the Play "What's new" text for the latest release on a track.
// EAS submit can't set Android release notes, so this runs after each
// daily submission lands: node scripts/set-play-release-notes.js [track]
// Reads the notes from release-notes/v<releaseName>.txt (max 500 chars).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KEY_PATH = path.join(__dirname, '..', 'google-service-account.json');
const PKG = 'app.stridehub.toss';
const TRACK = process.argv[2] || 'alpha';
const LANGUAGE = 'en-US';

const b64url = (buf) => Buffer.from(buf).toString('base64url');

async function getAccessToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/androidpublisher',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${signer.sign(key.private_key, 'base64url')}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${jwt}`,
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(`auth failed: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function main() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const token = await getAccessToken(key);
  const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const base = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PKG}`;

  const edit = await (await fetch(`${base}/edits`, { method: 'POST', headers: auth })).json();
  if (!edit.id) throw new Error(`edit create failed: ${JSON.stringify(edit)}`);

  try {
    const track = await (
      await fetch(`${base}/edits/${edit.id}/tracks/${TRACK}`, { headers: auth })
    ).json();
    const release = track.releases?.[0];
    if (!release) throw new Error(`no releases on track ${TRACK}`);

    const notesPath = path.join(__dirname, '..', 'release-notes', `v${release.name}.txt`);
    const text = fs.readFileSync(notesPath, 'utf8').trim();
    if (text.length > 500) throw new Error(`notes are ${text.length} chars (Play limit is 500)`);

    release.releaseNotes = [{ language: LANGUAGE, text }];
    const updated = await (
      await fetch(`${base}/edits/${edit.id}/tracks/${TRACK}`, {
        method: 'PUT',
        headers: auth,
        body: JSON.stringify({ track: TRACK, releases: [release] }),
      })
    ).json();
    if (updated.error) throw new Error(`track update failed: ${JSON.stringify(updated.error)}`);

    const committed = await (
      await fetch(`${base}/edits/${edit.id}:commit`, { method: 'POST', headers: auth })
    ).json();
    if (committed.error) throw new Error(`commit failed: ${JSON.stringify(committed.error)}`);

    console.log(`Release notes set for ${release.name} (versionCode ${release.versionCodes?.[0]}) on ${TRACK}`);
  } catch (e) {
    await fetch(`${base}/edits/${edit.id}`, { method: 'DELETE', headers: auth }).catch(() => {});
    throw e;
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
