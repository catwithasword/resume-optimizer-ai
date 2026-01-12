"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResumeStore } from '@/lib/store';
import { useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

const experienceSchema = z.object({
    experience: z.array(z.object({
        company: z.string().min(1, "Company is required"),
        position: z.string().min(1, "Position is required"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        description: z.string().optional(),
    }))
});

type ExperienceValues = z.infer<typeof experienceSchema>;

export function ExperienceForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    // Schema: "Role at Company (Date) – Description"
    const parseExperience = (expStr: string) => {
        const separatorRegex = / [–-] /;
        const parts = expStr.split(separatorRegex);

        const header = parts[0] || '';
        const description = parts.slice(1).join(' – ');

        // "Role at Company (2023-06 to Present)"
        const dateMatch = header.match(/\((.*?)\)$/);
        const dateRangeStr = dateMatch ? dateMatch[1] : '';
        const titleAndCompany = dateMatch ? header.replace(dateMatch![0], '').trim() : header;

        const [startDate, endDate] = dateRangeStr.split(' to ').map(d => d.trim());

        // "Role at Company" -> split by " at " (last occurrence preferred)
        const atIndex = titleAndCompany.lastIndexOf(' at ');
        let position = titleAndCompany;
        let company = '';

        if (atIndex !== -1) {
            position = titleAndCompany.substring(0, atIndex).trim();
            company = titleAndCompany.substring(atIndex + 4).trim();
        }

        return {
            company: company || 'Company', // fallback
            position: position || '',
            startDate: startDate || '',
            endDate: endDate || '',
            description: description || ''
        };
    };

    const formatExperience = (exp: any) => {
        let header = `${exp.position} at ${exp.company}`;
        if (exp.startDate || exp.endDate) {
            header += ` (${exp.startDate || ''} to ${exp.endDate || ''})`;
        }

        return exp.description ? `${header} – ${exp.description}` : header;
    };

    const form = useForm<ExperienceValues>({
        resolver: zodResolver(experienceSchema),
        defaultValues: { experience: resumeData?.experience?.map(parseExperience) || [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "experience",
    });

    useEffect(() => {
        if (resumeData?.experience) {
            // const parsed = resumeData.experience.map(parseExperience);
            // Sync logic omitted to prevent loops, relying on initial load
        }
    }, [resumeData?.experience]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            const formatted = value.experience?.map(formatExperience) || [];
            updateResumeData({ experience: formatted });
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Experience</CardTitle>
                <Button size="sm" onClick={() => append({ company: '', position: '', startDate: '', endDate: '', description: '' })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Experience
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <form className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="border p-4 rounded-lg space-y-4">
                            <div className="flex justify-end mb-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => remove(index)}
                                    type="button"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input {...form.register(`experience.${index}.company`)} placeholder="Company Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Position</Label>
                                    <Input {...form.register(`experience.${index}.position`)} placeholder="Job Title" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date (YYYY-MM)</Label>
                                    <Input {...form.register(`experience.${index}.startDate`)} placeholder="2023-06" />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input {...form.register(`experience.${index}.endDate`)} placeholder="Present" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea {...form.register(`experience.${index}.description`)} className="min-h-[80px]" />
                            </div>
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No experience entries added yet.</p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
