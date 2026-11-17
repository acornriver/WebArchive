'use client';

import { useEffect, useRef, useState } from 'react';
import WorkImage from '@/components/WorkImage';

export type VideoStatus = 'idle' | 'loading' | 'playing' | 'error';
const YOUTUBE_ORIGIN = 'https://www.youtube.com';

interface Props {
    videoId: string | null;
    start?: number;
    poster: string;
    alt: string;
    active?: boolean;
    priority?: boolean;
    mono?: boolean;
    settle?: number;
    soundOn?: boolean;
    retry?: number;
    onStatus?: (status: VideoStatus) => void;
    sizes?: string;
}

// The poster remains visible until playback is confirmed. Offscreen players are removed.
export default function WorkVideo({ videoId, start = 0, poster, alt, active, priority, mono,
    settle = 1200, soundOn = false, retry = 0, onStatus, sizes = '100vw' }: Props) {
    const boxRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    const [pageVisible, setPageVisible] = useState(true);
    const [reduceMotion, setReduceMotion] = useState(true);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updateMotion = () => setReduceMotion(media.matches);
        const updateVisibility = () => setPageVisible(!document.hidden);
        updateMotion();
        updateVisibility();
        media.addEventListener('change', updateMotion);
        document.addEventListener('visibilitychange', updateVisibility);
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.35), { threshold: [0, 0.35] });
        if (boxRef.current) observer.observe(boxRef.current);
        return () => {
            observer.disconnect();
            media.removeEventListener('change', updateMotion);
            document.removeEventListener('visibilitychange', updateVisibility);
        };
    }, []);

    const playing = videoId && inView && pageVisible && active !== false && (!reduceMotion || retry > 0);
    return (
        <div ref={boxRef} className="video-box absolute inset-0 overflow-hidden bg-ink">
            <WorkImage source={poster} alt={alt} priority={priority} sizes={sizes}
                className={`absolute inset-0 h-full w-full object-cover ${mono ? 'grayscale transition duration-500 group-hover:grayscale-0 group-focus-visible:grayscale-0' : ''}`} />
            {playing && <Frame key={`${videoId}-${retry}`} videoId={videoId} start={start} title={alt}
                settle={settle} soundOn={soundOn} onStatus={onStatus} />}
        </div>
    );
}

function Frame({ videoId, start, title, settle, soundOn, onStatus }: {
    videoId: string; start: number; title: string; settle: number; soundOn: boolean;
    onStatus?: (status: VideoStatus) => void;
}) {
    const frameRef = useRef<HTMLIFrameElement>(null);
    const loadedRef = useRef(false);
    const [shown, setShown] = useState(false);
    const [failed, setFailed] = useState(false);
    useEffect(() => {
        let reveal: ReturnType<typeof setTimeout> | undefined;
        let settled = false;
        onStatus?.('loading');
        const ask = setInterval(() => {
            if (!loadedRef.current) return;
            frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), YOUTUBE_ORIGIN);
        }, 250);
        const fail = () => {
            clearInterval(ask);
            clearTimeout(reveal);
            setFailed(true);
            onStatus?.('error');
        };
        const deadline = setTimeout(fail, 12000);
        const onMessage = (event: MessageEvent) => {
            if (event.origin !== YOUTUBE_ORIGIN || event.source !== frameRef.current?.contentWindow || typeof event.data !== 'string') return;
            try {
                const data = JSON.parse(event.data);
                if (data.event === 'onError') { clearTimeout(deadline); fail(); return; }
                const state = data.info?.playerState ?? (data.event === 'onStateChange' ? data.info : undefined);
                if (state === 1 && !settled) {
                    settled = true;
                    clearTimeout(deadline);
                    clearInterval(ask);
                    reveal = setTimeout(() => { setShown(true); onStatus?.('playing'); }, settle);
                }
            } catch { /* Ignore non-player messages. */ }
        };
        window.addEventListener('message', onMessage);
        return () => {
            clearInterval(ask);
            clearTimeout(deadline);
            clearTimeout(reveal);
            window.removeEventListener('message', onMessage);
            onStatus?.('idle');
        };
    }, [onStatus, settle]);

    useEffect(() => {
        if (!shown) return;
        frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: soundOn ? 'unMute' : 'mute', args: [] }), YOUTUBE_ORIGIN);
    }, [shown, soundOn]);

    if (failed) return null;
    return <iframe ref={frameRef} onLoad={() => { loadedRef.current = true; }}
        src={`${YOUTUBE_ORIGIN}/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&playsinline=1&disablekb=1&enablejsapi=1&start=${start}`}
        title={`${title} 미리보기`} allow="autoplay; encrypted-media" referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1} aria-hidden="true"
        className={`video-cover pointer-events-none transition-opacity duration-500 ${shown ? 'opacity-100' : 'opacity-0'}`} />;
}
