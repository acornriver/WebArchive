'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import WorkVideo from '@/components/WorkVideo';
import ResonanceMoire from '@/components/home/ResonanceMoire';
import { FEATURED, getWork } from '@/lib/works';

export default function Featured() {
    const reduceMotion = useReducedMotion();

    return (
        <section id="selected" aria-labelledby="selected-heading" className="pt-20 md:pt-32">
            <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-8 px-5 pb-12 md:grid-cols-12 md:px-10 md:pb-16"
            >
                <div className="md:col-span-4">
                    <h2 id="selected-heading" className="text-sm text-ash">주요 작업 / 2021–2026</h2>
                    <Link href="#works" className="mt-4 inline-block underline underline-offset-4 transition-colors hover:text-term">전체 아카이브 ↗</Link>
                </div>
                <ResonanceMoire />
            </motion.div>
            <div className="space-y-4 md:space-y-6">
                {FEATURED.map(({ id, where, line }) => {
                    const work = getWork(id);
                    if (!work) return null;
                    return (
                        <motion.div
                            key={id}
                            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Link href={`/project/${id}`}
                                className="group relative block h-[72svh] min-h-[470px] overflow-hidden md:h-[78svh]">
                                <div className="h-full w-full transition-transform duration-1000 ease-out group-hover:scale-[1.02]">
                                    <WorkVideo videoId={work.videoId} start={work.start} poster={work.project.thumbnail} alt={work.title} />
                                </div>
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/20" />
                                <div className="absolute inset-x-0 top-0 flex justify-between px-5 pt-6 text-sm md:px-10">
                                    <span className="meta">{work.number} / {work.project.year}</span>
                                    <span className="underline underline-offset-4 transition-colors group-hover:text-term">작업 보기 ↗</span>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 px-5 pb-6 md:px-10 md:pb-9">
                                    <p className="mb-4 max-w-xl text-paper/85">{line}</p>
                                    <h3 className="title text-[13vw] transition-colors duration-200 group-hover:text-term group-focus-visible:text-term md:text-[8.5vw]">{work.title}</h3>
                                    <p className="mt-5 border-t border-paper/25 pt-4 text-sm text-paper/75">{where}</p>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
