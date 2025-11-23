# acornriver Portfolio

A minimal, elegant artist portfolio website showcasing digital art and sound projects.

## Overview

This is a beautiful, responsive portfolio site for **acornriver**, a digital artist. The site features:

- ✨ Minimal, elegant design
- 📱 Fully responsive layout (mobile, tablet, desktop)
- 🎥 Integrated YouTube video embeds
- 🖼️ Project gallery with modal details
- 📄 CV section
- ♿ Accessible design with focus management and keyboard navigation

## Features

- **Dynamic Project Loading**: Markdown files are loaded dynamically from the `asset/WebIndependence` directory
- **YouTube Integration**: URLs in project descriptions are automatically converted to embedded videos with proper aspect ratio
- **Modal Navigation**: Smooth modal interactions with keyboard support (Esc to close, Tab to navigate)
- **CV Button**: Top-right navigation button to view the artist's Curriculum Vitae
- **Lazy Loading**: Images load on demand for better performance

## Setup & Local Testing

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: A simple HTTP server

### Running Locally

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Node.js:**
```bash
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## Deployment

This is a static website with no server-side dependencies. Deploy to:

- **GitHub Pages**: Enable in repository settings
- **Netlify**: Connect your repository
- **Vercel**: Zero-configuration deployment
- **Traditional Hosting**: Upload via FTP/SFTP
- **AWS S3 + CloudFront**: Static site hosting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

See the LICENSE file for details.