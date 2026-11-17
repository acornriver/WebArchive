'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Matter from 'matter-js';
import { FEATURED, HERO_ID, works } from '@/lib/works';

const { Bodies, Body, Composite, Engine, Events, Mouse, MouseConstraint } = Matter;

const WALL = 200;
const STEP = 1000 / 60;
const SIZES = ['text-xl md:text-4xl', 'text-lg md:text-2xl', 'text-base md:text-xl'];
const filled = new Set([HERO_ID, ...FEATURED.map((f) => f.id)]);

// 부딪힘 한 번을 짧은 노이즈로. 작은 조각일수록 높은 소리, 세게 부딪힐수록 큰 소리.
function knock(ctx: AudioContext, noise: AudioBuffer, size: number, speed: number) {
    const source = ctx.createBufferSource();
    source.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 180 + 2600 * (1 - size);
    filter.Q.value = 9;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(Math.min(0.5, speed / 24), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + 0.18);
}

// 작품 제목들이 떨어져 쌓인다. 잡아서 던질 수 있고, 부딪히면 소리가 난다.
export default function Playground() {
    const boxRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<{ ctx: AudioContext; noise: AudioBuffer } | null>(null);
    const [soundOn, setSoundOn] = useState(false);
    const soundRef = useRef(false);

    const toggleSound = () => {
        if (!audioRef.current) {
            const ctx = new AudioContext();
            const noise = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
            const data = noise.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            audioRef.current = { ctx, noise };
        }
        audioRef.current.ctx.resume();
        soundRef.current = !soundOn;
        setSoundOn(!soundOn);
    };

    useEffect(() => {
        const box = boxRef.current;
        if (!box || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const els = Array.from(box.querySelectorAll<HTMLElement>('[data-body]'));
        let stop: (() => void) | null = null;
        let disposed = false;

        const build = () => {
            // 쌓이기 전, 줄지어 놓인 상태에서 크기를 잰다
            delete box.dataset.live;
            els.forEach((el) => (el.style.transform = ''));
            const sizes = els.map((el) => ({ w: el.offsetWidth, h: el.offsetHeight }));
            const W = box.clientWidth;
            const H = box.clientHeight;
            const largest = Math.max(...sizes.map((s) => s.w * s.h));

            const engine = Engine.create();
            const wall = (x: number, y: number, w: number, h: number) =>
                Bodies.rectangle(x, y, w, h, { isStatic: true });
            const bodies = sizes.map(({ w, h }, i) =>
                Bodies.rectangle(w / 2 + Math.random() * Math.max(1, W - w), -80 - i * 110, w, h, {
                    chamfer: { radius: h / 2 - 1 },
                    angle: (Math.random() - 0.5) * 0.7,
                    restitution: 0.35,
                    friction: 0.4,
                    frictionAir: 0.012,
                })
            );
            Composite.add(engine.world, [
                wall(W / 2, H + WALL / 2, W + WALL * 2, WALL),
                wall(-WALL / 2, 0, WALL, H * 8),
                wall(W + WALL / 2, 0, WALL, H * 8),
                ...bodies,
            ]);

            // 마우스로 잡아 던지기. 휠과 터치는 놓아주어 화면 스크롤을 막지 않는다.
            const mouse = Mouse.create(box);
            const handlers = mouse as unknown as Record<string, EventListener>;
            box.removeEventListener('wheel', handlers.mousewheel);
            box.removeEventListener('touchmove', handlers.mousemove);
            box.removeEventListener('touchstart', handlers.mousedown);
            box.removeEventListener('touchend', handlers.mouseup);
            Composite.add(
                engine.world,
                MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2 } })
            );

            Events.on(engine, 'collisionStart', (event) => {
                const audio = audioRef.current;
                if (!soundRef.current || !audio) return;
                event.pairs.slice(0, 3).forEach(({ bodyA, bodyB }) => {
                    const speed = Math.hypot(
                        bodyA.velocity.x - bodyB.velocity.x,
                        bodyA.velocity.y - bodyB.velocity.y
                    );
                    if (speed < 2) return;
                    const moving = bodyA.isStatic ? bodyB : bodyA;
                    knock(audio.ctx, audio.noise, moving.area / largest, speed);
                });
            });

            // 빈 곳을 누르면 전부 튀어 오른다
            const kick = (event: MouseEvent) => {
                if (event.target !== box && event.target !== box.firstElementChild) return;
                bodies.forEach((body) =>
                    Body.setVelocity(body, { x: (Math.random() - 0.5) * 10, y: -9 - Math.random() * 9 })
                );
            };
            box.addEventListener('click', kick);

            box.dataset.live = 'true';
            // 화면 주사율과 상관없이 같은 빠르기로: 흐른 시간만큼 1/60초 걸음을 밟는다(밀려도 한 번에 6걸음까지)
            let raf = 0;
            let last = performance.now();
            let owed = 0;
            const step = (now: number) => {
                owed = Math.min(owed + now - last, STEP * 6);
                last = now;
                while (owed >= STEP) {
                    Engine.update(engine, STEP);
                    owed -= STEP;
                }
                bodies.forEach((body, i) => {
                    // 벽 밖으로 빠져나간 조각은 위에서 다시 떨어뜨린다
                    if (body.position.y > H + WALL || body.position.x < -WALL || body.position.x > W + WALL) {
                        Body.setPosition(body, { x: W / 2, y: -100 });
                        Body.setVelocity(body, { x: 0, y: 0 });
                    }
                    const { w, h } = sizes[i];
                    els[i].style.transform = `translate(${body.position.x - w / 2}px, ${
                        body.position.y - h / 2
                    }px) rotate(${body.angle}rad)`;
                });
                raf = requestAnimationFrame(step);
            };
            const play = () => {
                cancelAnimationFrame(raf);
                last = performance.now();
                raf = requestAnimationFrame(step);
            };
            const pause = () => cancelAnimationFrame(raf);
            play();

            // 화면 밖에서는 멈춘다
            const watcher = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()));
            watcher.observe(box);

            return () => {
                pause();
                watcher.disconnect();
                box.removeEventListener('click', kick);
                Mouse.clearSourceEvents(mouse);
                box.removeEventListener('mousemove', handlers.mousemove);
                box.removeEventListener('mousedown', handlers.mousedown);
                box.removeEventListener('mouseup', handlers.mouseup);
                Engine.clear(engine);
            };
        };

        // 처음 화면에 들어올 때 떨어뜨린다
        const first = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                first.disconnect();
                void document.fonts.ready.then(() => { if (box.isConnected && !disposed) stop = build(); });
            },
            { threshold: 0.25 }
        );
        first.observe(box);

        // 폭이 바뀌면 벽을 다시 세워야 하므로 처음부터 다시 떨어뜨린다
        let width = box.clientWidth;
        let timer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (!stop || box.clientWidth === width) return;
                width = box.clientWidth;
                stop();
                stop = build();
            }, 250);
        };
        window.addEventListener('resize', onResize);

        return () => {
            disposed = true;
            first.disconnect();
            clearTimeout(timer);
            window.removeEventListener('resize', onResize);
            stop?.();
            void audioRef.current?.ctx.close();
            audioRef.current = null;
        };
    }, []);

    // 끌다가 놓은 것은 누른 것으로 치지 않는다
    const downAt = useRef({ x: 0, y: 0 });

    return (
        <section className="px-5 pt-24 md:px-10 md:pt-40">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
                <p className="title max-w-3xl text-[7.5vw] leading-[1.2] md:text-[3.2vw]">작업의 제목들을 만져보세요.</p>
                <p className="text-ash">
                    <span className="[@media(pointer:coarse)]:hidden">제목을 잡아서 던져보세요.</span>
                    <span className="hidden [@media(pointer:coarse)]:inline">빈 곳을 두드려보세요.</span>{' '}
                    <button
                        type="button"
                        onClick={toggleSound}
                        aria-pressed={soundOn}
                        className={`underline decoration-1 underline-offset-4 ${
                            soundOn ? 'text-term' : 'text-paper hover:text-term'
                        }`}
                    >
                        {soundOn ? '부딪히는 소리 끄기' : '부딪히는 소리 켜기'}
                    </button>
                </p>
            </div>

            <div
                ref={boxRef}
                className="playground relative h-[70svh] min-h-[460px] touch-pan-y overflow-hidden border-y border-line select-none"
                onPointerDown={(e) => (downAt.current = { x: e.clientX, y: e.clientY })}
                onClickCapture={(e) => {
                    if (e.detail !== 0 && Math.hypot(e.clientX - downAt.current.x, e.clientY - downAt.current.y) > 6) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }}
            >
                <ul className="flex h-full flex-wrap content-end items-end gap-2 py-3">
                    {works.map((work, i) => (
                        <li key={work.project.id}>
                            <Link
                                data-body
                                href={`/project/${work.project.id}`}
                                draggable={false}
                                className={`title block rounded-full border px-[0.75em] py-[0.32em] whitespace-nowrap ${
                                    SIZES[i % SIZES.length]
                                } ${
                                    filled.has(work.project.id)
                                        ? 'border-paper bg-paper text-ink hover:border-term hover:bg-term'
                                        : 'border-paper/60 bg-ink hover:border-term hover:text-term'
                                }`}
                            >
                                {work.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
