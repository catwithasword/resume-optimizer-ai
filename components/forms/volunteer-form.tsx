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
        organization: z.string().min(1, "Organization is required"),
        role: z.string().min(1, "Role is required"),
        date: z.string().optional(),
        description: z.string().optional(),
    }))
});

type VolunteerValues = z.infer<typeof volunteerSchema>;

export function VolunteerForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    const parseVolunteer = (volStr: string) => {
        // "Role at Organization (Date) – Description"
        // Heuristic split
        const parts = volStr.split(' – ');
        const roleAndOrgAndDate = parts[0] || '';
        const description = parts.slice(1).join(' – ');

        // Try to extract date
        const dateMatch = roleAndOrgAndDate.match(/\((.*?)\)$/);
        const date = dateMatch ? dateMatch[1] : '';
        const roleAndOrg = dateMatch ? roleAndOrgAndDate.replace(dateMatch![0], '').trim() : roleAndOrgAndDate;

        // Try to split Role and Organization by " at "
        // "Volunteer Tutor at Community Learning Center"
        const atSplit = roleAndOrg.split(' at ');
        const role = atSplit[0] || '';
        const organization = atSplit.length > 1 ? atSplit.slice(1).join(' at ') : '';

        return {
            role: role || roleAndOrg, // Fallback if no 'at'
            organization: organization || 'Organization', // Fallback
            date,
            description
        };
    };

    const formatVolunteer = (vol: any) => {
        // "Role at Organization (Date) – Description"
        let res = vol.role;
        if (vol.organization) res += ` at ${vol.organization}`;
        if (vol.date) res += ` (${vol.date})`;
        if (vol.description) res += ` – ${vol.description}`;
        return res;
    };

    const form = useForm<VolunteerValues>({
        resolver: zodResolver(volunteerSchema),
        defaultValues: {
            volunteerExperience: resumeData?.extracurricular_or_volunteer_experience?.map(parseVolunteer) || []
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "volunteerExperience",
    });

    useEffect(() => {
        if (resumeData?.extracurricular_or_volunteer_experience) {
            // Sync logic omitted to avoid complexity, initial load is enough usually
        }
    }, [resumeData?.extracurricular_or_volunteer_experience]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            const formatted = value.volunteerExperience?.map(formatVolunteer) || [];
            updateResumeData({ extracurricular_or_volunteer_experience: formatted });
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Volunteering & Extracurriculars</CardTitle>
                <Button size="sm" onClick={() => append({ organization: '', role: '', date: '', description: '' })}>
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
                                type="button"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Input {...form.register(`volunteerExperience.${index}.role`)} placeholder="Volunteer Role" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Organization</Label>
                                    <Input {...form.register(`volunteerExperience.${index}.organization`)} placeholder="Organization Name" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Date (Optional)</Label>
                                <Input {...form.register(`volunteerExperience.${index}.date`)} placeholder="e.g. 2020 - 2022" />
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
