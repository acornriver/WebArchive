'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getIdentityImage } from '@/lib/project-mapping';
import { cvData as rawCvData } from '@/data/projects';

export default function ArtistIdentity() {
    const bookImage = getIdentityImage();

    return (
        <footer className="bg-black text-white pt-24 pb-12 px-6 md:px-12 border-t border-zinc-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Column: Identity & Book */}
                <div className="lg:col-span-5 space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">acornriver</h2>
                        <p className="text-gray-400 text-lg">Media Artist who writes.</p>
                    </div>

                    {bookImage && (
                        <div className="relative w-48 aspect-[3/4] rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-zinc-900">
                            <Image
                                src={`/${bookImage}`}
                                alt="Book Cover"
                                fill
                                className="object-cover rounded-sm"
                            />
                        </div>
                    )}

                    <div className="text-sm text-gray-500 pt-8">
                        <p>© 2025 acornriver. All rights reserved.</p>
                        <p>Designed & Built by acornriver.</p>
                    </div>
                </div>

                {/* Right Column: CV & Contact */}
                <div className="lg:col-span-7">
                    <div className="prose prose-invert max-w-none text-gray-300">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                a: ({ node, ...props }) => <a {...props} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" />,
                                h3: ({ node, ...props }) => <h3 {...props} className="text-xl font-bold text-white mt-8 mb-4" />,
                            }}
                        >
                            {rawCvData}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </footer>
    );
}
