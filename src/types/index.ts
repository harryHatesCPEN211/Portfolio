export interface ProjectModel {
  path: string;
  label: string;
}

export interface GalleryItem {
  type: "image" | "video" | "youtube";
  src: string;
  caption: string;
  group: string;
  wide?: boolean;
  objectFit?: "cover" | "contain";
  natural?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  year: number;
  shortDesc: string;
  description: string;
  tags: string[];
  image?: string;
  imageFit?: "cover" | "contain";
  imageRight?: string;
  imageRightFit?: "cover" | "contain";
  modelPath?: string;
  models?: ProjectModel[];
  featured?: boolean;
  problem?: string;
  approach?: string;
  outcome?: string;
  techSpecs?: { label: string; value: string }[];
  pcbDetails?: string[];
  pcbBoards?: { label: string; details: string[] }[];
  systemArchitecture?: string;
  challenges?: { title: string; detail: string }[];
  gallery?: GalleryItem[];
  galleryInline?: boolean;
  youtubeUrl?: string;
  teamPhoto?: string;
  teamCaption?: string;
  diagram?: string;
  links?: { label: string; href: string }[];
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
}
