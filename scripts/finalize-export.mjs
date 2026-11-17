import { readFile, access, rm, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
// Verify that every original project image has a generated replacement before
// excluding source assets from the deployment. Files in public/ remain intact.
const projects = JSON.parse(await readFile('src/data/projects.json', 'utf8'));
const assets = JSON.parse(await readFile('src/data/image-assets.json', 'utf8'));
for (const source of projects.flatMap(p => [p.thumbnail, ...p.images]).filter(Boolean)) {
    if (!assets[source]) throw new Error(`Missing optimized asset: ${source}`);
    for (const variant of assets[source].variants) await access(path.join('out', variant.src));
}
await rm('out/asset', { recursive: true, force: true });
await mkdir('out/licenses', { recursive: true });
await copyFile('src/app/fonts/OFL.txt', 'out/licenses/IBM-Plex-Mono-OFL.txt');
await copyFile('CNAME', 'out/CNAME');
console.log('Export uses responsive images; source assets are preserved locally.');
