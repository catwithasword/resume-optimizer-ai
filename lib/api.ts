import { ResumeData, OptimizationResult } from './types';

// Mock data
const MOCK_RESUME_DATA: ResumeData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone_number: "+1 234 567 890",
    address: "123 Main St, Anytown, USA",
    links: ["https://johndoe.com"],
    profile: "Experienced software engineer with a passion for building scalable web applications.",
    education: [
        "State University | Bachelor of Science in Computer Science | 2015-09 to 2019-05 | GPA: 3.8/4.0 | Graduated with Honors"
    ],
    experience: [
        "Senior Frontend Developer at Tech Corp (2021-06 to Present) – Leading a team of 5 developers building the core product dashboard using Next.js and React.",
        "Junior Developer at Startup Inc (2019-07 to 2021-05) – Implemented responsive UI components and improved site performance by 30%."
    ],
    skills: [
        "React",
        "TypeScript",
        "Node.js"
    ],
    achievements_awards: [],
    certificates_and_training: [],
    extracurricular_or_volunteer_experience: [],
    references: []
};

const MOCK_OPTIMIZATION_RESULT: OptimizationResult = {
    score: 85,
    suggestions: [
        "Add more quantifiable metrics to your experience descriptions.",
        "Highlight leadership skills in the Senior Developer role.",
        "Include 'Next.js' in your skills section as it's relevant to the job.",
    ],
    improvedSummary: "Result-oriented Senior Frontend Developer with 4+ years of experience in building scalable web applications using React and Next.js. Proven track record of leading teams and optimizing performance."
};

export const api = {
    uploadResume: async (file: File): Promise<ResumeData> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return MOCK_RESUME_DATA;
    },

    optimizeResume: async (data: ResumeData, jobDescription: string): Promise<OptimizationResult> => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return MOCK_OPTIMIZATION_RESULT;
    }
};
