'use client';

import { useEffect, useRef } from 'react';

/**
 * Pure optical Moiré interference sculpture.
 * Two crisp, continuous concentric wave fields overlap without any bounding box.
 * When aligned, they collapse into a single quiet circle; as they drift apart,
 * bold hyperbolic interference fringes emerge in the space between them.
 * Clicking briefly locks both fields into phase before releasing them back into interference.
 */
export default function ResonanceMoire() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerRef = useRef({ active: false, nx: 0.09, ny: -0.02 });
    const currentRef = useRef({ nx: 0.09, ny: -0.02 });
    const phaseLockRef = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let width = 0;
        let height = 0;
        let dpr = 1;
        let raf = 0;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = Math.max(1, Math.floor(rect.width));
            height = Math.max(1, Math.floor(rect.height));
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
        };

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(container);

        const drawFrame = (now: number) => {
            if (!reduceMotion) {
                if (!pointerRef.current.active) {
                    const t = now * 0.0005;
                    pointerRef.current.nx = Math.cos(t) * 0.12;
                    pointerRef.current.ny = Math.sin(t * 1.25) * 0.07;
                }

                currentRef.current.nx += (pointerRef.current.nx - currentRef.current.nx) * 0.07;
                currentRef.current.ny += (pointerRef.current.ny - currentRef.current.ny) * 0.07;
                phaseLockRef.current *= 0.92;
            }

            const lock = phaseLockRef.current;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, height);

            const maxRadius = Math.min(width * 0.34, height * 0.45);
            const originX = width * 0.5;
            const originY = height * 0.5;

            // Symmetrical opposition around the center; click collapses offset toward 0 (phase lock)
            const offsetX = currentRef.current.nx * width * 0.24 * (1 - lock);
            const offsetY = currentRef.current.ny * height * 0.24 * (1 - lock);

            const cxA = originX - offsetX;
            const cyA = originY - offsetY;
            const cxB = originX + offsetX;
            const cyB = originY + offsetY;

            const step = 3.4;
            const count = Math.floor(maxRadius / step);

            // Both fields use crisp continuous strokes so true optical Moiré fringes appear cleanly
            ctx.setLineDash([]);
            ctx.lineWidth = 0.85;

            // Field A
            for (let i = 1; i <= count; i++) {
                const r = i * step;
                const falloff = Math.pow(Math.max(0, 1 - r / maxRadius), 1.9);
                const alpha = falloff * 0.34;
                if (alpha < 0.008) continue;
                ctx.strokeStyle = `rgba(233, 236, 231, ${alpha.toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(cxA, cyA, r, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Field B (tiny 1.5% frequency difference creates secondary circular beat fringes)
            for (let i = 1; i <= count; i++) {
                const r = i * step * 1.015;
                if (r > maxRadius) break;
                const falloff = Math.pow(Math.max(0, 1 - r / maxRadius), 1.9);
                const isHarmonic = i % 10 === 0;

                if (isHarmonic) {
                    const termAlpha = falloff * (0.24 + lock * 0.36);
                    ctx.strokeStyle = `rgba(61, 255, 127, ${Math.min(1, termAlpha).toFixed(3)})`;
                } else {
                    const paperAlpha = falloff * 0.34;
                    ctx.strokeStyle = `rgba(233, 236, 231, ${paperAlpha.toFixed(3)})`;
                }

                ctx.beginPath();
                ctx.arc(cxB, cyB, r, 0, Math.PI * 2);
                ctx.stroke();
            }

            if (!reduceMotion) {
                raf = requestAnimationFrame(tick);
            }
        };

        const tick = (now: number) => drawFrame(now);

        if (reduceMotion) {
            drawFrame(0);
        } else {
            raf = requestAnimationFrame(tick);
        }

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, []);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        pointerRef.current.active = true;
        pointerRef.current.nx = (e.clientX - rect.left) / rect.width - 0.5;
        pointerRef.current.ny = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const handlePhaseLock = () => {
        phaseLockRef.current = 1;
    };

    return (
        <div className="md:col-span-8">
            <div
                ref={containerRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={() => {
                    pointerRef.current.active = false;
                }}
                onClick={handlePhaseLock}
                role="img"
                aria-label="두 개의 동심원 파동이 어긋나며 간섭 무늬를 만드는 인터랙티브 모아레 조형"
                className="relative h-64 w-full cursor-crosshair select-none md:h-80"
            >
                <canvas ref={canvasRef} className="block h-full w-full" />
            </div>
        </div>
    );
}
