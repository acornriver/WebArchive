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
        id: 'p16',
        where: '설치 · 감열 프린터, 마이크, 적외선 램프',
        line: '이곳은 당신의 디지털 언어가 잠시 머물다 영원히 사라지는 정거장입니다.',
    },
    {
        id: 'p11',
        where: '인터랙티브 사운드 퍼포먼스 · acornriver, 김승민, 우성현',
        line: '손이 떠난 자리, 텅 빈 공간에 그림자와 소리만이 공명할 때',
    },
    {
        id: 'p0',
        where: '기획·연출·촬영·편집 · 제16회 BIKY 리본 더 비키 부문 수상',
        line: '고3이 된 민혁은 카메라를 들고 자신의 길을 찾는 영상을 찍기 시작한다.',
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
