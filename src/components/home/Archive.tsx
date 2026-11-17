'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import WorkVideo from '@/components/WorkVideo';
import { ARCHIVE_TABS, Work, works } from '@/lib/works';

// 넓은 칸과 좁은 칸이 줄마다 자리를 바꾼다
const LAYOUT = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7'];

const newestFirst = [...works].reverse();

function ArchiveCard({
    work,
    cell,
    index,
    isHovered,
    onHover,
    reduceMotion,
}: {
    work: Work;
    cell: string;
    index: number;
    isHovered: boolean;
    onHover: (id: string | null) => void;
    reduceMotion: boolean;
}) {
    const itemRef = useRef<HTMLLIElement>(null);
    const { scrollYProgress } = useScroll({
        target: itemRef,
        offset: ['start end', 'end start'],
    });

    // Direct 1:1 scroll-linked vertical parallax without spring lag
    const mediaY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['-4%', '4%']);
    const captionY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [12, -12]);
    const id = work.project.id;

    return (
        <motion.li
            ref={itemRef}
            className={cell}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : Math.min(index * 0.035, 0.28),
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <Link
                href={`/project/${id}`}
                onMouseEnter={() => onHover(id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(id)}
                onBlur={() => onHover(null)}
                className="group block"
            >
                <div className="depth-frame relative aspect-[4/3]">
                    <motion.div
                        style={{ y: mediaY }}
                        className="h-[110%] w-full -mt-[5%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    >
                        <WorkVideo
                            videoId={work.videoId}
                            start={work.start}
                            poster={work.project.thumbnail}
                            alt={work.title}
                            active={isHovered}
                            mono
                            sizes="(min-width: 768px) 58vw, 100vw"
                            settle={400}
                        />
                    </motion.div>
                </div>

                <motion.div
                    style={{ y: captionY }}
                    className="relative z-10 mt-4 grid grid-cols-[2.5rem_1fr] gap-x-4"
                >
                    <span className="meta pt-1 text-ash transition-colors duration-200 group-hover:text-term">
                        {work.number}
                    </span>
                    <div>
                        <h3 className="title text-2xl leading-[1.15] transition-colors duration-200 group-hover:text-term md:text-[2vw]">
                            {work.title}
                        </h3>
                        <p className="meta mt-2 text-ash">
                            {work.project.category.trim()}, {work.project.year}
                        </p>
                    </div>
                </motion.div>
            </Link>
        </motion.li>
    );
}

export default function Archive() {
    const [tag, setTag] = useState<string | null>(null);
    const [hoverId, setHoverId] = useState<string | null>(null);
    const reduceMotion = Boolean(useReducedMotion());
    const listed = newestFirst.filter((w) => !tag || w.project.tags?.includes(tag));

    return (
        <section id="works" className="px-5 pt-28 md:px-10 md:pt-44">
            <div className="mb-12 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 md:mb-20">
                <h2 className="title text-[12vw] md:text-[5.6vw]">
                    모든 작업 <span className="text-ash">{listed.length}</span>
                </h2>
                <div role="group" aria-label="작업 분류" className="flex flex-wrap gap-x-5 gap-y-1">
                    {ARCHIVE_TABS.map((tab) => {
                        const isOn = tab.tag === tag;
                        return (
                            <button
                                key={tab.label}
                                type="button"
                                aria-pressed={isOn}
                                aria-controls="archive-results"
                                onClick={() => {
                                    setTag(tab.tag);
                                    setHoverId(null);
                                }}
                                className={`min-h-11 transition-colors duration-200 ${
                                    isOn ? 'text-term' : 'text-ash hover:text-paper'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <p role="status" className="sr-only">
                {listed.length}개의 작업
            </p>
            <ol
                id="archive-results"
                key={tag ?? 'all'}
                className="grid grid-cols-1 items-end gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-24"
            >
                {listed.map((work, i) => (
                    <ArchiveCard
                        key={work.project.id}
                        work={work}
                        cell={LAYOUT[i % LAYOUT.length]}
                        index={i}
                        isHovered={hoverId === work.project.id}
                        onHover={setHoverId}
                        reduceMotion={reduceMotion}
                    />
                ))}
            </ol>
        </section>
    );
}
