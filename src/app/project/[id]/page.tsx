import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import WorkImage, { imageAsset } from '@/components/WorkImage';
import { workDetails } from '@/data/work-details';
import { works } from '@/lib/works';

type Props = { params: Promise<{ id: string }> };
export async function generateStaticParams() {
    return works.map(work => ({ id: work.project.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const work = works.find(w => w.project.id === id);
    if (!work) notFound();
    const details = workDetails[id];
    const description = details?.summary ?? `${work.title}, ${work.project.year}. acornriver(강민혁)의 ${work.project.category.trim()} 작업과 기록.`;
    const url = `/project/${id}/`;
    const image = imageAsset(work.project.thumbnail);
    return {
        title: work.title, description, alternates: { canonical: url },
        openGraph: { title: `${work.title} · acornriver`, description, url, type: 'article',
            images: [{ url: image.src, alt: work.title }] },
        twitter: { card: 'summary_large_image', title: work.title, description, images: [image.src] },
    };
}
export default async function ProjectDetail({ params }: Props) {
    const { id } = await params;
    const index = works.findIndex(w => w.project.id === id);
    if (index < 0) notFound();
    const work = works[index];
    const { project } = work;
    const details = workDetails[id];
    const prev = works[index - 1];
    const next = works[index + 1];
    const facts = [
        ['매체', details?.medium ?? project.category.trim()], ['연도', project.year],
        ['역할', details?.role], ['장소', details?.venue], ['참여 작가', details?.collaborators],
        ['재료·도구', details?.materials], ['수상', details?.recognition],
    ].filter(([, value]) => value);
    return (
        <main id="main-content" className="px-5 pb-10 md:px-10">
            <header className="pt-28 pb-8 md:pt-40 md:pb-12">
                <Link href="/#works" className="text-sm text-ash hover:text-term">← 전체 아카이브</Link>
                <p className="meta mt-8 mb-3 text-ash">{work.number} / {project.year}</p>
                <h1 className="title text-[14vw] md:text-[8.5vw]">{work.title}</h1>
            </header>
            <div className="grid gap-8 border-t border-line pt-6 pb-10 md:grid-cols-12 md:pb-16">
                <dl className="grid content-start gap-3 text-sm md:col-span-5">
                    {facts.map(([label, value]) => <div key={label} className="grid grid-cols-[4.5rem_1fr] gap-4">
                        <dt className="text-ash">{label}</dt><dd>{value}</dd>
                    </div>)}
                </dl>
                {details?.summary && <p className="max-w-3xl text-xl leading-relaxed md:col-span-6 md:col-start-7 md:text-2xl">{details.summary}</p>}
            </div>
            <div className={`relative w-full bg-black ${work.videoId ? 'aspect-video' : ''}`}>
                {work.videoId ? <iframe className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${work.videoId}?controls=1&rel=0&playsinline=1&start=${work.start}`}
                    allow="autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={work.title}
                    referrerPolicy="strict-origin-when-cross-origin" />
                    : <WorkImage source={project.thumbnail} alt={work.title} priority className="max-h-[85svh] w-full object-contain" />}
            </div>
            {project.youtubeUrl && <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-block py-2 text-sm text-ash underline underline-offset-4 hover:text-term">유튜브에서 보기 ↗</a>}
            <section aria-labelledby="note-heading" className="grid grid-cols-1 gap-x-8 gap-y-8 pt-14 md:grid-cols-12 md:pt-24">
                <h2 id="note-heading" className="text-ash md:col-span-4">작업 노트</h2>
                <div className="note prose prose-lg min-w-0 max-w-none md:col-span-7 md:col-start-6">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={{
                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
                    }}>{project.description}</ReactMarkdown>
                </div>
            </section>
            {project.images.length > 0 && <section aria-label="작업 사진" className="pt-20 md:pt-32">
                <div className="mb-8 flex justify-between border-t border-line pt-4 text-sm text-ash"><h2>작업 기록</h2><span className="meta">{project.images.length} PHOTOGRAPHS</span></div>
                <div className="gap-8 md:columns-2">{project.images.map((img, i) => <WorkImage key={img} source={img}
                    alt={`${work.title} 작업 기록 ${i + 1}`} sizes="(min-width: 768px) 50vw, 100vw" className="mb-8 h-auto w-full break-inside-avoid" />)}</div>
            </section>}
            <nav aria-label="다른 작업" className="mt-24 grid grid-cols-2 gap-8 border-t border-line pt-6 md:mt-40">
                <div>{prev && <Link href={`/project/${prev.project.id}`} className="group block">
                    <span className="text-ash">이전 작업</span><span className="title mt-2 block text-2xl leading-[1.15] group-hover:text-term md:text-[3.2vw]">{prev.title}</span>
                </Link>}</div>
                <div className="text-right">{next && <Link href={`/project/${next.project.id}`} className="group block">
                    <span className="text-ash">다음 작업</span><span className="title mt-2 block text-2xl leading-[1.15] group-hover:text-term md:text-[3.2vw]">{next.title}</span>
                </Link>}</div>
            </nav>
        </main>
    );
}
