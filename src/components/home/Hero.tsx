'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import WorkVideo, { VideoStatus } from '@/components/WorkVideo';
import { HERO_ID, HERO_LINE, getWork } from '@/lib/works';

export default function Hero() {
    const work = getWork(HERO_ID);
    const sectionRef = useRef<HTMLElement>(null);
    const reduceMotion = Boolean(useReducedMotion());

    const [soundOn, setSoundOn] = useState(false);
    const [paused, setPaused] = useState(false);
    const [retry, setRetry] = useState(0);
    const [status, setStatus] = useState<VideoStatus>('idle');

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const videoY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['0%', '8%']);
    const captionY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -32]);

    const onStatus = useCallback((next: VideoStatus) => {
        setStatus(next);
        if (next !== 'playing') setSoundOn(false);
    }, []);

    if (!work) return null;

    const togglePlayback = () => {
        if (status === 'playing' || status === 'loading') setPaused(true);
        else {
            setPaused(false);
            setRetry((value) => value + 1);
        }
    };

    return (
        <section
            ref={sectionRef}
            aria-label="첫 작업: 철의 언어v2"
            className="depth-frame relative h-[100svh] min-h-[620px] w-full overflow-hidden"
        >
            <motion.div style={{ y: videoY }} className="absolute inset-0 h-[108%] w-full">
                <WorkVideo
                    videoId={work.videoId}
                    start={work.start}
                    poster={work.project.thumbnail}
                    alt={work.title}
                    priority
                    active={!paused}
                    soundOn={soundOn}
                    retry={retry}
                    onStatus={onStatus}
                />
            </motion.div>

            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink via-ink/10 to-ink/40" />

            <motion.div
                style={{ y: captionY }}
                className="absolute inset-x-0 bottom-0 z-20 px-5 pb-6 md:px-10 md:pb-9"
            >
                <p className="meta mb-3 text-paper/70 md:mb-5">
                    {work.project.year} · 사운드 퍼포먼스 · SIA Digitalarts Festival
                </p>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                    <h1 className="title text-[17vw] lg:text-[10.5vw]">
                        <Link href={`/project/${work.project.id}`}>{work.title}</Link>
                        <span aria-hidden className="cursor" />
                    </h1>
                    <div className="max-w-[20rem] shrink-0 lg:pb-[1vw] lg:text-right">
                        <p>{HERO_LINE}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-5 lg:justify-end">
                            <button
                                type="button"
                                onClick={togglePlayback}
                                className="py-2 underline underline-offset-4 hover:text-term"
                            >
                                {status === 'playing' || status === 'loading'
                                    ? '영상 멈추기'
                                    : status === 'error'
                                      ? '영상 다시 재생'
                                      : '영상 재생'}
                            </button>
                            {status === 'playing' && (
                                <button
                                    type="button"
                                    onClick={() => setSoundOn((value) => !value)}
                                    aria-pressed={soundOn}
                                    className={`py-2 underline underline-offset-4 ${
                                        soundOn ? 'text-term' : 'hover:text-term'
                                    }`}
                                >
                                    {soundOn ? '소리 끄기' : '소리 켜기'}
                                </button>
                            )}
                            <Link
                                href={`/project/${work.project.id}`}
                                className="py-2 underline underline-offset-4 hover:text-term"
                            >
                                작업 보기
                            </Link>
                        </div>
                        {status === 'error' && (
                            <p role="status" className="mt-1 text-sm text-paper/70">
                                미리보기를 불러오지 못했어요. 작업 보기에서 영상을 볼 수 있어요.
                            </p>
                        )}
                    </div>
                </div>
                <div className="mt-8 flex justify-between border-t border-paper/25 pt-4 text-sm text-paper/70 md:mt-10">
                    <span>acornriver · 사운드, 설치, 영상</span>
                    <Link href="#selected" className="hover:text-term">
                        주요 작업 ↓
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
