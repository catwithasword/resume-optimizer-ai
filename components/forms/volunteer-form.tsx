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

const volunteerSchema = z.object({
    volunteerExperience: z.array(z.object({
        id: z.string(),
        organization: z.string().min(1, "Organization is required"),
        role: z.string().min(1, "Role is required"),
        startDate: z.string().min(1, "Start Date is required"),
        endDate: z.string().min(1, "End Date is required"),
        description: z.string().optional(),
    }))
});

type VolunteerValues = z.infer<typeof volunteerSchema>;

export function VolunteerForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    const form = useForm<VolunteerValues>({
        resolver: zodResolver(volunteerSchema),
        defaultValues: { volunteerExperience: resumeData?.volunteerExperience || [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "volunteerExperience",
    });

    useEffect(() => {
        if (resumeData?.volunteerExperience) {
            const current = form.getValues().volunteerExperience;
            if (JSON.stringify(resumeData.volunteerExperience) !== JSON.stringify(current)) {
                form.setValue("volunteerExperience", resumeData.volunteerExperience);
            }
        }
    }, [resumeData?.volunteerExperience, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            // @ts-ignore
            updateResumeData({ volunteerExperience: value.volunteerExperience });
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Volunteering & Extracurriculars</CardTitle>
                <Button size="sm" onClick={() => append({ id: crypto.randomUUID(), organization: '', role: '', startDate: '', endDate: '' })}>
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
                                    <Label>Organization</Label>
                                    <Input {...form.register(`volunteerExperience.${index}.organization`)} placeholder="Organization Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Input {...form.register(`volunteerExperience.${index}.role`)} placeholder="Volunteer Role" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input type="date" {...form.register(`volunteerExperience.${index}.startDate`)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input type="date" {...form.register(`volunteerExperience.${index}.endDate`)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description (Optional)</Label>
                                <Textarea {...form.register(`volunteerExperience.${index}.description`)} className="min-h-[80px]" />
                            </div>
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No volunteer experience added yet.</p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
