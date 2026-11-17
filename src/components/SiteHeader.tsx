'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PROFILE } from '@/lib/works';

// 어느 화면에서나 위에 떠 있는 이름과 길잡이. 뒤에 무엇이 지나가든 반전되어 읽힌다.
// 작품 상세 페이지에서는 로고를 누르면 다시 맨 위(Hero)가 아닌 전체 작업(#works)으로 돌아간다.
export default function SiteHeader() {
    const pathname = usePathname();
    const isProjectPage = pathname?.startsWith('/project');

    const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === '/') {
            event.preventDefault();
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            if (window.location.hash) {
                window.history.pushState(null, '', '/');
            }
        }
    };

    return (
        <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-baseline justify-between gap-3 px-5 pt-5 text-white mix-blend-difference md:px-10 md:pt-8">
            <Link
                href={isProjectPage ? '/#works' : '/'}
                onClick={handleBrandClick}
                aria-label={isProjectPage ? '전체 작업 아카이브로 돌아가기' : '맨 위로 이동'}
                className="pointer-events-auto transition-opacity hover:opacity-75"
            >
                {PROFILE.name} <span className="hidden opacity-60 sm:inline">{PROFILE.realName}</span>
            </Link>
            <nav aria-label="주요 메뉴" className="pointer-events-auto flex items-baseline gap-4 whitespace-nowrap text-sm md:gap-6">
                <Link href="/#selected" className="hover:underline hover:underline-offset-4">
                    작업
                </Link>
                <Link
                    href="/#works"
                    className={`hover:underline hover:underline-offset-4 ${isProjectPage ? 'underline underline-offset-4' : ''}`}
                >
                    아카이브
                </Link>
                <Link href="/#about" className="hover:underline hover:underline-offset-4">
                    소개
                </Link>
            </nav>
        </header>
    );
}
