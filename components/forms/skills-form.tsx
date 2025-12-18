"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResumeStore } from '@/lib/store';
import { useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

const skillsSchema = z.object({
    skills: z.array(z.object({
        id: z.string(),
        name: z.string().min(1, "Skill name is required"),
        level: z.string().optional(),
    }))
});

type SkillsValues = z.infer<typeof skillsSchema>;

export function SkillsForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    const form = useForm<SkillsValues>({
        resolver: zodResolver(skillsSchema),
        defaultValues: { skills: resumeData?.skills || [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "skills",
    });

    useEffect(() => {
        if (resumeData?.skills) {
            const currentSkills = form.getValues().skills;
            if (JSON.stringify(resumeData.skills) !== JSON.stringify(currentSkills)) {
                form.setValue("skills", resumeData.skills);
            }
        }
    }, [resumeData?.skills, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            // @ts-ignore
            updateResumeData({ skills: value.skills });
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button size="sm" onClick={() => append({ id: crypto.randomUUID(), name: '', level: 'Intermediate' })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Skill
                </Button>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-end border p-3 rounded-md">
                                <div className="flex-1 space-y-2">
                                    <Label className="sr-only">Skill Name</Label>
                                    <Input {...form.register(`skills.${index}.name`)} placeholder="Skill (e.g. React)" />
                                </div>
                                <div className="w-[140px] space-y-2">
                                    <Label className="sr-only">Level</Label>
                                    <Select
                                        onValueChange={(val) => form.setValue(`skills.${index}.level`, val)}
                                        defaultValue={field.level}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                            <SelectItem value="Expert">Expert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
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
                        ))}
                    </div>
                    {fields.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No skills added yet.</p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
