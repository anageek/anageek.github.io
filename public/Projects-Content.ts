import projectsData from "../data/projects.json";

export interface ProjectSection {
  title: string;
  description: {
    type: "heading" | "paragraph" | "image" | "list";
    text?: string;
    image?: string;
    items?: string[];
  }[];
  image: string;
}

export interface Project {
  id: number;
  title: string;
  role: string;
  company: string;
  status: string;
  category: string;
  platform: string[];
  description: string;
  tools: string;
  coverImage: string;
  coverAnimated: string;
  videoUrl: string;
  designurl: string;
  designButtonLabel: string;
  images: string[];
  sections: ProjectSection[];
  visible?: boolean;
  featured?: boolean;
}

export interface Projects {
  games: Project[];
  uiux: Project[];
  modeling: Project[];
  design: Project[];
}

export const projects = projectsData as unknown as Projects;