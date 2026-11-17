'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import WorkVideo from '@/components/WorkVideo';
import { HERO_ID, HERO_LINE, getWork } from '@/lib/works';

export default function Hero() {
    const work = getWork(HERO_ID);
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [soundOn, setSoundOn] = useState(false);

    if (!work) return null;

    const toggleSound = () => {
        const next = !soundOn;
        frameRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: next ? 'unMute' : 'mute', args: [] }),
            '*'
        );
        setSoundOn(next);
    };

    return (
        <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
            <WorkVideo
                videoId={work.videoId}
                start={work.start}
                poster={work.project.thumbnail}
                alt={work.title}
                frameRef={frameRef}
                priority
                active
                settle={0}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/40" />

            <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 md:px-10 md:pb-9">
                <p className="meta mb-3 text-paper/70 md:mb-5">
                    {work.number} · {work.project.category}, {work.project.year}
                </p>
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
                    <h1 className="title text-[18vw] md:text-[11.5vw]">
                        <Link href={`/project/${work.project.id}`}>{work.title}</Link>
                        <span aria-hidden className="cursor" />
                    </h1>
                    <div className="max-w-[17rem] shrink-0 md:pb-[1.2vw] md:text-right">
                        <p>{HERO_LINE}</p>
                        <p className="mt-2 flex gap-5 md:justify-end">
                            <button
                                type="button"
                                onClick={toggleSound}
                                aria-pressed={soundOn}
                                className={`underline decoration-1 underline-offset-4 ${
                                    soundOn ? 'text-term' : 'hover:text-term'
                                }`}
                            >
                                {soundOn ? '소리 끄기' : '소리 켜기'}
                            </button>
                            <Link
                                href={`/project/${work.project.id}`}
                                className="underline decoration-1 underline-offset-4 hover:text-term"
                            >
                                작업 보기
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
