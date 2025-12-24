"use client";

import { useResumeStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export function ResumePreview() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const layout = useResumeStore((state) => state.layout);
    const updateLayout = useResumeStore((state) => state.updateLayout);
    const contentRef = useRef<HTMLDivElement>(null);
    const pageStyle = `
        @page {
            size: A4;
            margin: 0;
        }
        @media print {
            body {
                -webkit-print-color-adjust: exact;
            }
            /* Reset any conflicting styles */
            html, body {
                height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
            }
        }
    `;

    const reactToPrintFn = useReactToPrint({
        contentRef,
        documentTitle: `Resume - ${resumeData?.name || 'Draft'}`,
        pageStyle: pageStyle,
    });


    if (!resumeData) {
        return (
            <Card className="h-full flex items-center justify-center p-8 text-muted-foreground bg-muted/30 border-dashed">
                <p>Resume preview will appear here</p>
            </Card>
        );
    }

    const { name, address, phone_number, email, links, profile, education, experience, skills, achievements_awards, certificates_and_training, extracurricular_or_volunteer_experience, references } = resumeData;

    // Helper to parse Education string: "Institution | Degree | Date | GPA | Coursework"
    // Heuristic: Split by '|', then try to map to [Institution, Degree, Date, optional...]
    const parseEducation = (eduStr: string) => {
        const parts = eduStr.split('|').map(s => s.trim());
        return {
            institution: parts[0] || '',
            degree: parts[1] || '',
            date: parts[2] || '',
            details: parts.slice(3).join(' | ')
        };
    };

    // Helper to parse Experience: "Role at Company (Date) – Description"
    // Regex to try and extract Role, Company, Date. 
    // Fallback: Split by '–' (en dash) or '-' to separate header from description
    const parseExperience = (expStr: string) => {
        // Try to finding the separator "–" or "-" which likely separates header from description
        const separatorRegex = / [–-] /;
        const parts = expStr.split(separatorRegex);

        const header = parts[0] || '';
        const description = parts.slice(1).join(' – '); // Rejoin the rest

        // In header, try to extract Date if it's in parentheses at the end
        // "Role at Company (2023-06 to Present)"
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
        <Card className="h-full flex flex-col">
            <div className="p-4 border-b space-y-4 bg-muted/30">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Live Preview</h3>
                    <Button variant="outline" size="sm" onClick={() => reactToPrintFn()}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                    </Button>
                </div>

                {/* Layout Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Font Size: {layout?.fontSize || 10}pt</Label>
                        </div>
                        <Slider
                            value={[layout?.fontSize || 10]}
                            min={8}
                            max={14}
                            step={0.5}
                            onValueChange={(val: number[]) => updateLayout({ fontSize: val[0] })}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Line Spacing: {layout?.lineHeight || 1.2}</Label>
                        </div>
                        <Slider
                            value={[layout?.lineHeight || 1.2]}
                            min={1.0}
                            max={2.0}
                            step={0.1}
                            onValueChange={(val: number[]) => updateLayout({ lineHeight: val[0] })}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Margin: {layout?.margin || 15}mm</Label>
                        </div>
                        <Slider
                            value={[layout?.margin || 15]}
                            min={5}
                            max={30}
                            step={1}
                            onValueChange={(val: number[]) => updateLayout({ margin: val[0] })}
                        />
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-8 bg-gray-100 dark:bg-gray-900">
                <div className="flex justify-center">
                    <style type="text/css" media="print">
                        {pageStyle}
                    </style>
                    {/* Harvard Style Template - A4 Paper */}
                    <div
                        ref={contentRef}
                        className="w-[210mm] min-w-[210mm] shrink-0 min-h-[297mm] bg-white shadow-2xl print:shadow-none print:min-h-[296mm] print:h-auto text-black font-serif box-border"
                        style={{
                            pageBreakAfter: 'auto',
                            padding: `${layout?.margin || 15}mm`,
                            fontSize: `${layout?.fontSize || 10}pt`,
                            lineHeight: layout?.lineHeight || 1.2
                        }}
                    >
                        {/* Header */}
                        <header className="text-center space-y-1 pb-4 border-b border-black">
                            <h1 className="text-2xl font-bold uppercase tracking-wide">{name}</h1>
                            <div className="flex flex-wrap justify-center gap-2 text-black">
                                {address && <span>{address}</span>}
                                {address && (phone_number || email || (links && links.length > 0)) && <span>•</span>}

                                {phone_number && <span>{phone_number}</span>}
                                {phone_number && (email || (links && links.length > 0)) && <span>•</span>}

                                {email && <span>{email}</span>}
                                {email && (links && links.length > 0) && <span>•</span>}

                                {links?.map((link, index) => {
                                    // Extract simple label from URL (e.g. linkedin.com/in/foo -> linkedin/foo or just linkedin)
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
                                            <div key={i}>
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
                                            <div key={i}>
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
                                        <div key={i} className="flex gap-2">
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
                                        <div key={i} className="flex gap-2">
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
                                        <div key={i}>
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
                                <div>
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
                                        <div key={i}>
                                            <p>{ref}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
