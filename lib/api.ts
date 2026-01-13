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
    references: [],
    etc: []
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
    uploadResume: async (file: File): Promise<ResumeData> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }

            const data = await response.json();

            // Map API response to ResumeData
            return mapApiResponseToResumeData(data);
        } catch (error) {
            console.error("Error uploading resume:", error);
            throw error;
        }
    },

    optimizeResume: async (data: ResumeData, jobDescription: string): Promise<ResumeData> => {
        const payload = {
            JD: jobDescription,
            Profile: data.profile,
            Experience: data.experience.join("\n"),
            Skills: data.skills.join("\n"),
            Achievements_Awards: data.achievements_awards.join("\n"),
            Certificate_and_Training: data.certificates_and_training.join("\n"),
            Extracurricular_Activities_or_Volunteer_Experience: data.extracurricular_or_volunteer_experience.join("\n"),
            References: data.references.join("\n"),
            etc: data.etc ? data.etc.join("\n") : ""
        };

        try {
            const response = await fetch(`${API_URL}/resume_refine`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Optimization failed with status: ${response.status}`);
            }

            const responseData = await response.json();
            const refineData = responseData.refine_data;

            if (!refineData) {
                throw new Error("Invalid response format: missing refine_data");
            }

            // Helper to split string by newline and filter empty
            const splitToList = (data: any) => {
                if (Array.isArray(data)) {
                    return safeStringArray(data);
                }
                return typeof data === 'string' ? data.split('\n').map(s => s.trim()).filter(Boolean) : [];
            };

            // Merge refined data with original data (preserving contact info)
            return {
                ...data, // Keep original name, address, etc.
                profile: refineData.Profile || data.profile,
                experience: splitToList(refineData.Experience).length > 0 ? splitToList(refineData.Experience) : data.experience,
                skills: splitToList(refineData.Skills).length > 0 ? splitToList(refineData.Skills) : data.skills,
                achievements_awards: splitToList(refineData.Achievements_Awards).length > 0 ? splitToList(refineData.Achievements_Awards) : data.achievements_awards,
                certificates_and_training: splitToList(refineData.Certificate_and_Training).length > 0 ? splitToList(refineData.Certificate_and_Training) : data.certificates_and_training,
                extracurricular_or_volunteer_experience: splitToList(refineData.Extracurricular_Activities_or_Volunteer_Experience).length > 0 ? splitToList(refineData.Extracurricular_Activities_or_Volunteer_Experience) : data.extracurricular_or_volunteer_experience,
                references: splitToList(refineData.References).length > 0 ? splitToList(refineData.References) : data.references,
                etc: splitToList(refineData.etc).length > 0 ? splitToList(refineData.etc) : (data.etc || [])
            };
        } catch (error) {
            console.error("Error optimizing resume:", error);
            throw error;
        }
    }
};

// Helper to safely convert array items to strings
const safeStringArray = (arr: any | any[] | undefined): string[] => {
    if (typeof arr === 'string') return [arr];
    if (!Array.isArray(arr)) return [];
    return arr.map(item => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
            // Try to find reasonable string representation or generic fallback
            return Object.values(item).join(' | ');
        }
        return String(item || "");
    });
};

function mapApiResponseToResumeData(data: any): ResumeData {
    return {
        name: data.Name || "",
        address: Array.isArray(data.Address) ? data.Address.join(", ") : (data.Address || ""),
        phone_number: data.Phone_number || "",
        email: data.Email || "",
        links: safeStringArray(data.Links),
        profile: data.Profile || (Array.isArray(data.etc) ? data.etc.join(" ") : "") || "",
        education: safeStringArray(data.Education),
        experience: safeStringArray(data.Experience),
        skills: safeStringArray(data.Skills),
        achievements_awards: safeStringArray(data.Achievements_Awards),
        certificates_and_training: safeStringArray(data.Certificate_and_Training),
        extracurricular_or_volunteer_experience: safeStringArray(data.Extracurricular_Activities_or_Volunteer_Experience),
        references: safeStringArray(data.References),
        etc: safeStringArray(data.etc)
    };
}
