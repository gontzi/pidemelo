import fs from 'node:fs';
import path from 'node:path';

const nextServerPath = path.join(
  'node_modules',
  'next',
  'dist',
  'server',
  'next-server.js',
);

if (!fs.existsSync(nextServerPath)) {
  throw new Error(`Next.js server file not found: ${nextServerPath}`);
}

const original = fs.readFileSync(nextServerPath, 'utf8');
const methodPattern = /getMiddlewareManifest\(\)\s*\{\s*if\s*\(this\.minimalMode\)\s*return\s+null;\s*const\s+manifest\s*=\s*require\(this\.middlewareManifestPath\);\s*return\s+manifest;\s*\}/;
const replacement = 'getMiddlewareManifest() { return null; }';

if (original.includes(replacement)) {
  process.stdout.write('Next.js middleware manifest workaround already applied.\n');
  process.exit(0);
}

if (!methodPattern.test(original)) {
  throw new Error(
    'Next.js middleware manifest method changed; refusing to apply an unknown patch.',
  );
}

fs.writeFileSync(nextServerPath, original.replace(methodPattern, replacement));
process.stdout.write('Patched Next.js to skip its duplicate middleware manifest load.\n');
