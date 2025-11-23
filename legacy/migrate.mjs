import fs from 'fs';
import path from 'path';
import { projects, cvData } from './data.js';

// Helper to normalize paths (handle Mac NFD issues)
const normalize = (str) => str.normalize('NFC');

console.log('Starting migration...');

// 1. Migrate Projects
projects.forEach(project => {
    // Find the directory path from the first image or thumbnail
    let dirPath = '';
    if (project.thumbnail) {
        dirPath = path.dirname(project.thumbnail);
    } else if (project.images && project.images.length > 0) {
        dirPath = path.dirname(project.images[0]);
    }

    if (!dirPath) {
        console.warn(`Skipping project ${project.title}: No image path found to determine directory.`);
        return;
    }

    // Normalize path for file system operations
    // Note: data.js paths are relative to root, e.g., 'asset/...'
    // We need to make sure we write to the correct absolute path or relative to CWD
    const fullDirPath = path.resolve(normalize(dirPath));

    if (!fs.existsSync(fullDirPath)) {
        console.warn(`Directory not found: ${fullDirPath}`);
        // Try to find it by listing parent dir and matching
        return;
    }

    // Create info.json
    const info = {
        id: project.id,
        title: project.title,
        year: project.year,
        category: project.category
    };

    fs.writeFileSync(path.join(fullDirPath, 'info.json'), JSON.stringify(info, null, 2));
    console.log(`Created info.json for ${project.title}`);

    // Create description.md
    if (project.description) {
        fs.writeFileSync(path.join(fullDirPath, 'description.md'), project.description);
        console.log(`Created description.md for ${project.title}`);
    }
});

// 2. Migrate CV
const cvDir = path.resolve('asset/WebIndependence/CV');
if (!fs.existsSync(cvDir)) {
    fs.mkdirSync(cvDir, { recursive: true });
}

if (cvData) {
    fs.writeFileSync(path.join(cvDir, 'cv.md'), cvData);
    console.log('Created cv.md');
}

console.log('Migration complete!');
