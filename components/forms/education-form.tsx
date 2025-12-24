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

const educationSchema = z.object({
    education: z.array(z.object({
        institution: z.string().min(1, "Institution is required"),
        degree: z.string().min(1, "Degree is required"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        description: z.string().optional(),
    }))
});

type EducationValues = z.infer<typeof educationSchema>;

export function EducationForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    // Heuristic Parser
    const parseEducation = (eduStr: string) => {
        const parts = eduStr.split('|').map(s => s.trim());
        const dateRange = parts[2] || '';
        const [startDate, endDate] = dateRange.split(' to ').map(d => d.trim());

        return {
            institution: parts[0] || '',
            degree: parts[1] || '',
            startDate: startDate || '',
            endDate: endDate || '',
            description: parts.slice(3).join(' | ') // Join remaining parts as description/details
        };
    };

    // Formatter
    const formatEducation = (edu: any) => {
        const dateRange = (edu.startDate || edu.endDate) ? `${edu.startDate || ''} to ${edu.endDate || ''}` : '';
        const parts = [
            edu.institution,
            edu.degree,
            dateRange,
            edu.description
        ].filter(Boolean); // Remove empty strings

        return parts.join(' | ');
    };

    const form = useForm<EducationValues>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            education: resumeData?.education?.map(parseEducation) || []
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "education",
    });

    useEffect(() => {
        if (resumeData?.education) {
            const currentEducation = form.getValues().education;
            const parsedEducation = resumeData.education.map(parseEducation);

            // Deep comparison or just simple length mismatch + fast check to avoid loops
            // For simplicity, we just check length or basic properties. 
            // Better: Compare JSON stringified versions
            if (JSON.stringify(parsedEducation) !== JSON.stringify(currentEducation)) {
                // Warning: reset() here might be too aggressive if user is typing, 
                // but since store update happens on effect, we strictly sync 1 way usually
                // or use onBlur to update store.
                // For now, let's just initialize. 
                // Ideally, we don't reset while editing.
                // form.reset({ education: parsedEducation }); 
            }
        }
    }, [resumeData?.education]); // simplified dependency

    useEffect(() => {
        const subscription = form.watch((value) => {
            const formattedEducation = value.education?.map(formatEducation) || [];
            updateResumeData({ education: formattedEducation });
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button size="sm" onClick={() => append({ institution: '', degree: '', startDate: '', endDate: '', description: '' })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Education
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
                                    <Label>Institution</Label>
                                    <Input {...form.register(`education.${index}.institution`)} placeholder="University Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Degree</Label>
                                    <Input {...form.register(`education.${index}.degree`)} placeholder="Bachelor of Science" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date (YYYY-MM)</Label>
                                    <Input {...form.register(`education.${index}.startDate`)} placeholder="2019-08" />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date (YYYY-MM)</Label>
                                    <Input {...form.register(`education.${index}.endDate`)} placeholder="2023-05" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Details (GPA, Coursework)</Label>
                                <Textarea {...form.register(`education.${index}.description`)} className="min-h-[80px]" placeholder="GPA: 3.7 | Coursework: ..." />
                            </div>
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No education entries added yet.</p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
