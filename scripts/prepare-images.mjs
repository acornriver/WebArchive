import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Originals remain untouched. Content hashes deduplicate identical images.
const root = process.cwd();
const projects = JSON.parse(await readFile('src/data/projects.json', 'utf8'));
const sources = [...new Set(projects.flatMap(p => [p.thumbnail, ...p.images]).filter(Boolean))];
const output = path.join(root, 'public/media');
await mkdir(output, { recursive: true });
const manifest = {};
let originalBytes = 0;
const generated = new Set();
for (const source of sources) {
    const input = await readFile(path.join(root, 'public', source));
    originalBytes += input.length;
    const hash = createHash('sha256').update(input).update('webp-v1-q82').digest('hex').slice(0, 16);
    const meta = await sharp(input).metadata();
    const rotated = [5, 6, 7, 8].includes(meta.orientation);
    const width = rotated ? meta.height : meta.width;
    const height = rotated ? meta.width : meta.height;
    const widths = [...new Set([640, 1280, 1920].map(w => Math.min(w, width)))];
    const variants = [];
    for (const w of widths) {
        const file = `${hash}-${w}.webp`;
        const dest = path.join(output, file);
        try { await stat(dest); } catch {
            await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
        }
        generated.add(dest);
        variants.push({ src: `/media/${file}`, width: w });
    }
    manifest[source] = { width, height, src: variants.at(-1).src, variants };
}
await writeFile('src/data/image-assets.json', JSON.stringify(manifest, null, 2) + '\n');
let total = 0;
for (const file of generated) total += (await stat(file)).size;
console.log(`Images: ${sources.length} sources, ${(originalBytes / 1048576).toFixed(1)} MB → ${(total / 1048576).toFixed(1)} MB for all responsive variants.`);
