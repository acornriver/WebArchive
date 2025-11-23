'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getArchiveCategories } from '@/lib/project-mapping';
import { Project } from '@/types';

export default function ArchiveSection() {
    const categories = getArchiveCategories();
    const categoryNames = Object.keys(categories);

    const [activeCategory, setActiveCategory] = useState<string>('All');

    // @ts-ignore - We know the key exists from categoryNames
    const displayedProjects: Project[] = categories[activeCategory as keyof typeof categories] || [];

    return (
        <section className="py-24 px-6 md:px-12 bg-zinc-900 text-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Archive</h2>
                        <p className="text-gray-400">Explore the complete collection of works.</p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {categoryNames.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${activeCategory === cat
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-gray-400 border-zinc-700 hover:border-zinc-500 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode='popLayout'>
                        {displayedProjects.map((project) => (
                            <motion.div
                                layout
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group cursor-pointer"
                            >
                                <Link href={`/project/${project.id}`}>
                                    <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-800 mb-3">
                                        {project.thumbnail ? (
                                            <Image
                                                src={`/${project.thumbnail}`}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <span className="text-white font-medium border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm">
                                                View Details
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-gray-300 transition-colors truncate">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{project.year} • {project.category}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
