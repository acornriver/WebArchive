import { projects } from '@/data/projects';
import { Project } from '@/types';

export interface Work {
    project: Project;
    number: string;
    title: string;
    videoId: string | null;
    start: number;
}

// '17 철의 언어v2' → 번호 '17', 제목 '철의 언어v2'
function splitTitle(raw: string): { number: string; title: string } {
    const match = raw.match(/^(\d+)\s+(.+)$/);
    return match ? { number: match[1], title: match[2] } : { number: '', title: raw };
}

function parseYouTube(url?: string): { videoId: string | null; start: number } {
    if (!url) return { videoId: null, start: 0 };
    const id = url.match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/);
    const t = url.match(/[?&](?:t|start)=(\d+)/);
    return { videoId: id ? id[1] : null, start: t ? parseInt(t[1], 10) : 0 };
}

// 사이트에 싣지 않는 작업. 이력(cv.json)에는 그대로 남는다.
const HIDDEN = new Set(['p10']); // 연산적 시

export const works: Work[] = projects
    .filter((project) => !HIDDEN.has(project.id))
    .map((project) => ({
        project,
        ...splitTitle(project.title),
        ...parseYouTube(project.youtubeUrl),
    }));

export const getWork = (id: string) => works.find((w) => w.project.id === id);

// 첫 화면에 트는 작업
export const HERO_ID = 'p17';
export const HERO_LINE = '철판은 송신자이자 수신자이자 공명체다.';

// 주요 작업. where: 어디서 무엇으로, line: 작업 노트에서 가져온 한 문장.
export const FEATURED: { id: string; where: string; line: string }[] = [
    {
        id: 'p8',
        where: '서울예술대학교, 전시기획 총괄',
        line: '“스피커 안에는 울림판이 있었다”라는 이야기에서 출발하여',
    },
    {
        id: 'p0',
        where: '제16회 부산국제어린이청소년영화제 리본 더 비키 수상',
        line: '고3이 된 민혁은 카메라를 들고 자신의 길을 찾는 영상을 찍기 시작한다.',
    },
    {
        id: 'p2',
        where: '한국영상대학교 본관, 미디어파사드',
        line: '창작자와 소비자가 아닌, 작가와 관람인.',
    },
];

export const ARCHIVE_TABS: { tag: string | null; label: string }[] = [
    { tag: null, label: '전체' },
    { tag: 'Interactive/Tech', label: '설치와 퍼포먼스' },
    { tag: 'Film/Video', label: '영상' },
    { tag: 'Sound/Music', label: '음악' },
    { tag: 'Publication/Project', label: '출판과 프로젝트' },
];

// 소개에 쓰이는 문장. 작가가 직접 고쳐 쓰는 자리.
export const PROFILE = {
    name: 'acornriver',
    realName: '강민혁',
    statement: '물리적 공명을 디지털 노이즈로 치환하여 들어봅니다.',
    email: 'minhyuk@acornriver.work',
    links: [
        { label: 'Instagram', href: 'https://instagram.com/acornriver_' },
        { label: 'YouTube', href: 'https://youtube.com/@acornriver' },
        { label: 'Blog', href: 'https://www.acornriver.net' },
    ],
};
