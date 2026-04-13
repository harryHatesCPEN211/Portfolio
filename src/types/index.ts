export interface Project {
  slug: string;
  title: string;
  year: number;
  shortDesc: string;
  description: string;
  tags: string[];
  image?: string;
  modelPath?: string;
  featured?: boolean;
  problem?: string;
  approach?: string;
  outcome?: string;
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
