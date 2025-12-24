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
    links: z.array(z.object({
        url: z.string().url("Invalid URL")
    })),
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
            links: resumeData?.links?.map(l => ({ url: l })) || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "links",
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
                links: resumeData.links?.map(l => ({ url: l })) || []
            };
            // Simplistic check - might need deep comparison if this causes loops
            if (JSON.stringify(newValues.name) !== JSON.stringify(currentValues.name) ||
                JSON.stringify(newValues.email) !== JSON.stringify(currentValues.email) ||
                JSON.stringify(newValues.address) !== JSON.stringify(currentValues.address) ||
                JSON.stringify(newValues.profile) !== JSON.stringify(currentValues.profile) ||
                JSON.stringify(newValues.links) !== JSON.stringify(currentValues.links)) {
                // Resetting only if actually changed to avoid typing interference, 
                // but for now simple reset is okay as long as data flow is unidirectional usually?
                // Actually this form updates store on change, so store updates trigger this.
                // We need to avoid loop.
                // JSON.stringify comparison is roughly okay for this size.
                if (JSON.stringify(newValues) !== JSON.stringify(currentValues)) {
                    form.reset(newValues);
                }
            }
        }
    }, [resumeData, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            if (!value) return;
            // Map back to flat structure for store
            const flatLinks = value.links?.map((l: any) => l.url) || [];

            // Create update object matching Partial<ResumeData> but we only have personal info here
            // and links.
            const updatePayload = {
                ...value,
                links: flatLinks
            };
            // Remove the internal structure before sending to store
            // The store expects ResumeData keys. 
            // value contains name, email, etc which are fine.
            // value.links is array of objects, we replaced it with string array.
            updateResumeData(updatePayload as any);
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
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ url: '' })}>
                                <Plus className="h-3 w-3 mr-1" /> Add Link
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-center">
                                    <div className="flex-1">
                                        <Input {...form.register(`links.${index}.url` as const)} placeholder="https://..." />
                                        {/* Error handling for array fields is tricky with types, checking safe navigation */}
                                        {form.formState.errors.links?.[index]?.url &&
                                            <p className="text-red-500 text-xs">{form.formState.errors.links[index]?.url?.message}</p>
                                        }
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
