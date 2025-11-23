'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedProjects } from '@/lib/project-mapping';
import { ArrowRight, Trophy, MapPin } from 'lucide-react';

export default function FeaturedHighlights() {
    const { primary, secondary } = getFeaturedProjects();

    if (!primary.project || !secondary.project) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-950 text-white overflow-hidden">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="max-w-7xl mx-auto"
            >
                <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-16 border-l-4 border-white pl-6">
                    Featured Highlights
                </motion.h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Primary Highlight (Nam June Paik Center) */}
                    <Link href={`/project/${primary.project.id}`}>
                        <motion.div variants={itemVariants} className="group relative cursor-pointer">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-6">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                <Image
                                    src={`/${primary.project.thumbnail}`}
                                    alt={primary.project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 z-20 bg-white/90 text-black text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full flex items-center gap-2">
                                    <MapPin size={12} />
                                    Exhibition
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
                                    <span className="text-sm text-gray-400">{primary.project.year}</span>
                                    <span className="text-sm text-gray-400">{primary.project.category}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold group-hover:text-gray-300 transition-colors">
                                    {primary.project.title}
                                </h3>
                                <p className="text-lg text-indigo-300 font-medium flex items-center gap-2">
                                    {primary.highlightTag}
                                </p>
                                <p className="text-gray-400 line-clamp-3 leading-relaxed">
                                    {primary.project.description.split('\n')[0]}
                                </p>
                                <div className="pt-4 flex items-center text-sm font-medium uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                                    View Case Study <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Secondary Highlight (BIKY Award) */}
                    <Link href={`/project/${secondary.project.id}`}>
                        <motion.div variants={itemVariants} className="group relative cursor-pointer lg:mt-24">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-6">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                <Image
                                    src={`/${secondary.project.thumbnail}`}
                                    alt={secondary.project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 z-20 bg-yellow-500/90 text-black text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full flex items-center gap-2">
                                    <Trophy size={12} />
                                    Award Winner
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
                                    <span className="text-sm text-gray-400">{secondary.project.year}</span>
                                    <span className="text-sm text-gray-400">{secondary.project.category}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold group-hover:text-gray-300 transition-colors">
                                    {secondary.project.title}
                                </h3>
                                <p className="text-lg text-yellow-500 font-medium">
                                    {secondary.highlightTag}
                                </p>
                                <p className="text-gray-400 line-clamp-3 leading-relaxed">
                                    {secondary.project.description.split('\n')[0]}
                                </p>
                                <div className="pt-4 flex items-center text-sm font-medium uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                                    View Case Study <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
