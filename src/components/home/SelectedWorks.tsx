'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getSelectedWorks } from '@/lib/project-mapping';
import { ArrowUpRight, Layers, Monitor } from 'lucide-react';

export default function SelectedWorks() {
    const works = getSelectedWorks();

    if (!works || works.length === 0) return null;

    return (
        <section className="py-24 bg-black text-white">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                            Technical Scale
                        </h2>
                        <p className="text-gray-400 max-w-md text-lg">
                            대규모 인스톨레이션과 정교한 미디어 아키텍처를 통해 창작의 경계를 확장합니다.
                        </p>
                    </div>
                </motion.div>

                <div className="space-y-32">
                    {works.map((item, index) => {
                        if (!item.project) return null;

                        const isEven = index % 2 === 0;

                        return (
                            <Link key={item.project.id} href={`/project/${item.project.id}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 0.8 }}
                                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center group cursor-pointer`}
                                >
                                    {/* Image Area - Takes up more space for "Scale" */}
                                    <div className="w-full lg:w-3/5 relative aspect-video overflow-hidden rounded-xl">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
                                        <Image
                                            src={`/${item.project.thumbnail}`}
                                            alt={item.project.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />

                                        {/* Floating Tech Badge */}
                                        <div className="absolute bottom-6 left-6 z-20 flex gap-3">
                                            {index === 0 ? (
                                                <span className="bg-blue-600/90 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                                    <Layers size={16} /> Installation
                                                </span>
                                            ) : (
                                                <span className="bg-purple-600/90 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                                    <Monitor size={16} /> Unreal Engine
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Text Area */}
                                    <div className="w-full lg:w-2/5 space-y-6">
                                        <div className="flex items-center gap-4 text-gray-500 font-mono text-sm uppercase tracking-widest">
                                            <span>{item.project.year}</span>
                                            <span className="w-8 h-[1px] bg-gray-700" />
                                            <span>{item.project.category}</span>
                                        </div>

                                        <h3 className="text-4xl md:text-5xl font-bold leading-tight group-hover:text-gray-300 transition-colors">
                                            {item.project.title}
                                        </h3>

                                        <div className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 font-medium">
                                            {item.focus}
                                        </div>

                                        <p className="text-gray-400 leading-relaxed text-lg">
                                            {item.project.description.substring(0, 150)}...
                                        </p>

                                        <div className="flex items-center gap-3 text-white font-semibold mt-4 hover:text-gray-300 transition-colors">
                                            <span className="border-b border-white/30 pb-1 group-hover:border-white transition-all">
                                                Explore Project
                                            </span>
                                            <ArrowUpRight size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
