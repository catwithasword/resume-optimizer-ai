import { ResumeData } from '@/lib/types';
import { LayoutSettings } from '@/lib/store';

interface TemplateProps {
    resumeData: ResumeData;
    layout: LayoutSettings;
}

export function HarvardTemplate({ resumeData, layout }: TemplateProps) {
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
            className="w-[210mm] min-w-[210mm] shrink-0 min-h-[297mm] text-black font-serif box-border resume-document relative z-10 print:bg-white"
            style={{
                pageBreakAfter: 'auto',
                padding: `${layout?.margin || 15}mm`,
                fontSize: `${((layout?.fontScale || 100) / 100) * 10}pt`, // Base 10pt at 100%
                lineHeight: layout?.lineHeight || 1.2,
                backgroundColor: 'transparent',
                // We handle minHeight in the parent or let it grow
            }}
        >
            {/* Header */}
            <header className="text-center space-y-1 pb-4">
                <h1 className="text-2xl font-bold uppercase tracking-wide">{name}</h1>
                <div className="flex flex-wrap justify-center gap-2 text-black">
                    {address && <span>{address}</span>}
                    {address && (phone_number || email || (links && links.length > 0)) && <span>•</span>}

                    {phone_number && <span>{phone_number}</span>}
                    {phone_number && (email || (links && links.length > 0)) && <span>•</span>}

                    {email && <span>{email}</span>}
                    {email && (links && links.length > 0) && <span>•</span>}

                    {links?.map((link, index) => {
                        let label = link.replace(/^https?:\/\/(www\.)?/, '');
                        if (label.length > 30) label = label.substring(0, 27) + '...';

                        return (
                            <span key={index}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">{label}</a>
                                {index < (links.length || 0) - 1 && <span> • </span>}
                            </span>
                        );
                    })}
                </div>
                {profile && (
                    <p className="pt-2 text-left leading-relaxed">
                        {profile}
                    </p>
                )}
            </header>

            {/* Education */}
            {education && education.length > 0 && (
                <section className="mt-4">
                    <h2 className="font-bold uppercase border-b border-black mb-3">Education</h2>
                    <div className="space-y-3">
                        {education.map((eduStr, i) => {
                            const { institution, degree, date, details } = parseEducation(eduStr);
                            return (
                                <div key={i} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold">{institution}</h3>
                                        <span className="">{date}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline italic">
                                        <div>{degree}</div>
                                    </div>
                                    {details && (
                                        <p className="mt-1 leading-snug whitespace-pre-line text-[0.95em]">
                                            {details}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mt-4">
                    <h2 className="font-bold uppercase border-b border-black mb-3">Experience</h2>
                    <div className="space-y-4">
                        {experience.map((expStr, i) => {
                            const { titleAndCompany, date, description } = parseExperience(expStr);
                            return (
                                <div key={i} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold">{titleAndCompany}</h3>
                                        <span className="">{date}</span>
                                    </div>
                                    {description && (
                                        <p className="leading-snug whitespace-pre-line text-[0.95em]">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Achievements / Awards */}
            {achievements_awards && achievements_awards.length > 0 && (
                <section className="mt-4">
                    <h2 className="font-bold uppercase border-b border-black mb-3">Achievements & Awards</h2>
                    <div className="space-y-1">
                        {achievements_awards.map((ach, i) => (
                            <div key={i} className="flex gap-2 break-inside-avoid">
                                <span>• {ach}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certificates */}
            {certificates_and_training && certificates_and_training.length > 0 && (
                <section className="mt-4">
                    <h2 className="font-bold uppercase border-b border-black mb-3">Certificates</h2>
                    <div className="space-y-1">
                        {certificates_and_training.map((cert, i) => (
                            <div key={i} className="flex gap-2 break-inside-avoid">
                                <span>• {cert}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Volunteer Experience */}
            {extracurricular_or_volunteer_experience && extracurricular_or_volunteer_experience.length > 0 && (
                <section className="mt-4">
                    <h2 className="font-bold uppercase border-b border-black mb-3">Volunteering</h2>
                    <div className="space-y-1">
                        {extracurricular_or_volunteer_experience.map((vol, i) => (
                            <div key={i} className="break-inside-avoid">
                                <p>{vol}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <section className="mt-4">
                    <h2 className="font-bold uppercase border-b border-black mb-3">Skills</h2>
                    <div className="break-inside-avoid">
                        <span className="font-bold">Skills: </span>
                        {skills.map((skill, index) => (
                            <span key={index}>
                                {skill}
                                {index < skills.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* References */}
            {references && references.length > 0 && (
                <section className="mt-4">
                    <h2 className="font-bold uppercase border-b border-black mb-3">References</h2>
                    <div className="space-y-1">
                        {references.map((ref, i) => (
                            <div key={i} className="break-inside-avoid">
                                <p>{ref}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
