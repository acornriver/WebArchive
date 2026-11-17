'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Props {
    videoId: string | null;
    start?: number;
    poster: string;
    alt: string;
    // 주지 않으면 화면에 들어왔을 때 스스로 재생한다
    active?: boolean;
    frameRef?: RefObject<HTMLIFrameElement | null>;
    priority?: boolean;
    // 그림을 흑백으로 두었다가, 감싼 .group 에 마우스가 올라오면 색을 돌려준다
    mono?: boolean;
    // 재생이 시작된 뒤 드러내기까지 기다리는 시간. 유튜브가 재생 직후 띄우는 버튼을 가리려는 것.
    settle?: number;
}

// 그림 자리에서 영상이 소리 없이 돈다. 틀을 꽉 채우고, 유튜브의 제목·버튼은 잘라낸다.
export default function WorkVideo({ videoId, start = 0, poster, alt, active, frameRef, priority, mono, settle = 1600 }: Props) {
    const boxRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    const playing = Boolean(videoId) && (active ?? inView);

    useEffect(() => {
        if (active !== undefined || !boxRef.current) return;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
            threshold: 0.35,
        });
        observer.observe(boxRef.current);
        return () => observer.disconnect();
    }, [active]);

    return (
        <div ref={boxRef} className="video-box absolute inset-0 overflow-hidden bg-ink">
            <Image
                src={`/${poster}`}
                alt={alt}
                fill
                priority={priority}
                sizes="100vw"
                className={`object-cover ${
                    mono ? 'grayscale transition duration-500 group-hover:grayscale-0' : ''
                }`}
            />
            {playing && videoId && <Frame videoId={videoId} start={start} title={alt} frameRef={frameRef} settle={settle} />}
        </div>
    );
}

// 유튜브가 '재생 중'이라고 알려온 뒤에 드러낸다. 그 전까지는 아래의 그림이 보인다.
function Frame({
    videoId,
    start,
    title,
    frameRef,
    settle,
}: {
    videoId: string;
    start: number;
    title: string;
    frameRef?: RefObject<HTMLIFrameElement | null>;
    settle: number;
}) {
    const ownRef = useRef<HTMLIFrameElement | null>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        let reveal: ReturnType<typeof setTimeout> | undefined;
        const onMessage = (event: MessageEvent) => {
            if (event.source !== ownRef.current?.contentWindow || typeof event.data !== 'string') return;
            try {
                if (JSON.parse(event.data).info?.playerState === 1 && !reveal) {
                    reveal = setTimeout(() => setShown(true), settle);
                }
            } catch {
                // 유튜브가 보낸 것이 아닌 메시지
            }
        };
        window.addEventListener('message', onMessage);

        // 플레이어가 준비되기 전에 보낸 요청은 버려지므로, 답이 올 때까지 되풀이해 묻는다.
        const ask = setInterval(() => {
            ownRef.current?.contentWindow?.postMessage(
                JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }),
                '*'
            );
        }, 250);
        // 끝내 답이 없으면 그냥 보여준다
        const giveUp = setTimeout(() => setShown(true), 6000);

        return () => {
            window.removeEventListener('message', onMessage);
            clearInterval(ask);
            clearTimeout(giveUp);
            clearTimeout(reveal);
        };
    }, [settle]);

    return (
        <iframe
            ref={(node) => {
                ownRef.current = node;
                if (frameRef) frameRef.current = node;
            }}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&enablejsapi=1${
                start ? `&start=${start}` : ''
            }`}
            title={title}
            allow="autoplay; encrypted-media"
            tabIndex={-1}
            className={`video-cover pointer-events-none transition-opacity duration-500 ${
                shown ? 'opacity-100' : 'opacity-0'
            }`}
        />
    );
}
