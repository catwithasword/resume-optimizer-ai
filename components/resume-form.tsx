"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from './forms/personal-info-form';
import { EducationForm } from './forms/education-form';
import { ExperienceForm } from './forms/experience-form';
import { SkillsForm } from './forms/skills-form';
import { AchievementsForm } from './forms/achievements-form';
import { CertificatesForm } from './forms/certificates-form';
import { VolunteerForm } from './forms/volunteer-form';
import { ReferencesForm } from './forms/references-form';
import { EtcForm } from './forms/etc-form';

export function ResumeForm() {
    return (
        <div className="space-y-6">
            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="flex flex-col h-auto bg-muted/50 p-2 rounded-lg w-full mb-4 gap-2">
                    <div className="grid grid-cols-5 gap-2 w-full">
                        <TabsTrigger value="personal" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Personal</TabsTrigger>
                        <TabsTrigger value="education" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Education</TabsTrigger>
                        <TabsTrigger value="experience" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Experience</TabsTrigger>
                        <TabsTrigger value="skills" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Skills</TabsTrigger>
                        <TabsTrigger value="achievements" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Achievements</TabsTrigger>
                    </div>
                    <div className="flex justify-center w-full gap-2">
                        <TabsTrigger value="certificates" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Certificates</TabsTrigger>
                        <TabsTrigger value="volunteer" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Volunteer</TabsTrigger>
                        <TabsTrigger value="references" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">References</TabsTrigger>
                        <TabsTrigger value="etc" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">ETC.</TabsTrigger>
                    </div>
                </TabsList>

                <TabsContent value="personal" className="mt-0"><PersonalInfoForm /></TabsContent>
                <TabsContent value="education" className="mt-0"><EducationForm /></TabsContent>
                <TabsContent value="experience" className="mt-0"><ExperienceForm /></TabsContent>
                <TabsContent value="skills" className="mt-0"><SkillsForm /></TabsContent>
                <TabsContent value="achievements" className="mt-0"><AchievementsForm /></TabsContent>
                <TabsContent value="certificates" className="mt-0"><CertificatesForm /></TabsContent>
                <TabsContent value="volunteer" className="mt-0"><VolunteerForm /></TabsContent>
                <TabsContent value="references" className="mt-0"><ReferencesForm /></TabsContent>
                <TabsContent value="etc" className="mt-0"><EtcForm /></TabsContent>
            </Tabs>
        </div>
    );
}
