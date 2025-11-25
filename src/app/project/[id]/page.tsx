import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, PlayCircle, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// This function generates the static paths for all projects at build time
export async function generateStaticParams() {
    return projects.map((project) => ({
        id: project.id,
    }));
}

function getYoutubeId(url: string | undefined): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = projects.find((p) => p.id === id);

    if (!project) {
        notFound();
    }

    // Extract YouTube ID from youtubeUrl field first, then fallback to description regex
    let videoId = getYoutubeId(project.youtubeUrl);

    if (!videoId) {
        const youtubeMatch = project.description.match(/https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
        videoId = youtubeMatch ? youtubeMatch[1] : null;
    }

    return (
        <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black pb-24">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center mix-blend-difference text-white">
                <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                    <ArrowLeft size={24} />
                    <span className="font-medium">Back to Archive</span>
                </Link>
            </nav>

            {/* Hero Image / Video */}
            <div className="relative w-full h-[60vh] md:h-[80vh] bg-zinc-900">
                {videoId ? (
                    <iframe
                        className="w-full h-full object-cover"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&playsinline=1`}
                        allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={project.title}
                    />
                ) : project.thumbnail ? (
                    <Image
                        src={`/${project.thumbnail}`}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">No Media</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10">
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
                    <div className="flex flex-col md:flex-row gap-8 md:items-start justify-between border-b border-white/10 pb-8 mb-8">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">{project.title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-400 mb-6">
                                <span className="flex items-center gap-2"><Calendar size={16} /> {project.year}</span>
                                <span className="flex items-center gap-2"><Tag size={16} /> {project.category}</span>
                            </div>

                            {project.youtubeUrl && (
                                <a
                                    href={project.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
                                >
                                    <PlayCircle size={20} />
                                    Watch on YouTube
                                    <ExternalLink size={14} className="opacity-70" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                a: ({ node, ...props }) => <a {...props} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" />
                            }}
                        >
                            {project.description}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Gallery */}
                {project.images.length > 0 && (
                    <div className="mt-24">
                        <h2 className="text-2xl font-bold mb-8">Gallery</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {project.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
                                    <Image
                                        src={`/${img}`}
                                        alt={`${project.title} gallery ${idx + 1}`}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
