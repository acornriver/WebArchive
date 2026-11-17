import Link from 'next/link';
import { PROFILE } from '@/lib/works';

// 어느 화면에서나 위에 떠 있는 이름과 길잡이. 뒤에 무엇이 지나가든 반전되어 읽힌다.
export default function SiteHeader() {
    return (
        <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-baseline justify-between gap-6 px-5 pt-5 text-white mix-blend-difference md:px-10 md:pt-8">
            <Link href="/" className="pointer-events-auto">
                {PROFILE.name} <span className="opacity-60">{PROFILE.realName}</span>
            </Link>
            <nav className="pointer-events-auto flex items-baseline gap-5 whitespace-nowrap">
                <Link href="/#works" className="hover:underline hover:underline-offset-4">
                    작업
                </Link>
                <Link href="/#about" className="hover:underline hover:underline-offset-4">
                    소개
                </Link>
            </nav>
        </header>
    );
}
