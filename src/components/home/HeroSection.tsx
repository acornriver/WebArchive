'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
export default function HeroSection() {
    // Extract video ID from URL if needed, but we know it is iBMpqVptw4k for p11
    const videoId = "iBMpqVptw4k";

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Video */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
                <iframe
                    className="w-full h-full scale-[1.35] object-cover"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`}
                    allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                    title="Background Video"
                    style={{ pointerEvents: 'none' }}
                />
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black" />

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h2 className="text-sm md:text-base uppercase tracking-[0.2em] text-gray-400 mb-4">
                        Media Artist acornriver
                    </h2>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6">
                        오브<br />메모리 오브
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-lg md:text-2xl text-gray-300 mb-10 font-light max-w-2xl"
                >
                    Interactive Sound Performance
                </motion.p>

                <Link href="/project/p11">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ delay: 1, duration: 0.3 }}
                        className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300"
                    >
                        View Project
                    </motion.button>
                </Link>
            </div>
        </section>
    );
}
