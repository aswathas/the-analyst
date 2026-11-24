import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, basename } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifestPath = join(root, 'dist-pdf', 'manifest.json');
const publishedPath = join(root, 'dist-pdf', 'published.json');

const REPO = 'aswathas/the-analyst';
const RELEASE_TAG = 'sem7-master-pdfs';
const FOLDER_NAME = 'Sem 7 Master PDFs';
const SITE_BASE = 'https://sem6-prep-for-me.vercel.app';

if (!existsSync(manifestPath)) {
  throw new Error('dist-pdf/manifest.json is missing. Run `npm run pdf:build` first.');
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

// `gws` is an npm shim (.cmd on Windows), so invoke its Node entry directly.
// This keeps every call as execFileSync with an args array and never a shell string.
const gwsEntry = join(
  process.env.APPDATA || process.env.HOME || '',
  'npm',
  'node_modules',
  '@googleworkspace',
  'cli',
  'run.js',
);

function exec(command, args, label) {
  console.log(`\n$ ${label ?? command} ${args.join(' ')}`);
  try {
    const output = execFileSync(command, args, {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    console.log(`  exit 0`);
    return output;
  } catch (error) {
    console.error(`  exit ${error.status ?? 'error'}`);
    if (error.stdout) console.error(error.stdout.trim());
    if (error.stderr) console.error(error.stderr.trim());
    throw error;
  }
}

const gws = (args) =>
  exec(process.execPath, [gwsEntry, ...args], 'gws');
const gh = (args) => exec('gh', args);

function parseJson(raw, what) {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error(`Could not parse JSON from ${what}: ${raw.slice(0, 300)}`);
  }
  return JSON.parse(raw.slice(start, end + 1));
}

function listFolder(folderId) {
  const raw = gws([
    'drive',
    'files',
    'list',
    '--params',
    JSON.stringify({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id,name)',
      pageSize: 1000,
    }),
  ]);
  return parseJson(raw, 'folder listing').files ?? [];
}

console.log('Checking Drive authentication...');
const auth = gws(['auth', 'status']);
if (!/"token_valid":\s*true/.test(auth) || !/"storage":\s*"encrypted"/.test(auth)) {
  throw new Error('gws is not authenticated. Run `gws auth login -s drive` in a terminal first.');
}
console.log('  gws is authenticated.');

console.log('\nFinding the Drive folder...');
const folderQuery = gws([
  'drive',
  'files',
  'list',
  '--params',
  JSON.stringify({
    q: `name = '${FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id,name)',
    pageSize: 10,
  }),
]);
let folderId = parseJson(folderQuery, 'folder lookup').files?.[0]?.id;
if (folderId) {
  console.log(`  Reusing folder ${folderId}`);
} else {
  const created = gws([
    'drive',
    'files',
    'create',
    '--json',
    JSON.stringify({ name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }),
  ]);
  folderId = parseJson(created, 'folder creation').id;
  console.log(`  Created folder ${folderId}`);
}
const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;

const existing = new Map(listFolder(folderId).map((f) => [f.name, f.id]));
const published = {};

for (const [code, entry] of Object.entries(manifest)) {
  const filePath = join(root, 'dist-pdf', entry.file);
  if (!existsSync(filePath)) {
    throw new Error(`Missing generated PDF ${filePath}. Re-run \`npm run pdf:build\`.`);
  }

  let fileId = existing.get(entry.file);
  if (fileId) {
    // The file exists but holds the previous build's bytes. Replace the content.
    gws([
      'drive',
      'files',
      'update',
      '--params',
      JSON.stringify({ fileId, supportsAllDrives: true }),
      '--upload',
      filePath,
      '--upload-content-type',
      'application/pdf',
    ]);
    console.log(`\n${code}: updated Drive file ${fileId} with the new build (${entry.file})`);
  } else {
    const uploaded = gws([
      'drive',
      '+upload',
      filePath,
      '--parent',
      folderId,
      '--name',
      entry.file,
    ]);
    fileId = parseJson(uploaded, `upload ${code}`).id;
    console.log(`${code}: uploaded ${entry.file} as ${fileId}`);
  }

  // Public Drive links are blocked on this Workspace account (publishOutNotPermitted).
  // The Drive file is the owner's working copy; the student link is the site's own URL.
  try {
    gws([
      'drive',
      'permissions',
      'create',
      '--params',
      JSON.stringify({ fileId, supportsAllDrives: true, sendNotificationEmail: false }),
      '--json',
      JSON.stringify({ role: 'reader', type: 'domain', domain: 'aichargelabs.com' }),
    ]);
  } catch (error) {
    console.warn(`  Drive permission for ${code} reported an error; the file is still the owner's working copy.`);
  }

  published[code] = {
    siteUrl: `${SITE_BASE}/master-pdfs/${basename(entry.file)}`,
    releaseUrl: `https://github.com/${REPO}/releases/download/${RELEASE_TAG}/${basename(entry.file)}`,
    driveUrl: `https://drive.google.com/file/d/${fileId}/view`,
    pages: entry.pages,
  };
}

const files = Object.values(manifest).map((entry) => join(root, 'dist-pdf', entry.file));
let releaseExists = true;
try {
  gh(['release', 'view', RELEASE_TAG, '--repo', REPO]);
} catch {
  releaseExists = false;
}

if (releaseExists) {
  console.log(`\nUpdating existing GitHub release ${RELEASE_TAG}...`);
  gh(['release', 'upload', RELEASE_TAG, ...files, '--clobber', '--repo', REPO]);
} else {
  console.log(`\nCreating GitHub release ${RELEASE_TAG}...`);
  gh([
    'release',
    'create',
    RELEASE_TAG,
    ...files,
    '--repo',
    REPO,
    '--title',
    'Sem 7 Master PDFs',
    '--notes',
    `Student-made, unofficial sem 7 master PDFs. Drive mirror: ${folderUrl}. Not affiliated with or endorsed by SRMIST.`,
  ]);
}

writeFileSync(publishedPath, JSON.stringify(published, null, 2) + '\n');
console.log(`\nDrive folder: ${folderUrl}`);
console.log(`GitHub release: https://github.com/${REPO}/releases/tag/${RELEASE_TAG}`);
console.log(`Wrote ${publishedPath}`);

// --- write the `pdf` field back into each subject data file ---------------------
const SUBJECT_FILES = {
  '21CSE435T': 'src/data/subjects/21cse435t.ts',
  '21CSE432T': 'src/data/subjects/21cse432t.ts',
  '21CSE433T': 'src/data/subjects/21cse433t.ts',
  '21CSE436T': 'src/data/subjects/21cse436t.ts',
  '21MEO104T': 'src/data/subjects/21meo104t.ts',
};

for (const [code, relPath] of Object.entries(SUBJECT_FILES)) {
  const filePath = join(root, relPath);
  if (!existsSync(filePath)) {
    console.warn(`  ${code}: ${relPath} not found, skipping pdf field`);
    continue;
  }
  const entry = published[code];
  if (!entry) {
    console.warn(`  ${code}: no published entry, skipping pdf field`);
    continue;
  }
  let src = readFileSync(filePath, 'utf8');
  const pdfLiteral = `pdf: {\n    siteUrl: '${entry.siteUrl}',\n    releaseUrl: '${entry.releaseUrl}',\n    driveUrl: '${entry.driveUrl}',\n    pages: ${entry.pages},\n  },`;

  if (/^\s*pdf:\s*\{/m.test(src)) {
    src = src.replace(/^\s*pdf:\s*\{[\s\S]*?\n\s*\},/m, pdfLiteral);
  } else {
    // Insert before the closing brace of the spec object: the last "};" in the file.
    const marker = src.lastIndexOf('};');
    if (marker === -1) {
      console.warn(`  ${code}: could not find the spec object end, skipping pdf field`);
      continue;
    }
    src = `${src.slice(0, marker)}  ${pdfLiteral}\n${src.slice(marker)}`;
  }
  writeFileSync(filePath, src);
  console.log(`  ${code}: wrote pdf field into ${relPath}`);
}
