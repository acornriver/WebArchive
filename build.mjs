import fs from 'fs';
import path from 'path';

const ASSET_DIR = 'asset/WebIndependence';
const OUTPUT_FILE = 'data.js';

// Helper to normalize paths (handle Mac NFD issues)
const normalize = (str) => str.normalize('NFC');

// Allowed image extensions
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

function buildData() {
    console.log('Building data.js from assets...');

    const projects = [];
    const assetPath = path.resolve(ASSET_DIR);

    if (!fs.existsSync(assetPath)) {
        console.error(`Asset directory not found: ${ASSET_DIR}`);
        return;
    }

    const items = fs.readdirSync(assetPath);

    items.forEach(item => {
        const itemPath = path.join(assetPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            // Skip CV folder for projects list
            if (item === 'CV') return;

            // Check for info.json
            const infoPath = path.join(itemPath, 'info.json');
            if (!fs.existsSync(infoPath)) {
                // console.warn(`Skipping ${item}: info.json not found.`);
                return;
            }

            try {
                const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
                const descPath = path.join(itemPath, 'description.md');
                let description = '';
                if (fs.existsSync(descPath)) {
                    description = fs.readFileSync(descPath, 'utf-8');
                }

                // Scan for images
                const files = fs.readdirSync(itemPath);
                let thumbnail = '';
                const images = [];

                files.forEach(file => {
                    const ext = path.extname(file).toLowerCase();
                    if (IMAGE_EXTS.includes(ext)) {
                        // Construct relative path for web
                        // Use forward slashes for web paths
                        const webPath = normalize(path.join(ASSET_DIR, item, file).split(path.sep).join('/'));

                        // Check if it's a thumbnail
                        // Logic: file name contains 'thumbnail' or '썸네일'
                        if (normalize(file).includes('thumbnail') || normalize(file).includes('썸네일')) {
                            thumbnail = webPath;
                        } else {
                            images.push(webPath);
                        }
                    }
                });

                // Sort images alphabetically to ensure consistent order
                images.sort();

                projects.push({
                    ...info,
                    thumbnail,
                    images,
                    description
                });

            } catch (e) {
                console.error(`Error processing ${item}:`, e);
            }
        }
    });

    // Sort projects by ID (p0, p1, p2...)
    projects.sort((a, b) => {
        const numA = parseInt(a.id.replace('p', ''));
        const numB = parseInt(b.id.replace('p', ''));
        return numA - numB;
    });

    // Read CV
    let cvData = '';
    const cvPath = path.join(assetPath, 'CV', 'cv.md');
    if (fs.existsSync(cvPath)) {
        cvData = fs.readFileSync(cvPath, 'utf-8');
    }

    // Generate File Content
    const fileContent = `export const projects = ${JSON.stringify(projects, null, 4)};

export const cvData = \`${cvData.replace(/`/g, '\\`')}\`;
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`Successfully generated ${OUTPUT_FILE} with ${projects.length} projects.`);
}

buildData();
