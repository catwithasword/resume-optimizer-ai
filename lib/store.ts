import { create } from 'zustand';
import { ResumeData, OptimizationResult } from './types';

interface ResumeStore {
    resumeData: ResumeData | null;
    jobDescription: string;
    isOptimizing: boolean;
    optimizationResult: OptimizationResult | null;
    layout: LayoutSettings;

    setResumeData: (data: ResumeData) => void;
    updateResumeData: (data: Partial<ResumeData>) => void;
    setJobDescription: (jd: string) => void;
    setOptimizationResult: (result: OptimizationResult) => void;
    setIsOptimizing: (isOptimizing: boolean) => void;
    updateLayout: (layout: Partial<LayoutSettings>) => void;
    reset: () => void;
}

export interface LayoutSettings {
    fontScale: number; // percentage, e.g., 100
    lineHeight: number;
    margin: number;
    zoom: number;
    selectedTemplate: string;
}

const defaultResumeData: ResumeData = {
    name: "",
    address: "",
    phone_number: "",
    email: "",
    links: [],
    profile: "",
    education: [],
    experience: [],
    skills: [],
    achievements_awards: [],
    certificates_and_training: [],
    extracurricular_or_volunteer_experience: [],
    references: []
};

const defaultLayout: LayoutSettings = {
    fontScale: 100, // %
    lineHeight: 1.2,
    margin: 15, // mm
    zoom: 100, // %
    selectedTemplate: 'harvard'
};

export const useResumeStore = create<ResumeStore>((set) => ({
    resumeData: defaultResumeData,
    jobDescription: '',
    isOptimizing: false,
    optimizationResult: null,
    layout: defaultLayout, // Initialize layout

    setResumeData: (data) => set({ resumeData: data }),
    updateResumeData: (newData) =>
        set((state) => ({
            resumeData: state.resumeData ? { ...state.resumeData, ...newData } : null
        })),
    setJobDescription: (jd) => set({ jobDescription: jd }),
    setOptimizationResult: (result) => set({ optimizationResult: result }),
    setIsOptimizing: (isOptimizing) => set({ isOptimizing }),
    updateLayout: (newLayout) =>
        set((state) => ({
            layout: { ...state.layout, ...newLayout }
        })),
    reset: () => set({ resumeData: defaultResumeData, jobDescription: '', optimizationResult: null, layout: defaultLayout }),
}));
