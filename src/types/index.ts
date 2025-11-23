export interface Project {
    id: string;
    title: string;
    year: string;
    category: string;
    thumbnail: string;
    images: string[];
    description: string;
    youtubeUrl?: string;
    tags?: string[];
}
