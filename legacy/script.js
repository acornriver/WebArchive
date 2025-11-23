import { projects, cvData } from './data.js';

/**
 * Constants & Configuration
 */
const CONFIG = {
    selectors: {
        projectList: 'project-list',
        detailModal: 'project-detail-modal',
        infoModal: 'info-modal',
        modalBody: 'modal-body',
        infoBody: 'info-body',
        infoBtn: 'info-btn',
        bgLayer1: 'bg-layer-1',
        bgLayer2: 'bg-layer-2',
        focusable: 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    },
    classes: {
        active: 'active',
        detailsOpen: 'details-open',
        closeBtn: 'close-btn'
    },
    mobileBreakpoint: 768
};

/**
 * Utility: Markdown Parser
 */
const MarkdownParser = {
    escape(unsafe) {
        return unsafe.replace(/[&<"'>]/g, m =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#039;" })[m]
        );
    },

    processYouTube(text) {
        // Convert YouTube links to embeds
        const youtubeRegex = /https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|shorts\/)?([a-zA-Z0-9_-]{11})/g;
        text = text.replace(youtubeRegex, (match) => {
            const videoIdMatch = match.match(/(?:v=|\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (!videoIdMatch || !videoIdMatch[1]) return match;
            return `<div class="youtube-container"><iframe src="https://www.youtube.com/embed/${videoIdMatch[1]}" allowfullscreen loading="lazy"></iframe></div>`;
        });

        // Convert remaining URLs to links
        const urlRegex = /(?:^|\s)(https?:\/\/[^\s<>]+)/gm;
        return text.replace(urlRegex, (match, url) => {
            if (url.includes('youtube.com/embed') || url.includes('iframe')) return match;
            const prefix = match.startsWith(' ') ? ' ' : '';
            return `${prefix}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
    },

    toHtml(markdown) {
        if (!markdown) return '';
        try {
            let html = this.escape(markdown);

            // Headers
            html = html
                .replace(/^### (.*?)$/gm, '<h5>$1</h5>')
                .replace(/^## (.*?)$/gm, '<h4>$1</h4>')
                .replace(/^# (.*?)$/gm, '<h3>$1</h3>');

            // Links
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

            // Bold & Italic
            html = html
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/__(.*?)__/g, '<strong>$1</strong>')
                .replace(/\*([^\*]+)\*/g, '<em>$1</em>');

            // Horizontal Rule
            html = html.replace(/^-{3,}$/gm, '<hr>');

            // Paragraphs
            html = html.split('\n\n').map(para => {
                para = para.trim();
                if (!para || para.startsWith('<')) return para;
                return `<p>${para}</p>`;
            }).join('\n');

            return this.processYouTube(html);
        } catch (e) {
            console.error('Markdown parsing error:', e);
            return this.escape(markdown);
        }
    }
};

/**
 * Background Manager (Crossfade)
 */
class BackgroundManager {
    constructor() {
        this.layer1 = document.getElementById(CONFIG.selectors.bgLayer1);
        this.layer2 = document.getElementById(CONFIG.selectors.bgLayer2);
        this.activeLayer = 1; // 1 or 2
        this.currentImage = null;
    }

    setImage(imageUrl) {
        if (this.currentImage === imageUrl) return;
        this.currentImage = imageUrl;

        const nextLayer = this.activeLayer === 1 ? this.layer2 : this.layer1;
        const currentLayer = this.activeLayer === 1 ? this.layer1 : this.layer2;

        if (imageUrl) {
            // Set new image to next layer and fade in
            nextLayer.style.backgroundImage = `url('${imageUrl}')`;
            nextLayer.classList.add(CONFIG.classes.active);

            // Fade out current layer
            currentLayer.classList.remove(CONFIG.classes.active);

            // Swap active pointer
            this.activeLayer = this.activeLayer === 1 ? 2 : 1;
        } else {
            // If no image, hide both
            this.layer1.classList.remove(CONFIG.classes.active);
            this.layer2.classList.remove(CONFIG.classes.active);
            this.currentImage = null;
        }
    }

    clear() {
        this.setImage(null);
    }
}

/**
 * Modal Manager
 */
class ModalManager {
    constructor() {
        this.activeModal = null;
        this.lastFocused = null;
        this.bindGlobalEvents();
    }

    open(modal, contentHtml, closeCallback) {
        this.lastFocused = document.activeElement;

        // Populate content
        const bodyId = modal.id === CONFIG.selectors.detailModal ? CONFIG.selectors.modalBody : CONFIG.selectors.infoBody;
        const bodyEl = document.getElementById(bodyId);

        if (bodyEl) {
            const closeBtnHtml = `<button class="${CONFIG.classes.closeBtn}" aria-label="Close modal">×</button>`;
            bodyEl.innerHTML = closeBtnHtml + contentHtml;

            // Bind close button
            const closeBtn = bodyEl.querySelector(`.${CONFIG.classes.closeBtn}`);
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close(modal));
            }
        }

        // Show modal
        modal.classList.add(CONFIG.classes.active);
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add(CONFIG.classes.detailsOpen);
        this.activeModal = modal;

        // Focus trap
        setTimeout(() => {
            const focusable = modal.querySelectorAll(CONFIG.selectors.focusable);
            if (focusable.length) focusable[0].focus();
        }, 50);
    }

    close(modal) {
        if (!modal) return;
        modal.classList.remove(CONFIG.classes.active);
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove(CONFIG.classes.detailsOpen);
        this.activeModal = null;

        if (this.lastFocused) {
            setTimeout(() => this.lastFocused.focus(), 50);
        }
    }

    bindGlobalEvents() {
        // Esc key & Focus Trap
        window.addEventListener('keydown', (e) => {
            if (!this.activeModal) return;

            if (e.key === 'Escape' || e.key === 'Esc') {
                e.preventDefault();
                this.close(this.activeModal);
            } else if (e.key === 'Tab') {
                this.handleFocusTrap(e);
            }
        });

        // Overlay click
        document.addEventListener('click', (e) => {
            if (this.activeModal && (e.target === this.activeModal || e.target.classList.contains('modal-overlay'))) {
                this.close(this.activeModal);
            }
        });
    }

    handleFocusTrap(e) {
        const focusable = Array.from(this.activeModal.querySelectorAll(CONFIG.selectors.focusable))
            .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

        if (focusable.length === 0) {
            e.preventDefault();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
}

/**
 * Main Application
 */
document.addEventListener('DOMContentLoaded', () => {
    const els = {
        projectList: document.getElementById(CONFIG.selectors.projectList),
        detailModal: document.getElementById(CONFIG.selectors.detailModal),
        infoModal: document.getElementById(CONFIG.selectors.infoModal),
        infoBtn: document.getElementById(CONFIG.selectors.infoBtn)
    };

    const modalManager = new ModalManager();
    const bgManager = new BackgroundManager();

    // --- Render Projects ---
    projects.forEach(project => {
        const li = document.createElement('li');

        // Preload thumbnail
        if (project.thumbnail) {
            new Image().src = project.thumbnail;
        }

        li.innerHTML = `
            <a href="#" data-id="${project.id}" class="project-link">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-meta">
                    <span class="project-category">${project.category}</span>
                    <span class="project-year">${project.year}</span>
                </div>
            </a>
        `;

        // Hover Effect (Desktop)
        const link = li.querySelector('a');
        link.addEventListener('mouseenter', () => {
            if (window.innerWidth > CONFIG.mobileBreakpoint) {
                if (project.thumbnail) {
                    bgManager.setImage(project.thumbnail);
                } else {
                    bgManager.clear();
                }
            }
        });

        link.addEventListener('mouseleave', () => {
            if (window.innerWidth > CONFIG.mobileBreakpoint) {
                bgManager.clear();
            }
        });

        els.projectList.appendChild(li);
    });

    // --- Mobile Scroll Interaction (Intersection Observer) ---
    if (window.innerWidth <= CONFIG.mobileBreakpoint) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target.querySelector('a');
                    if (!link) return;

                    const project = projects.find(p => p.id === link.dataset.id);
                    if (project?.thumbnail) {
                        requestAnimationFrame(() => {
                            bgManager.setImage(project.thumbnail);
                        });
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '-15% 0px -60% 0px', // Active zone: 15% to 40% from top
            threshold: 0
        });

        document.querySelectorAll('.projects-list li').forEach(li => observer.observe(li));
    }

    // --- Event Handlers ---

    // Open Project Detail
    els.projectList.addEventListener('click', (e) => {
        e.preventDefault();
        const link = e.target.closest('a');
        if (!link) return;

        const project = projects.find(p => p.id === link.dataset.id);
        if (!project) return;

        const imagesHtml = project.images
            .map(img => `<img src="${img}" alt="${project.title}" loading="lazy">`)
            .join('');

        const descHtml = MarkdownParser.toHtml(project.description || '설명을 불러올 수 없습니다.');

        const content = `
            <h2>${project.title}</h2>
            <div class="rtf-text">${descHtml}</div>
            <div class="image-gallery">${imagesHtml}</div>
        `;

        modalManager.open(els.detailModal, content);
    });

    // Open Info (CV)
    els.infoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cvHtml = MarkdownParser.toHtml(cvData || 'CV를 불러올 수 없습니다.');
        const content = `
            <h2>Curriculum Vitae</h2>
            <div class="rtf-text">${cvHtml}</div>
        `;
        modalManager.open(els.infoModal, content);
    });
});