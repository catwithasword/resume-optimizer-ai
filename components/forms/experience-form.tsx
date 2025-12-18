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
        id: z.string(),
        company: z.string().min(1, "Company is required"),
        position: z.string().min(1, "Position is required"),
        startDate: z.string(),
        endDate: z.string(),
        description: z.string().optional(),
    }))
});

type ExperienceValues = z.infer<typeof experienceSchema>;

export function ExperienceForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    const form = useForm<ExperienceValues>({
        resolver: zodResolver(experienceSchema),
        defaultValues: { experience: resumeData?.experience || [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "experience",
    });

    useEffect(() => {
        if (resumeData?.experience) {
            const currentExperience = form.getValues().experience;
            if (JSON.stringify(resumeData.experience) !== JSON.stringify(currentExperience)) {
                form.setValue("experience", resumeData.experience);
            }
        }
    }, [resumeData?.experience, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            // @ts-ignore
            updateResumeData({ experience: value.experience });
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Experience</CardTitle>
                <Button size="sm" onClick={() => append({ id: crypto.randomUUID(), company: '', position: '', startDate: '', endDate: '', description: '' })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Experience
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
                                    <Label>Start Date</Label>
                                    <Input type="date" {...form.register(`experience.${index}.startDate`)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input type="date" {...form.register(`experience.${index}.endDate`)} />
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
