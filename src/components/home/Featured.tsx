import Link from 'next/link';
import WorkVideo from '@/components/WorkVideo';
import { FEATURED, getWork } from '@/lib/works';

// 주요 작업: 화면을 가득 채운 영상 위에 제목이 놓인다. 화면에 들어오면 재생된다.
export default function Featured() {
    return (
        <section className="pt-24 md:pt-40">
            <div className="space-y-3 md:space-y-4">
                {FEATURED.map(({ id, where, line }) => {
                    const work = getWork(id);
                    if (!work) return null;

                    return (
                        <Link
                            key={id}
                            href={`/project/${id}`}
                            className="group relative block h-[78svh] min-h-[460px] overflow-hidden md:h-[92svh]"
                        >
                            <WorkVideo
                                videoId={work.videoId}
                                start={work.start}
                                poster={work.project.thumbnail}
                                alt={work.title}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/5 to-ink/25" />

                            <div className="absolute inset-x-0 bottom-0 px-5 pb-6 md:px-10 md:pb-9">
                                <p className="meta mb-3 text-paper/70 md:mb-4">
                                    {work.number} · {work.project.category.trim()}, {work.project.year}
                                </p>
                                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
                                    <h2 className="title text-[14vw] group-hover:text-term md:text-[8.5vw]">
                                        {work.title}
                                    </h2>
                                    <div className="max-w-[19rem] shrink-0 md:pb-[0.8vw] md:text-right">
                                        <p>{line}</p>
                                        <p className="mt-1 text-paper/60">{where}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
