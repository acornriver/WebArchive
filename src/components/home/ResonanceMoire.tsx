'use client';

import { useEffect, useRef, useState } from 'react';

const RING_COUNT = 26;
const RING_STEP = 11;
const BASE_CX = 320;
const BASE_CY = 140;

/**
 * Interactive Moiré pattern combining an analog concentric field with
 * a pointer-driven digital pulse field. As the two centers overlap,
 * continuous waves and discrete dashes interfere to visualize resonance.
 */
export default function ResonanceMoire() {
    const containerRef = useRef<HTMLDivElement>(null);
    const movingGroupRef = useRef<SVGGElement>(null);
    const targetRef = useRef({ x: 56, y: -12 });
    const currentRef = useRef({ x: 56, y: -12 });
    const pointerActiveRef = useRef(false);
    const [phaseDelta, setPhaseDelta] = useState('0.57');
    const [pulsing, setPulsing] = useState(false);

    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return;

        let raf = 0;
        let lastLabelUpdate = 0;

        const tick = (now: number) => {
            // Subtle autonomous breathing when the pointer is not hovering
            if (!pointerActiveRef.current) {
                const t = now * 0.00055;
                targetRef.current = {
                    x: Math.cos(t) * 68,
                    y: Math.sin(t * 1.3) * 28,
                };
            }

            const cur = currentRef.current;
            const tgt = targetRef.current;
            cur.x += (tgt.x - cur.x) * 0.08;
            cur.y += (tgt.y - cur.y) * 0.08;

            if (movingGroupRef.current) {
                movingGroupRef.current.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`;
            }

            if (now - lastLabelUpdate > 90) {
                lastLabelUpdate = now;
                const dist = Math.hypot(cur.x, cur.y);
                setPhaseDelta((dist / 100).toFixed(2));
            }

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    const updateTargetFromClient = (clientX: number, clientY: number) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const nx = (clientX - rect.left) / rect.width - 0.5;
        const ny = (clientY - rect.top) / rect.height - 0.5;
        pointerActiveRef.current = true;
        targetRef.current = {
            x: nx * 240,
            y: ny * 110,
        };
    };

    const handleTriggerPulse = () => {
        setPulsing(true);
        setTimeout(() => setPulsing(false), 500);
    };

    return (
        <div className="md:col-span-8">
            <div
                ref={containerRef}
                onPointerMove={(e) => updateTargetFromClient(e.clientX, e.clientY)}
                onPointerLeave={() => {
                    pointerActiveRef.current = false;
                }}
                onClick={handleTriggerPulse}
                role="img"
                aria-label="물리적 파동과 디지털 신호가 만나 공명하는 인터랙티브 모아레 문양"
                className="group relative h-52 w-full cursor-crosshair overflow-hidden border border-line bg-ink select-none md:h-64"
            >
                <svg
                    viewBox="0 0 640 280"
                    preserveAspectRatio="xMidYMid slice"
                    className="h-full w-full"
                    aria-hidden="true"
                >
                    {/* 1. Fixed Analog Resonance Field (Continuous Waves) */}
                    <g opacity="0.32">
                        {Array.from({ length: RING_COUNT }, (_, i) => {
                            const r = (i + 1) * RING_STEP;
                            return (
                                <circle
                                    key={`analog-${i}`}
                                    cx={BASE_CX - 36}
                                    cy={BASE_CY}
                                    r={r}
                                    fill="none"
                                    stroke="var(--paper)"
                                    strokeWidth="0.9"
                                />
                            );
                        })}
                    </g>

                    {/* 2. Pointer-Driven Digital Interference Field (Discrete Pulse Rings) */}
                    <g
                        ref={movingGroupRef}
                        style={{
                            transform: 'translate3d(56px, -12px, 0)',
                            willChange: 'transform',
                        }}
                    >
                        {Array.from({ length: RING_COUNT }, (_, i) => {
                            const r = (i + 1) * RING_STEP;
                            const isCore = i < 4;
                            const dash = i % 3 === 0 ? '2 4' : i % 2 === 0 ? '6 3' : undefined;
                            return (
                                <circle
                                    key={`digital-${i}`}
                                    cx={BASE_CX}
                                    cy={BASE_CY}
                                    r={r}
                                    fill="none"
                                    stroke={isCore || pulsing ? 'var(--term)' : 'var(--paper)'}
                                    strokeOpacity={isCore ? 0.65 : 0.34}
                                    strokeWidth={pulsing ? '1.35' : '0.95'}
                                    strokeDasharray={dash}
                                    className="transition-[stroke,stroke-width] duration-300"
                                />
                            );
                        })}
                    </g>
                </svg>

                {/* Subtle Edge Vignette */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/70" />

                {/* Minimal Corner Telemetry */}
                <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-center justify-between text-[11px] text-ash">
                    <span className="meta">RESONANCE × MOIRÉ</span>
                    <span className="meta tabular-nums">
                        Δφ <span className="text-term">{phaseDelta}</span>
                    </span>
                </div>
            </div>

            <p className="mt-4 text-sm text-ash md:text-base">
                울림은 흩어지고, 흔적만 남는다.
            </p>
        </div>
    );
}
