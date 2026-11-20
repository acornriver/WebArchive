// Only information recorded in projects.json / cv.json. Unconfirmed fields are omitted.
export interface WorkDetails {
    medium?: string;
    role?: string;
    venue?: string;
    collaborators?: string;
    materials?: string;
    recognition?: string;
    summary?: string;
}
export const workDetails: Record<string, WorkDetails> = {
    p0: {
        medium: '다큐멘터리', role: '기획, 연출, 촬영, 편집',
        recognition: '제16회 부산국제어린이청소년영화제 리본 더 비키 부문 수상',
        summary: '고3이 된 민혁은 카메라를 들고 자신의 길을 찾는 영상을 찍기 시작한다.',
    },
    p8: {
        medium: '설치 · 사운드 퍼포먼스', role: '전시기획 총괄, 공동작업', venue: '서울예술대학교',
        materials: '철판, 피에조 마이크, 스피커, 믹서, MIDI 피아노',
        summary: '철의 공명주파수에 해당하는 부분을 증폭해 재생성하여 울리게 되는 철판의 소리를 녹음하여 다시 철판으로 재생한다.',
    },
    p11: {
        medium: '인터랙티브 사운드 퍼포먼스', role: '공동작업', collaborators: 'acornriver, 김승민, 우성현',
        materials: '카메라, Python, OSC, MaxMSP',
        summary: '그림자의 위치와 각도 변화는 Python과 OSC를 통해 MaxMSP로 전송되어 스테레오 공간에서 움직이는 사운드로 변환되며, 이는 메아리처럼 반복되며 공간에 잔향으로 남는다.',
    },
    p16: {
        medium: '인터랙티브 설치', materials: '키보드, 마이크, 감열 프린터, 영수증 종이, 수조, 적외선 램프',
        summary: '이곳은 당신의 디지털 언어가 잠시 머물다 영원히 사라지는 정거장입니다.',
    },
    p17: {
        medium: '사운드 퍼포먼스', role: '공동작업', venue: 'SIA Digitalarts Festival · 서울예술대학교',
        collaborators: '강민혁(acornriver), 우성현, 전은지, 김해든', materials: '철판, 마이크, 트랜스듀서, 실시간 오디오 분석',
        summary: '철판은 송신자이자 수신자이자 공명체다. 마이크로 수음된 철판의 소리는 실시간으로 분석되어 공명 주파수 대역이 선택적으로 증폭되고, 다시 철판 위의 트랜스듀서를 통해 재생된다.',
    },
    p18: { medium: '음악 · 영상', role: '음악, 영상 제작', summary: 'utf8 - hexadecimal - decode - french' },
    p20: { medium: '숏필름', role: '1인 제작', summary: '노코시타쿠 나이데스네' },
    p21: { medium: '리서치 · 테스트', role: '1인 제작', materials: 'MCP, Unity', summary: 'MCP와 유니티와 함께하는 프로토타이핑' },
    p19: { medium: 'Music', summary: 'TaBaCo O YaMeMaShiTa' },
};
