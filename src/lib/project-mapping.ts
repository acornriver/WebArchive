import { projects } from '@/data/projects';
import { Project } from '@/types';

// 1. Hero Section: "From Trace to Memory"
// Target: p11 (오브메모리오브)
export const getHeroProject = (): Project | undefined => {
    return projects.find(p => p.id === 'p11');
};

// 2. Featured Highlights: Credibility & Awards
// Target A: p10 (Nam June Paik Center), Target B: p0 (BIKY Award)
export const getFeaturedProjects = () => {
    return {
        primary: {
            project: projects.find(p => p.id === 'p10'),
            highlightTag: "Exhibited at Nam June Paik Art Center (2025)"
        },
        secondary: {
            project: projects.find(p => p.id === 'p0'),
            highlightTag: "BIKY Award Winner (2021)"
        }
    };
};

// 3. Selected Works: Tech & Scale
// Target: p8 (Installation/Director), p2 (Media Facade/Unreal)
export const getSelectedWorks = () => {
    return [
        {
            project: projects.find(p => p.id === 'p8'),
            focus: "General Director & Physical Computing"
        },
        {
            project: projects.find(p => p.id === 'p2'),
            focus: "Media Facade & Unreal Engine"
        }
    ];
};

// 4. Archive: Categorized List
// Logic: Filter remaining projects into specific tabs
export const getArchiveCategories = () => {
    const allProjects = projects;

    return {
        "Interactive/Tech": allProjects.filter(p => ['p8', 'p9', 'p10', 'p11', 'p14'].includes(p.id)),
        "Film/Video": allProjects.filter(p => ['p0', 'p1', 'p6', 'p7'].includes(p.id)),
        "Sound/Music": allProjects.filter(p => ['p4', 'p5', 'p12'].includes(p.id)),
        "Publication/Project": allProjects.filter(p => ['p13', 'p15'].includes(p.id)),
        "All": allProjects // Default view
    };
};

// 5. Artist Identity
// Target: p13 (Book cover)
export const getIdentityImage = () => {
    const bookProject = projects.find(p => p.id === 'p13');
    return bookProject ? bookProject.thumbnail : null;
};
