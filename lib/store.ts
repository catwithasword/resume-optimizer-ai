import { create } from 'zustand';
import { ResumeData, OptimizationResult } from './types';

interface ResumeStore {
    resumeData: ResumeData | null;
    jobDescription: string;
    isOptimizing: boolean;
    optimizationResult: OptimizationResult | null;

    setResumeData: (data: ResumeData) => void;
    updateResumeData: (data: Partial<ResumeData>) => void;
    setJobDescription: (jd: string) => void;
    setOptimizationResult: (result: OptimizationResult) => void;
    setIsOptimizing: (isOptimizing: boolean) => void;
    reset: () => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
    resumeData: null,
    jobDescription: '',
    isOptimizing: false,
    optimizationResult: null,

    setResumeData: (data) => set({ resumeData: data }),
    updateResumeData: (newData) =>
        set((state) => ({
            resumeData: state.resumeData ? { ...state.resumeData, ...newData } : null
        })),
    setJobDescription: (jd) => set({ jobDescription: jd }),
    setOptimizationResult: (result) => set({ optimizationResult: result }),
    setIsOptimizing: (isOptimizing) => set({ isOptimizing }),
    reset: () => set({ resumeData: null, jobDescription: '', optimizationResult: null }),
}));
