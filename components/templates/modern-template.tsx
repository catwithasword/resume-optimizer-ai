import { ResumeData } from '@/lib/types';
import { LayoutSettings } from '@/lib/store';

interface TemplateProps {
    resumeData: ResumeData;
    layout: LayoutSettings;
}

export function ModernTemplate({ resumeData, layout }: TemplateProps) {
    const { name, address, phone_number, email, links, profile, education, experience, skills, achievements_awards, certificates_and_training, extracurricular_or_volunteer_experience, references } = resumeData;

    // Helper to parse Education string
    const parseEducation = (eduStr: string) => {
        const parts = eduStr.split('|').map(s => s.trim());
        return {
            institution: parts[0] || '',
            degree: parts[1] || '',
            date: parts[2] || '',
            details: parts.slice(3).join(' | ')
        };
    };

    // Helper to parse Experience
    const parseExperience = (expStr: string) => {
        const separatorRegex = / [–-] /;
        const parts = expStr.split(separatorRegex);
        const header = parts[0] || '';
        const description = parts.slice(1).join(' – ');
        const dateMatch = header.match(/\((.*?)\)$/);
        const date = dateMatch ? dateMatch[1] : '';
        const titleAndCompany = date ? header.replace(dateMatch![0], '').trim() : header;

        return {
            titleAndCompany,
            date,
            description
        };
    };

    return (
        <div
            className="w-[210mm] min-w-[210mm] shrink-0 min-h-[297mm] text-slate-800 font-sans box-border resume-document relative z-10 print:bg-white grid grid-cols-[1fr_2fr]"
            style={{
                width: '210mm',
                height: '297mm',
                overflow: 'visible',
                pageBreakAfter: 'auto',
                fontSize: `${((layout?.fontScale || 100) / 100) * 11}pt`, // Base 11pt at 100% for Modern
                lineHeight: layout?.lineHeight || 1.2,
                backgroundColor: 'transparent',
            }}
        >
            {/* Absolute Background for Sidebar - Strictly A4 Height */}
            <div className="absolute left-0 top-0 bottom-0 w-[33.333333%] bg-slate-100 border-r border-slate-200 -z-10" />

            {/* Left Sidebar Content */}
            <div className="p-6 flex flex-col gap-6 text-[0.9em] h-full">
                {/* Contact */}
                <div className="space-y-3">
                    <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-300 pb-1 mb-2">Contact</h3>
                    <div className="space-y-2 break-all">
                        {email && (
                            <div>
                                <span className="block font-semibold text-[0.8em] text-slate-500 uppercase">Email</span>
                                {email}
                            </div>
                        )}
                        {phone_number && (
                            <div>
                                <span className="block font-semibold text-[0.8em] text-slate-500 uppercase">Phone</span>
                                {phone_number}
                            </div>
                        )}
                        {address && (
                            <div>
                                <span className="block font-semibold text-[0.8em] text-slate-500 uppercase">Address</span>
                                {address}
                            </div>
                        )}
                        {links && links.length > 0 && (
                            <div>
                                <span className="block font-semibold text-[0.8em] text-slate-500 uppercase">Links</span>
                                <ul className="list-none space-y-1">
                                    {links.map((link, i) => {
                                        let label = link.replace(/^https?:\/\/(www\.)?/, '');
                                        if (label.length > 25) label = label.substring(0, 22) + '...';
                                        return (
                                            <li key={i}>
                                                <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">{label}</a>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-300 pb-1 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2 text-[0.9em]">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-white px-2 py-1 rounded border border-slate-300 shadow-sm">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements */}
                {achievements_awards && achievements_awards.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-300 pb-1 mb-2">Awards</h3>
                        <ul className="list-disc pl-4 space-y-1">
                            {achievements_awards.map((ach, i) => (
                                <li key={i}>{ach}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="p-8 flex flex-col gap-6">
                {/* Header */}
                <header className="border-b-4 border-slate-800 pb-6 mb-2">
                    <h1 className="text-[2.5em] font-extrabold uppercase tracking-tight text-slate-900 leading-tight">{name}</h1>
                    {profile && (
                        <p className="mt-4 text-slate-600 leading-relaxed text-[0.9em]">
                            {profile}
                        </p>
                    )}
                </header>

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section>
                        <h2 className="text-[1.25em] font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-slate-900 block"></span>
                            Experience
                        </h2>
                        <div className="space-y-5">
                            {experience.map((expStr, i) => {
                                const { titleAndCompany, date, description } = parseExperience(expStr);
                                return (
                                    <div key={i} className="break-inside-avoid">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-[1.1em] text-slate-800">{titleAndCompany}</h3>
                                            <span className="text-[0.85em] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{date}</span>
                                        </div>
                                        {description && (
                                            <p className="text-[0.95em] leading-relaxed text-slate-700 whitespace-pre-line">
                                                {description}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section>
                        <h2 className="text-[1.25em] font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-slate-900 block"></span>
                            Education
                        </h2>
                        <div className="space-y-4">
                            {education.map((eduStr, i) => {
                                const { institution, degree, date, details } = parseEducation(eduStr);
                                return (
                                    <div key={i} className="break-inside-avoid">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-[1.1em] text-slate-800">{institution}</h3>
                                            <span className="text-[0.9em] text-slate-500">{date}</span>
                                        </div>
                                        <div className="text-slate-700 font-medium mb-1 text-[1em]">{degree}</div>
                                        {details && (
                                            <p className="text-[0.9em] text-slate-600 italic">
                                                {details}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Projects/Volunteering mixed if needed, or separate */}
                {extracurricular_or_volunteer_experience && extracurricular_or_volunteer_experience.length > 0 && (
                    <section>
                        <h2 className="text-[1.25em] font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-slate-900 block"></span>
                            Volunteering
                        </h2>
                        <div className="space-y-2">
                            {extracurricular_or_volunteer_experience.map((vol, i) => (
                                <div key={i} className="break-inside-avoid text-[0.9em] text-slate-700">
                                    <p>{vol}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
