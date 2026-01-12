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

const achievementsSchema = z.object({
    achievements: z.array(z.object({
        title: z.string().min(1, "Title is required"),
        date: z.string().optional(),
        description: z.string().optional(),
    }))
});

type AchievementsValues = z.infer<typeof achievementsSchema>;

export function AchievementsForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    const parseAchievement = (achStr: string) => {
        // "Title - Description (Date)" or "Title (Date) - Description"
        // User provided: "Dean’s List – Springfield University (2021) – Recognized for academic excellence"
        const parts = achStr.split(' – ');
        // Heuristic: First part is title. If it has parens, maybe date is inside.
        // Actually, let's keep it simple: Split by " – "

        const titleAndDate = parts[0] || '';
        const dateMatch = titleAndDate.match(/\((.*?)\)$/);
        const date = dateMatch ? dateMatch[1] : '';
        const title = dateMatch ? titleAndDate.replace(dateMatch![0], '').trim() : titleAndDate;

        const description = parts.slice(1).join(' – '); // Rest is description

        return {
            title,
            date,
            description
        };
    };

    const formatAchievement = (ach: any) => {
        let res = ach.title;
        if (ach.date) res += ` (${ach.date})`;
        if (ach.description) res += ` – ${ach.description}`;
        return res;
    };

    const form = useForm<AchievementsValues>({
        resolver: zodResolver(achievementsSchema),
        defaultValues: { achievements: resumeData?.achievements_awards?.map(parseAchievement) || [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "achievements",
    });

    useEffect(() => {
        if (resumeData?.achievements_awards) {
            // Sync logic omitted
        }
    }, [resumeData?.achievements_awards]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            const formatted = value.achievements?.map(formatAchievement) || [];
            updateResumeData({ achievements_awards: formatted });
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Achievements & Awards</CardTitle>
                <Button size="sm" onClick={() => append({ title: '' })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Achievement
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

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label>Title / Award Name</Label>
                                    <Input {...form.register(`achievements.${index}.title`)} placeholder="e.g. Employee of the Month" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label>Date (Optional)</Label>
                                    <Input {...form.register(`achievements.${index}.date`)} placeholder="e.g. 2023" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description (Optional)</Label>
                                <Textarea {...form.register(`achievements.${index}.description`)} className="min-h-[60px]" placeholder="Brief details about the achievement..." />
                            </div>
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No achievements added yet.</p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
