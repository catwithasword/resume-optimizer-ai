import { ResumeData } from '@/lib/types';
import { LayoutSettings } from '@/lib/store';

interface TemplateProps {
    resumeData: ResumeData;
    layout: LayoutSettings;
}

export function MinimalTemplate({ resumeData, layout }: TemplateProps) {
    const { name, address, phone_number, email, links, profile, education, experience, skills, achievements_awards, certificates_and_training, extracurricular_or_volunteer_experience, references } = resumeData;

    const parseEducation = (eduStr: string) => {
        const parts = eduStr.split('|').map(s => s.trim());
        return {
            institution: parts[0] || '',
            degree: parts[1] || '',
            date: parts[2] || '',
            details: parts.slice(3).join(' | ')
        };
    };

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
            className="w-[210mm] min-w-[210mm] shrink-0 min-h-[297mm] text-gray-800 font-sans box-border resume-document relative z-10 print:bg-white"
            style={{
                pageBreakAfter: 'auto',
                padding: `${layout?.margin || 20}mm`,
                fontSize: `${((layout?.fontScale || 100) / 100) * 10}pt`, // Base 10pt at 100%
                lineHeight: layout?.lineHeight || 1.4,
                backgroundColor: 'white',
            }}
        >
            {/* Header - Centered */}
            <header className="text-center mb-8">
                <h1 className="text-[2.25em] font-light tracking-widest uppercase mb-2 text-black">{name}</h1>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[0.9em] text-gray-500 tracking-wide">
                    {address && <span>{address}</span>}
                    {email && <span>{email}</span>}
                    {phone_number && <span>{phone_number}</span>}
                    {links?.map((link, index) => {
                        let label = link.replace(/^https?:\/\/(www\.)?/, '');
                        if (label.length > 25) label = label.substring(0, 22) + '...';
                        return (
                            <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">{label}</a>
                        );
                    })}
                </div>
            </header>

            {/* Profile */}
            {profile && (
                <section className="mb-8 max-w-2xl mx-auto text-center">
                    <p className="text-gray-600 leading-relaxed italic text-[1em]">
                        "{profile}"
                    </p>
                </section>
            )}

            {/* Skills - Tags Grid */}
            {skills && skills.length > 0 && (
                <section className="mb-8">
                    <div className="flex flex-wrap justify-center gap-2">
                        {skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-[0.75em] font-medium tracking-wide uppercase border border-gray-100">
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-[0.75em] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-100 pb-2">Experience</h2>
                    <div className="space-y-6">
                        {experience.map((expStr, i) => {
                            const { titleAndCompany, date, description } = parseExperience(expStr);
                            return (
                                <div key={i} className="break-inside-avoid pl-2 border-l-2 border-transparent hover:border-gray-200 transition-colors duration-200">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-medium text-black text-[1em]">{titleAndCompany}</h3>
                                        <span className="text-[0.75em] text-gray-400 font-mono">{date}</span>
                                    </div>
                                    {description && (
                                        <p className="text-[0.9em] text-gray-600 leading-relaxed whitespace-pre-line">
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
                <section className="mb-8">
                    <h2 className="text-[0.75em] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-100 pb-2">Education</h2>
                    <div className="space-y-4">
                        {education.map((eduStr, i) => {
                            const { institution, degree, date, details } = parseEducation(eduStr);
                            return (
                                <div key={i} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-medium text-black text-[1em]">{institution}</h3>
                                        <span className="text-[0.75em] text-gray-400 font-mono">{date}</span>
                                    </div>
                                    <div className="text-[0.9em] text-gray-800">{degree}</div>
                                    {details && <p className="text-[0.75em] text-gray-500 mt-1">{details}</p>}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Combined Other Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {achievements_awards && achievements_awards.length > 0 && (
                    <section>
                        <h2 className="text-[0.75em] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 border-b border-gray-100 pb-2">Awards</h2>
                        <ul className="text-[0.9em] text-gray-600 space-y-1">
                            {achievements_awards.map((ach, i) => (
                                <li key={i}>• {ach}</li>
                            ))}
                        </ul>
                    </section>
                )}
                {certificates_and_training && certificates_and_training.length > 0 && (
                    <section>
                        <h2 className="text-[0.75em] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 border-b border-gray-100 pb-2">Certifications</h2>
                        <ul className="text-[0.9em] text-gray-600 space-y-1">
                            {certificates_and_training.map((cert, i) => (
                                <li key={i}>• {cert}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
}
