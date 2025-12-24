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
    fontSize: number;
    lineHeight: number;
    margin: number;
}

const defaultResumeData: ResumeData = {
    name: "Alex Johnson",
    address: "123 Main Street, Springfield, IL, USA",
    phone_number: "+1-555-123-4567",
    email: "alex.johnson@email.com",

    links: [
        "https://www.linkedin.com/in/alexjohnson",
        "https://github.com/alexjohnson",
        "https://alexjohnson.dev",
        "https://twitter.com/alexjohnson"
    ],

    profile: "Motivated and detail-oriented professional with strong problem-solving skills and experience in software development and teamwork. Seeking opportunities to contribute to innovative projects and grow professionally.",

    education: [
        "Springfield University | Bachelor of Science in Computer Science | 2019-08 to 2023-05 | GPA: 3.7/4.0 | Coursework: Data Structures, Algorithms, Web Development, Database Systems"
    ],

    experience: [
        "Junior Software Developer at Tech Solutions Inc., Chicago, IL (2023-06 to Present) – Developed and maintained web applications using JavaScript and React; Collaborated on new features; Fixed bugs and improved performance",
        "Software Development Intern at Innovate Labs, Remote (2022-06 to 2022-08) – Developed internal tools using Python; Testing and documentation; Code reviews and meetings"
    ],

    skills: [
        "JavaScript",
        "Python",
        "React",
        "Node.js",
        "SQL",
        "Git",
        "Communication",
        "Teamwork",
        "Problem Solving",
        "Time Management",
        "English (Fluent)",
        "Spanish (Intermediate)"
    ],

    achievements_awards: [
        "Dean’s List – Springfield University (2021) – Recognized for academic excellence",
        "Best Final Year Project – Department of Computer Science (2023) – Innovative web-based application"
    ],

    certificates_and_training: [
        "Full Stack Web Development Certificate – Online Learning Platform (2022)",
        "Python for Data Analysis – Coursera (2021)"
    ],

    extracurricular_or_volunteer_experience: [
        "Volunteer Tutor at Community Learning Center (2020-09 to 2022-05) – Tutored high school students in programming",
        "Member of University Coding Club (2019-09 to 2023-05) – Hackathons and collaborative projects"
    ],

    references: [
        "Dr. Emily Carter – Professor of Computer Science, Springfield University – emily.carter@springfield.edu",
        "Michael Brown – Senior Software Engineer, Tech Solutions Inc. – michael.brown@techsolutions.com"
    ]
};

const defaultLayout: LayoutSettings = {
    fontSize: 10, // pt (closer to standard document font sizes)
    lineHeight: 1.2,
    margin: 15 // mm
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
