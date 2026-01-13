import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { ResumeData } from "./types";

export function hasResumeData(data: ResumeData | null): boolean {
  if (!data) return false;

  // Check if any major field has content
  // Safely check strings in case data coming from API/JSON is not strict
  const name = typeof data.name === 'string' ? data.name : '';
  const profile = typeof data.profile === 'string' ? data.profile : '';

  return (
    name.trim().length > 0 ||
    profile.trim().length > 0 ||
    (Array.isArray(data.education) && data.education.length > 0) ||
    (Array.isArray(data.experience) && data.experience.length > 0) ||
    (Array.isArray(data.skills) && data.skills.length > 0)
  );
}
