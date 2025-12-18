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
        id: z.string(),
        institution: z.string().min(1, "Institution is required"),
        degree: z.string().min(1, "Degree is required"),
        startDate: z.string(),
        endDate: z.string(),
        description: z.string().optional(),
    }))
});

type EducationValues = z.infer<typeof educationSchema>;

export function EducationForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    const form = useForm<EducationValues>({
        resolver: zodResolver(educationSchema),
        defaultValues: { education: resumeData?.education || [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "education",
    });

    useEffect(() => {
        if (resumeData?.education) {
            const currentEducation = form.getValues().education;
            // Only update if there's a difference to avoid infinite loops
            if (JSON.stringify(resumeData.education) !== JSON.stringify(currentEducation)) {
                form.setValue("education", resumeData.education);
            }
        }
    }, [resumeData?.education, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            // @ts-ignore
            updateResumeData({ education: value.education });
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button size="sm" onClick={() => append({ id: crypto.randomUUID(), institution: '', degree: '', startDate: '', endDate: '', description: '' })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Education
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <form className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="relative border p-4 rounded-lg space-y-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>

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
                                    <Label>Start Date</Label>
                                    <Input type="date" {...form.register(`education.${index}.startDate`)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input type="date" {...form.register(`education.${index}.endDate`)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea {...form.register(`education.${index}.description`)} className="min-h-[80px]" />
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
