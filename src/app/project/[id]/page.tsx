import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import SiteHeader from '@/components/SiteHeader';
import { works } from '@/lib/works';

export async function generateStaticParams() {
    return works.map((work) => ({ id: work.project.id }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const index = works.findIndex((w) => w.project.id === id);
    if (index < 0) notFound();

    const work = works[index];
    const { project } = work;
    const prev = works[index - 1];
    const next = works[index + 1];

    return (
        <main className="px-5 pb-10 md:px-10">
            <SiteHeader />

            <div className="pt-28 pb-10 md:pt-40 md:pb-14">
                <p className="meta mb-3 text-ash md:mb-5">
                    {work.number} · {project.category.trim()}, {project.year}
                </p>
                <h1 className="title text-[14vw] md:text-[8.5vw]">{work.title}</h1>
            </div>

            <div className="relative aspect-video w-full bg-black">
                {work.videoId ? (
                    <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube.com/embed/${work.videoId}?controls=1&rel=0&playsinline=1${
                            work.start ? `&start=${work.start}` : ''
                        }`}
                        allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={work.title}
                    />
                ) : (
                    project.thumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={`/${project.thumbnail}`}
                            alt={work.title}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    )
                )}
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 pt-14 md:grid-cols-12 md:pt-24">
                <aside className="md:col-span-4">
                    <div className="md:sticky md:top-10">
                        <p className="text-ash">작업 노트</p>
                        {project.youtubeUrl && (
                            <a
                                href={project.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-block underline decoration-1 underline-offset-4 hover:text-term"
                            >
                                유튜브에서 보기
                            </a>
                        )}
                    </div>
                </aside>

                <div className="note prose prose-lg max-w-none md:col-span-7 md:col-start-6">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                            a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer">
                                    {children}
                                </a>
                            ),
                        }}
                    >
                        {project.description}
                    </ReactMarkdown>
                </div>
            </div>

            {/* 사진은 자르지 않고 제 비율대로 */}
            {project.images.length > 0 && (
                <div className="gap-8 pt-24 md:columns-2 md:pt-40">
                    {project.images.map((img, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={img}
                            src={`/${img}`}
                            alt={`${work.title} ${i + 1}`}
                            loading="lazy"
                            className="mb-8 w-full break-inside-avoid"
                        />
                    ))}
                </div>
            )}

            <nav className="mt-24 grid grid-cols-2 gap-8 border-t border-line pt-6 md:mt-40">
                <div>
                    {prev && (
                        <Link href={`/project/${prev.project.id}`} className="group block">
                            <span className="text-ash">이전 작업</span>
                            <span className="title mt-2 block text-2xl leading-[1.15] group-hover:text-term md:text-[3.2vw]">
                                {prev.title}
                            </span>
                        </Link>
                    )}
                </div>
                <div className="text-right">
                    {next && (
                        <Link href={`/project/${next.project.id}`} className="group block">
                            <span className="text-ash">다음 작업</span>
                            <span className="title mt-2 block text-2xl leading-[1.15] group-hover:text-term md:text-[3.2vw]">
                                {next.title}
                            </span>
                        </Link>
                    )}
                </div>
            </nav>
        </main>
    );
}
