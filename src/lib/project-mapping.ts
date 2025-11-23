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
            focus: "General Director & Installation"
        },
        {
            project: projects.find(p => p.id === 'p2'),
            focus: "Media Facade & Unreal Engine"
        }
    ];
};

// 4. Archive: Categorized List
// Logic: Filter remaining projects into specific tabs
// 4. Archive: Categorized List
// Logic: Filter projects based on their tags
export const getArchiveCategories = () => {
    const allProjects = projects;

    return {
        "Interactive/Tech": allProjects.filter(p => p.tags?.includes("Interactive/Tech")),
        "Film/Video": allProjects.filter(p => p.tags?.includes("Film/Video")),
        "Sound/Music": allProjects.filter(p => p.tags?.includes("Sound/Music")),
        "Publication/Project": allProjects.filter(p => p.tags?.includes("Publication/Project")),
        "All": allProjects
    };
};

// 5. Artist Identity
// Target: p13 (Book cover)
export const getIdentityImage = () => {
    const bookProject = projects.find(p => p.id === 'p13');
    return bookProject ? bookProject.thumbnail : null;
};
