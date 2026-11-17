'use client';

import { useEffect } from 'react';

/**
 * Enables smooth scrolling only for in-page hash links so Next.js route transitions
 * jump directly to the top (or target hash) without sliding through the previous scroll position.
 */
export default function SmoothHashScroll() {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href]');
            if (!anchor) return;

            const rawHref = anchor.getAttribute('href');
            if (!rawHref || !rawHref.includes('#')) return;

            let targetUrl: URL;
            try {
                targetUrl = new URL(anchor.href, window.location.origin);
            } catch {
                return;
            }

            if (targetUrl.origin !== window.location.origin || targetUrl.pathname !== window.location.pathname || !targetUrl.hash) {
                return;
            }

            const targetId = decodeURIComponent(targetUrl.hash.slice(1));
            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;

            event.preventDefault();
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            targetEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            window.history.pushState(null, '', targetUrl.hash);
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return null;
}
