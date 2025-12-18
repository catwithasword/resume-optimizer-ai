"use client";

import { useResumeStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function ResumePreview() {
    const resumeData = useResumeStore((state) => state.resumeData);

    if (!resumeData) {
        return (
            <Card className="h-full flex items-center justify-center p-8 text-muted-foreground bg-muted/30 border-dashed">
                <p>Resume preview will appear here</p>
            </Card>
        );
    }

    const { personalInfo, education, experience, skills } = resumeData;

    return (
        <Card className="h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                <h3 className="font-semibold">Live Preview</h3>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                </Button>
            </div>
            <div className="flex-1 overflow-auto p-8 bg-white text-black font-sans text-sm">
                {/* Simple Template Layout */}
                <div className="max-w-[21cm] mx-auto space-y-6">
                    {/* Header */}
                    <header className="text-center space-y-2 border-b pb-6">
                        <h1 className="text-3xl font-bold uppercase tracking-wider">{personalInfo.fullName}</h1>
                        <div className="flex flex-wrap justify-center gap-3 text-gray-600 text-xs">
                            {personalInfo.email && <span>{personalInfo.email}</span>}
                            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                            {personalInfo.address && <span>• {personalInfo.address}</span>}
                            {personalInfo.website && <span>• {personalInfo.website}</span>}
                        </div>
                        {personalInfo.summary && (
                            <p className="max-w-xl mx-auto text-gray-700 mt-4 leading-relaxed">
                                {personalInfo.summary}
                            </p>
                        )}
                    </header>

                    {/* Experience */}
                    {experience.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 pb-1">Experience</h2>
                            <div className="space-y-4">
                                {experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-gray-900">{exp.company}</h3>
                                            <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <div className="text-sm font-medium text-gray-700 mb-1">{exp.position}</div>
                                        {exp.description && (
                                            <p className="text-gray-600 leading-snug whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 pb-1">Education</h2>
                            <div className="space-y-4">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                                            <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            <span className="font-medium">{edu.degree}</span>
                                            {edu.description && <span> • {edu.description}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 pb-1">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(skill => (
                                    <span key={skill.id} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800 font-medium">
                                        {skill.name} {skill.level && <span className="text-gray-400 font-normal">({skill.level})</span>}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </Card>
    );
}
