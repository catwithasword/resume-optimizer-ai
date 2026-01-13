export interface ResumeData {
  name: string;
  address: string;
  phone_number: string;
  email: string;
  links: string[];
  profile: string; // Summary
  education: string[];
  experience: string[];
  skills: string[];
  achievements_awards: string[];
  certificates_and_training: string[];
  extracurricular_or_volunteer_experience: string[];
  references: string[];
  etc: string[];
}

export interface OptimizationResult {
  score: number;
  suggestions: string[];
  improvedSummary?: string;
}
