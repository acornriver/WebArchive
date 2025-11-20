document.addEventListener('DOMContentLoaded', () => {
    const projects = [
        { id: 'p0', title: '00 파인딩 마이 패스', year: '2023', category: 'Sound / Field Recording', thumbnail: 'asset/WebIndependence/00파인딩 마이 패스/파인딩 마이 패스_썸네일 2021, acornriver.jpg', images: ['asset/WebIndependence/00파인딩 마이 패스/파마패1.png','asset/WebIndependence/00파인딩 마이 패스/파마패2.png','asset/WebIndependence/00파인딩 마이 패스/파마패3.png','asset/WebIndependence/00파인딩 마이 패스/파마패4.png'], rtf: 'asset/WebIndependence/00파인딩 마이 패스/파인딩 마이 패스 txt.rtf' },
        { id: 'p1', title: '01 자아분열', year: '2023', category: 'Short Film', thumbnail: 'asset/WebIndependence/01자아분열/자아분열_썸네일 2023, acornriver.png', images: ['asset/WebIndependence/01자아분열/자아분열1.png','asset/WebIndependence/01자아분열/자아분열2.png','asset/WebIndependence/01자아분열/자아분열3.png'], rtf: 'asset/WebIndependence/01자아분열/자아분열 txt.rtf' },
        { id: 'p2', title: '02 A ball', year: '2023', category: 'Unreal Engine Art', thumbnail: 'asset/WebIndependence/02A ball/A ball_썸네일 2023, acornriver.png', images: ['asset/WebIndependence/02A ball/A ball1.png','asset/WebIndependence/02A ball/A ball2.png','asset/WebIndependence/02A ball/A ball3.png'], rtf: 'asset/WebIndependence/02A ball/A ball txt.rtf' },
        { id: 'p3', title: '03 모잊그너슬', year: '2023', category: 'VR Artwork', thumbnail: 'asset/WebIndependence/03모잊그너슬/모잊그너슬, 모두잊혀저가는게사실이라면그건너무슬프니까_썸네일 2023, acornriver.png', images: ['asset/WebIndependence/03모잊그너슬/모잊그너슬1.png','asset/WebIndependence/03모잊그너슬/모잊그너슬2.png','asset/WebIndependence/03모잊그너슬/모잊그너슬3.png'], rtf: 'asset/WebIndependence/03모잊그너슬/모잊그너슬 txt.rtfd/TXT.rtf' },
        { id: 'p4', title: '04 미리별', year: '2024', category: 'Sound / AV', thumbnail: 'asset/WebIndependence/04미리별/미리별_썸네일, 2023, acornriver.png', images: ['asset/WebIndependence/04미리별/미리별1.jpg','asset/WebIndependence/04미리별/미리별2.png','asset/WebIndependence/04미리별/미리별3.png'], rtf: 'asset/WebIndependence/04미리별/미리별 txt.rtf' },
        { id: 'p5', title: '05 우쥬여행 앨범 발매', year: '2024', category: 'Music / Album', thumbnail: 'asset/WebIndependence/05우쥬여행 앨범 발매/우쥬여행_썸네일 2024, acornriver.png', images: [], rtf: 'asset/WebIndependence/05우쥬여행 앨범 발매/우쥬여행 앨범 txt.rtf' },
        { id: 'p6', title: '06 전음 배경영상', year: '2024', category: 'Video / VFX', thumbnail: 'asset/WebIndependence/06서울예대 전음 배경영상 제작/전음배경영상_썸네일 2023, 서울예술대학교 전자음악과 24학번 X acornriver.png', images: ['asset/WebIndependence/06서울예대 전음 배경영상 제작/전음배경영상1.png','asset/WebIndependence/06서울예대 전음 배경영상 제작/전음배경영상2.png','asset/WebIndependence/06서울예대 전음 배경영상 제작/전음배경영상3.png','asset/WebIndependence/06서울예대 전음 배경영상 제작/전음배경영상4.png'], rtf: 'asset/WebIndependence/06서울예대 전음 배경영상 제작/전음배경영상 txt.rtf' },
        { id: 'p7', title: '07 모서리인간', year: '2024', category: 'Installation', thumbnail: 'asset/WebIndependence/07모서리인간/모서리인간_썸네일 2024, acornriver.png', images: ['asset/WebIndependence/07모서리인간/모서리인간1.png','asset/WebIndependence/07모서리인간/모서리인간2.png'], rtf: 'asset/WebIndependence/07모서리인간/모서리인간 txt.rtf' },
        { id: 'p8', title: '08 철의 언어', year: '2024', category: 'Installation', thumbnail: 'asset/WebIndependence/08디지털기반의인스톨레이션-철의언어/디지털 기반의 인스톨레이션 철의 언어 _썸네일 2024,  acornriver.png', images: ['asset/WebIndependence/08디지털기반의인스톨레이션-철의언어/철의언어1.png','asset/WebIndependence/08디지털기반의인스톨레이션-철의언어/철의언어2.png','asset/WebIndependence/08디지털기반의인스톨레이션-철의언어/철의언어3.png','asset/WebIndependence/08디지털기반의인스톨레이션-철의언어/철의언어4.png','asset/WebIndependence/08디지털기반의인스톨레이션-철의언어/철의언어5.png'], rtf: 'asset/WebIndependence/08디지털기반의인스톨레이션-철의언어/미리별 txt.rtf' },
        { id: 'p9', title: '09 펑 니 풍선 터지는 소리', year: '2024', category: 'Sound / Performance', thumbnail: 'asset/WebIndependence/09펑니풍선터지는소리/펑니풍선터지는소리_썸네일 2024, acornriver.png', images: ['asset/WebIndependence/09펑니풍선터지는소리/펑니풍선1.png','asset/WebIndependence/09펑니풍선터지는소리/펑니풍선2.png'], rtf: 'asset/WebIndependence/09펑니풍선터지는소리/펑 니 풍선 터지는 소리 txt.rtf' },
        { id: 'p10', title: '10 연산적시', year: '2025', category: 'AV / Experimental', thumbnail: 'asset/WebIndependence/10연산적시/연산적 시_썸네일 2025, acornriver.png', images: ['asset/WebIndependence/10연산적시/연산적시1.png','asset/WebIndependence/10연산적시/연산적시2.png','asset/WebIndependence/10연산적시/연산적시3.png','asset/WebIndependence/10연산적시/연산적시4.png','asset/WebIndependence/10연산적시/연산적시5.png'], rtf: 'asset/WebIndependence/10연산적시/연산적시 txt.rtf' },
        { id: 'p11', title: '11 오브메모리오브', year: '2025', category: 'Exhibition', thumbnail: 'asset/WebIndependence/11오브메모리오브/오브메모리오브_썸네일 2025, acornriver.png', images: ['asset/WebIndependence/11오브메모리오브/오메오1.png','asset/WebIndependence/11오브메모리오브/오메오2.png','asset/WebIndependence/11오브메모리오브/오메오3.png','asset/WebIndependence/11오브메모리오브/오메오4.png'], rtf: 'asset/WebIndependence/11오브메모리오브/오브메모리오브 txt.rtf' },
        { id: 'p12', title: '12 스며듦', year: '2025', category: 'Music / Release', thumbnail: 'asset/WebIndependence/12스며듦 음악 발매/스며듦_썸네일 2025, acornriver.png', images: ['asset/WebIndependence/12스며듦 음악 발매/스며듦1.jpeg'], rtf: 'asset/WebIndependence/12스며듦 음악 발매/스며듦 txt.rtf' },
        { id: 'p13', title: '13 봄에피는초록이라는언어', year: '2025', category: 'Book / Publication', thumbnail: 'asset/WebIndependence/13봄에피는초록이라는언어 책 발권/봄에피는초록이라는언어_썸네일 2025, acornriver.png', images: ['asset/WebIndependence/13봄에피는초록이라는언어 책 발권/봄피언1.png','asset/WebIndependence/13봄에피는초록이라는언어 책 발권/봄피언2.png'], rtf: 'asset/WebIndependence/13봄에피는초록이라는언어 책 발권/봄에피는초록이라는언어 txt.rtf' },
        { id: 'p14', title: '14 빛의 언어', year: '2025', category: 'Research / Installation', thumbnail: 'asset/WebIndependence/14 빛의 언어/빛의언어_썸네일 2025, acornriver.png', images: ['asset/WebIndependence/14 빛의 언어/빛의언어1.png','asset/WebIndependence/14 빛의 언어/빛의언어2.png'], rtf: 'asset/WebIndependence/14 빛의 언어/빛의언어 txt.rtf' },
        { id: 'p15', title: '15 다민프로젝트 01', year: '2025', category: 'Project', thumbnail: 'asset/WebIndependence/15다민프로젝트 01/다민프로젝트01_썸네일 2025, acornriver, daon.png', images: ['asset/WebIndependence/15다민프로젝트 01/다민1.png','asset/WebIndependence/15다민프로젝트 01/다민2.png','asset/WebIndependence/15다민프로젝트 01/다민3.png','asset/WebIndependence/15다민프로젝트 01/다민4.png'] },
    ];

    const projectList = document.getElementById('project-list');
    const detailModal = document.getElementById('project-detail-modal');
    const infoModal = document.getElementById('info-modal');
    const modalBody = document.getElementById('modal-body');
    const infoBtn = document.getElementById('info-btn');

    // Map project titles to their markdown file paths
    const projectMarkdownMap = {
        '00 파인딩 마이 패스': 'asset/WebIndependence/00파인딩 마이 패스/파인딩 마이 패스.md',
        '01 자아분열': 'asset/WebIndependence/01자아분열/자아분열.md',
        '02 A ball': 'asset/WebIndependence/02A ball/A ball.md',
        '03 모잊그너슬': 'asset/WebIndependence/03모잊그너슬/모잊그너슬.md',
        '04 미리별': 'asset/WebIndependence/04미리별/미리별.md',
        '05 우쥬여행 앨범 발매': 'asset/WebIndependence/05우쥬여행 앨범 발매/우쥬여행.md',
        '06 전음 배경영상': 'asset/WebIndependence/06서울예대 전음 배경영상 제작/전음배경영상.md',
        '07 모서리인간': 'asset/WebIndependence/07모서리인간/모서리인간.md',
        '08 철의 언어': 'asset/WebIndependence/08디지털기반의인스톨레이션-철의언어/디지털기반의 인스톨레이션.md',
        '09 펑 니 풍선 터지는 소리': 'asset/WebIndependence/09펑니풍선터지는소리/펑 니 풍선 터지는 소리.md',
        '10 연산적시': 'asset/WebIndependence/10연산적시/연산적시.md',
        '11 오브메모리오브': 'asset/WebIndependence/11오브메모리오브/오브메모리오브.md',
        '12 스며듦': 'asset/WebIndependence/12스며듦 음악 발매/스며듦.md',
        '13 봄에피는초록이라는언어': 'asset/WebIndependence/13봄에피는초록이라는언어 책 발권/봄에피는초록이라는언어.md',
        '14 빛의 언어': 'asset/WebIndependence/14 빛의 언어/빛의언어.md',
        '15 다민프로젝트 01': 'asset/WebIndependence/15다민프로젝트 01/다민프로젝트 01.md',
        'Curriculum Vitae': 'asset/WebIndependence/CV/ acornriver CV.md'
    };

    // Cache for loaded markdown content
    let projectTexts = {};

    // Render project list with thumbnails
    projects.forEach(project => {
        const listItem = document.createElement('li');
        const thumbnailHtml = project.thumbnail ? `<div class="project-thumbnail"><img src="${project.thumbnail}" alt="${project.title} thumbnail" loading="lazy" onerror="this.style.backgroundColor='#1a1a1a'"></div>` : '<div class="project-thumbnail"></div>';
        listItem.innerHTML = `
            <a href="#" data-id="${project.id}" title="View ${project.title}">
                ${thumbnailHtml}
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-meta">
                        <span class="project-category">${project.category}</span>
                        <span class="project-year">${project.year}</span>
                    </div>
                </div>
            </a>
        `;
        projectList.appendChild(listItem);
    });

    // Utility: focusable selector
    const focusableSelector = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

    // Modal open/close with focus trap and Esc handling
    let currentlyOpenModal = null;
    let lastFocusedElement = null;

    function openModal(modal) {
        lastFocusedElement = document.activeElement;
        modal.style.display = 'flex';
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        currentlyOpenModal = modal;
        // Focus first focusable element
        setTimeout(() => {
            const focusable = modal.querySelectorAll(focusableSelector);
            if (focusable.length) {
                focusable[0].focus();
            }
        }, 50);
        document.body.classList.add('details-open');
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        currentlyOpenModal = null;
        document.body.classList.remove('details-open');
        if (lastFocusedElement) {
            setTimeout(() => {
                lastFocusedElement.focus();
            }, 50);
        }
    }



    function escapeHtml(unsafe) {
        return unsafe.replace(/[&<"'>]/g, function (m) {
            return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#039;"})[m];
        });
    }

    // Convert Markdown to HTML
    function markdownToHtml(markdown) {
        try {
            let html = markdown;
            
            // Escape HTML first
            html = escapeHtml(html);
            
            // Convert markdown headers to h3-h5
            html = html.replace(/^### (.*?)$/gm, '<h5>$1</h5>');
            html = html.replace(/^## (.*?)$/gm, '<h4>$1</h4>');
            html = html.replace(/^# (.*?)$/gm, '<h3>$1</h3>');
            
            // Convert markdown links [text](url)
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
            
            // Convert bold
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
            
            // Convert italic - ONLY ** wrapped text, not single underscores
            html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
            
            // Convert horizontal rules
            html = html.replace(/^-{3,}$/gm, '<hr>');
            
            // Simple paragraph conversion
            const paragraphs = html.split('\n\n');
            html = paragraphs.map(para => {
                para = para.trim();
                // Don't wrap HTML elements
                if (para.startsWith('<')) {
                    return para;
                }
                return para ? `<p>${para}</p>` : '';
            }).join('\n');
            
            // Process YouTube links
            html = processYouTubeLinks(html);
            
            return html;
        } catch(e) {
            console.error('Error in markdownToHtml:', e);
            return escapeHtml(markdown);
        }
    }

    // Convert links (YouTube embeds + regular links)
    function processYouTubeLinks(text) {
        // First, convert YouTube links to embeds
        const youtubeRegex = /https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|shorts\/)?([a-zA-Z0-9_-]{11})/g;
        
        text = text.replace(youtubeRegex, (match) => {
            // Extract video ID
            const videoIdMatch = match.match(/(?:v=|\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (!videoIdMatch || !videoIdMatch[1]) return match;
            
            const videoId = videoIdMatch[1];
            return `<div class="youtube-container"><iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen loading="lazy"></iframe></div>`;
        });
        
        // Then convert remaining URLs to links (only http/https that start on new line or after space)
        const urlRegex = /(?:^|\s)(https?:\/\/[^\s<>]+)/gm;
        text = text.replace(urlRegex, (match, url) => {
            // Skip if already in an iframe or HTML tag
            if (url.includes('youtube.com/embed') || url.includes('iframe')) return match;
            const prefix = match.startsWith(' ') ? ' ' : '';
            return `${prefix}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
        
        return text;
    }

    // Load markdown file dynamically
    async function loadProjectMarkdown(title) {
        const mdPath = projectMarkdownMap[title];
        if (!mdPath) {
            console.error('Markdown path not found for:', title);
            return null;
        }

        if (projectTexts[title]) {
            return projectTexts[title];
        }

        try {
            const response = await fetch(mdPath);
            if (!response.ok) {
                throw new Error(`Failed to load: ${response.statusText}`);
            }
            const content = await response.text();
            projectTexts[title] = content;
            return content;
        } catch (err) {
            console.error('Error loading markdown:', mdPath, err);
            return null;
        }
    }

    // Project click event
    projectList.addEventListener('click', async (e) => {
        e.preventDefault();
        const link = e.target.closest('a');
        if (!link) return;

        try {
            const projectId = link.dataset.id;
            const project = projects.find(p => p.id === projectId);
            if (!project) {
                console.error('Project not found:', projectId);
                return;
            }

            const imagesHTML = project.images
                .map(img => `<img src="${img}" alt="${project.title}" loading="lazy" onerror="this.style.display='none'">`)
                .join('');
            const closeBtnHtml = `<button class="close-btn" aria-label="Close modal">×</button>`;

            // Load markdown from file
            const plaintext = await loadProjectMarkdown(project.title);
            if (!plaintext) {
                modalBody.innerHTML = `${closeBtnHtml}<h2>${project.title}</h2><p style="color:#999;">설명을 불러올 수 없습니다.</p>`;
            } else {
                // Convert markdown to HTML
                const textHTML = markdownToHtml(plaintext);
                modalBody.innerHTML = `${closeBtnHtml}<h2>${project.title}</h2><div class="rtf-text">${textHTML}</div><div class="image-gallery">${imagesHTML}</div>`;
            }

            const closeBtn = modalBody.querySelector('.close-btn');
            if (closeBtn) closeBtn.addEventListener('click', () => closeModal(detailModal));
            openModal(detailModal);
        } catch(err) {
            console.error('Error opening project:', err);
            modalBody.innerHTML = `<button class="close-btn" aria-label="Close modal">×</button><h2>에러</h2><p>${err.message}</p>`;
            const closeBtn = modalBody.querySelector('.close-btn');
            if (closeBtn) closeBtn.addEventListener('click', () => closeModal(detailModal));
            openModal(detailModal);
        }
    });

    // Info button click (CV)
    infoBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const infoBodyDiv = infoModal.querySelector('#info-body');
        const closeBtnHtml = `<button class="close-btn" aria-label="Close modal">×</button>`;

        try {
            const cvMarkdown = await loadProjectMarkdown('Curriculum Vitae');
            if (!cvMarkdown) {
                throw new Error('CV content not found.');
            }
            
            const cvHtml = markdownToHtml(cvMarkdown);
            infoBodyDiv.innerHTML = `${closeBtnHtml}<h2>Curriculum Vitae</h2><div class="rtf-text">${cvHtml}</div>`;
            
            const closeBtn = infoBodyDiv.querySelector('.close-btn');
            if (closeBtn) closeBtn.addEventListener('click', () => closeModal(infoModal));
            openModal(infoModal);

        } catch (err) {
            console.error('Failed to load CV:', err);
            infoBodyDiv.innerHTML = `${closeBtnHtml}<h2>Curriculum Vitae</h2><p style="color:#999;">CV를 불러올 수 없습니다.</p>`;
            const closeBtn = infoBodyDiv.querySelector('.close-btn');
            if (closeBtn) closeBtn.addEventListener('click', () => closeModal(infoModal));
            openModal(infoModal);
        }
    });

    // Overlay click to close
    [detailModal, infoModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            // Only close if clicking the overlay, not the content
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                closeModal(modal);
            }
        });
    });

    // Global key handling (Esc to close, Tab to trap focus)
    window.addEventListener('keydown', (e) => {
        if (!currentlyOpenModal) return;

        if (e.key === 'Escape' || e.key === 'Esc') {
            e.preventDefault();
            closeModal(currentlyOpenModal);
            return;
        }

        if (e.key === 'Tab') {
            // Focus trap
            const focusable = Array.from(currentlyOpenModal.querySelectorAll(focusableSelector))
                .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

            if (focusable.length === 0) {
                e.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                // Tab
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    });
});