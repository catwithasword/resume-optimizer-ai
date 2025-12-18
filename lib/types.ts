export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string; // e.g., Beginner, Intermediate, Expert
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    website?: string;
    summary?: string;
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
}

export interface OptimizationResult {
  score: number;
  suggestions: string[];
  improvedSummary?: string;
}
