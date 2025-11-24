import { Project } from '@/types';
import projectsData from './projects.json';

import cvJson from './cv.json';

export const projects: Project[] = projectsData as Project[];

export const cvData = cvJson.content;
