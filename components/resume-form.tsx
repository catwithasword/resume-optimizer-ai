"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from './forms/personal-info-form';
import { EducationForm } from './forms/education-form';
import { ExperienceForm } from './forms/experience-form';
import { SkillsForm } from './forms/skills-form';

export function ResumeForm() {
    return (
        <div className="space-y-6">
            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="mt-6">
                    <PersonalInfoForm />
                </TabsContent>
                <TabsContent value="education" className="mt-6">
                    <EducationForm />
                </TabsContent>
                <TabsContent value="experience" className="mt-6">
                    <ExperienceForm />
                </TabsContent>
                <TabsContent value="skills" className="mt-6">
                    <SkillsForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
