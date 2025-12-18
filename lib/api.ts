import { ResumeData, OptimizationResult } from './types';

// Mock data
const MOCK_RESUME_DATA: ResumeData = {
    personalInfo: {
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        address: "123 Main St, Anytown, USA",
        website: "https://johndoe.com",
        summary: "Experienced software engineer with a passion for building scalable web applications.",
    },
    education: [
        {
            id: "1",
            institution: "State University",
            degree: "Bachelor of Science in Computer Science",
            startDate: "2015-09-01",
            endDate: "2019-05-31",
            description: "Graduated with Honors. GPA: 3.8/4.0",
        }
    ],
    experience: [
        {
            id: "1",
            company: "Tech Corp",
            position: "Senior Frontend Developer",
            startDate: "2021-06-01",
            endDate: "Present",
            description: "Leading a team of 5 developers building the core product dashboard using Next.js and React.",
        },
        {
            id: "2",
            company: "Startup Inc",
            position: "Junior Developer",
            startDate: "2019-07-01",
            endDate: "2021-05-31",
            description: "Implemented responsive UI components and improved site performance by 30%.",
        }
    ],
    skills: [
        { id: "1", name: "React", level: "Expert" },
        { id: "2", name: "TypeScript", level: "Advanced" },
        { id: "3", name: "Node.js", level: "Intermediate" },
    ]
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
