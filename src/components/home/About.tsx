import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cvData } from '@/data/projects';
import { PROFILE, works } from '@/lib/works';

// cv.json 을 '### 제목' 단위로 나눠 전시 → 수상 → 발매 → 학력 순서로 싣는다. 다루는 것은 따로 한 줄로.
// 연락처와 인사말은 옆 칸과 겹쳐서, 'not yet' 항목은 비어 있어서 싣지 않는다.
const CV_ORDER: [heading: string, label: string][] = [
    ['Exhibitions', '전시와 공연'],
    ['Awards', '수상'],
    ['Press', '음원 발매'],
    ['Education', '학력'],
];

// '- 항목' 줄만 뽑아 한 줄로 흘린다
const skills = (cvData.split(/^### Skills\s*$/m)[1] ?? '')
    .split(/^### /m)[0]
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());

const sections = Object.fromEntries(
    cvData
        .split(/^### /m)
        .slice(1)
        .map((chunk) => {
            const [heading, ...body] = chunk.split('\n');
            return [heading.trim(), body.join('\n').trim()];
        })
);

const cvBody = CV_ORDER.filter(([heading]) => sections[heading])
    .map(([heading, label]) => `### ${label}\n${sections[heading]}`)
    .join('\n\n');

const years = works.map((w) => parseInt(w.project.year, 10)).filter(Boolean);

export default function About() {
    return (
        <section id="about" className="px-5 pt-36 md:px-10 md:pt-60">
            <h2 className="title text-[12vw] md:text-[5.6vw]">
                {PROFILE.realName} <span className="text-ash">{PROFILE.name}</span>
            </h2>

            <div className="mt-14 grid grid-cols-1 gap-12 pb-24 md:mt-24 md:grid-cols-12">
                <div className="md:col-span-4">
                    <ul>
                        <li>
                            <a
                                href={`mailto:${PROFILE.email}`}
                                className="underline decoration-1 underline-offset-4 hover:text-term"
                            >
                                {PROFILE.email}
                            </a>
                        </li>
                        {PROFILE.links.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-ash hover:text-term"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="cv md:col-span-7 md:col-start-6">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{cvBody}</ReactMarkdown>
                    <h3>다루는 것</h3>
                    <p className="meta leading-loose">
                        {skills.map((skill, i) => (
                            <span key={skill}>
                                {i > 0 && ' / '}
                                {skill}
                            </span>
                        ))}
                    </p>
                </div>
            </div>

            <footer className="border-t border-line py-5">
                <div className="flex flex-wrap justify-between gap-2 text-sm text-ash">
                    <span>
                        작업 {works.length}점, {Math.min(...years)}–{Math.max(...years)}
                    </span>
                    <span>© 2026 acornriver</span>
                </div>
            </footer>
        </section>
    );
}
