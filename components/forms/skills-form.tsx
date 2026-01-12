"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResumeStore } from '@/lib/store';
import { useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

const skillsSchema = z.object({
    skills: z.array(z.object({
        name: z.string().min(1, "Skill name is required"),
    }))
});

type SkillsValues = z.infer<typeof skillsSchema>;

export function SkillsForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    const parseSkill = (skillStr: string) => {
        // Legacy: "Skill (Level)" -> just "Skill"
        const match = skillStr.match(/^(.*?) \((.*?)\)$/);
        if (match) {
            return { name: match[1] };
        }
        return { name: skillStr };
    };

    const formatSkill = (skill: any) => {
        return skill.name;
    };

    const form = useForm<SkillsValues>({
        resolver: zodResolver(skillsSchema),
        defaultValues: { skills: resumeData?.skills?.map(parseSkill) || [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "skills",
    });

    useEffect(() => {
        if (resumeData?.skills) {
            // Sync logic omitted to prevent loops
        }
    }, [resumeData?.skills]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            const formatted = value.skills?.map(formatSkill) || [];
            updateResumeData({ skills: formatted });
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button size="sm" onClick={() => append({ name: '' })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Skill
                </Button>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center border p-3 rounded-md">
                                <div className="flex-1">
                                    <Label className="sr-only">Skill Name</Label>
                                    <Input {...form.register(`skills.${index}.name`)} placeholder="Skill (e.g. React)" />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10 shrink-0"
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
