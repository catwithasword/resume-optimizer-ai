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
import { Plus, Trash2 } from 'lucide-react';

const personalInfoSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().optional(),
    address: z.string().optional(),
    profile: z.string().optional(),
    links: z.array(z.string().url("Invalid URL")),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export function PersonalInfoForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            name: resumeData?.name || '',
            email: resumeData?.email || '',
            phone_number: resumeData?.phone_number || '',
            address: resumeData?.address || '',
            profile: resumeData?.profile || '',
            links: resumeData?.links || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "links" as any, // React Hook Form types struggle with primitive arrays sometimes
    });

    useEffect(() => {
        if (resumeData) {
            const currentValues = form.getValues();
            const newValues = {
                name: resumeData.name,
                email: resumeData.email,
                phone_number: resumeData.phone_number,
                address: resumeData.address,
                profile: resumeData.profile,
                links: resumeData.links || []
            };
            if (JSON.stringify(newValues) !== JSON.stringify(currentValues)) {
                form.reset(newValues);
            }
        }
    }, [resumeData, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            updateResumeData(value as any);
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" {...form.register("name")} />
                            {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" {...form.register("email")} />
                            {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone_number">Phone</Label>
                            <Input id="phone_number" {...form.register("phone_number")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" {...form.register("address")} />
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Links</Label>
                            <Button type="button" variant="outline" size="sm" onClick={() => append('')}>
                                <Plus className="h-3 w-3 mr-1" /> Add Link
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-center">
                                    <div className="flex-1">
                                        <Input {...form.register(`links.${index}` as const)} placeholder="https://..." />
                                        {form.formState.errors.links?.[index] && <p className="text-red-500 text-xs">{form.formState.errors.links[index]?.message}</p>}
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive shrink-0">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="profile">Profile Summary</Label>
                        <Textarea id="profile" {...form.register("profile")} className="h-32" />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
