"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResumeStore } from '@/lib/store';
import { useEffect } from 'react';

const personalInfoSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().optional(),
    summary: z.string().optional(),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export function PersonalInfoForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: resumeData?.personalInfo || {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            website: '',
            summary: '',
        },
    });

    // Update form when resumeData changes (e.g. after upload)
    // Update form when resumeData changes (e.g. after upload)
    useEffect(() => {
        if (resumeData?.personalInfo) {
            const currentValues = form.getValues();
            if (JSON.stringify(resumeData.personalInfo) !== JSON.stringify(currentValues)) {
                form.reset(resumeData.personalInfo);
            }
        }
    }, [resumeData, form]);

    const onSubmit = (data: PersonalInfoValues) => {
        updateResumeData({ personalInfo: data });
    };

    // Auto-save on blur or change? For now, let's just use onBlur helpers or a save button?
    // Ideally, it updates the store on change to reflect in preview.
    // We can watch valid values.

    useEffect(() => {
        const subscription = form.watch((value) => {
            // Cast to correct type because watch returns DeepPartial
            if (form.formState.isValid) {
                updateResumeData({ personalInfo: value as any }); // Simple type assertion for speed
            }
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData, form.formState.isValid]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" {...form.register("fullName")} />
                            {form.formState.errors.fullName && <p className="text-red-500 text-xs">{form.formState.errors.fullName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" {...form.register("email")} />
                            {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" {...form.register("phone")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" {...form.register("website")} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" {...form.register("address")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea id="summary" {...form.register("summary")} className="h-32" />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
