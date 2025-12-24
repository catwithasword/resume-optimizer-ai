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

const referencesSchema = z.object({
    references: z.array(z.object({
        name: z.string().min(1, "Reference is required")
    }))
});

type ReferencesValues = z.infer<typeof referencesSchema>;

export function ReferencesForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    const form = useForm<ReferencesValues>({
        resolver: zodResolver(referencesSchema),
        defaultValues: {
            references: resumeData?.references?.map(r => ({ name: r })) || []
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "references",
    });

    useEffect(() => {
        if (resumeData?.references) {
            const current = form.getValues().references;
            const newVal = resumeData.references.map(r => ({ name: r }));
            if (JSON.stringify(newVal) !== JSON.stringify(current)) {
                form.setValue("references", newVal);
            }
        }
    }, [resumeData?.references, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            if (!value.references) return;
            const formatted = value.references.map((r: any) => r.name);
            updateResumeData({ references: formatted });
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>References</CardTitle>
                <Button size="sm" onClick={() => append({ name: '' })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Reference
                </Button>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="space-y-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <Input {...form.register(`references.${index}.name` as const)} placeholder="Name - Title - Contact" />
                                    {form.formState.errors.references?.[index]?.name &&
                                        <p className="text-red-500 text-xs">{form.formState.errors.references[index]?.name?.message}</p>
                                    }
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive shrink-0">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    {fields.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No references added yet.</p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
