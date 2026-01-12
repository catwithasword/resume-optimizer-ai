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

const certificatesSchema = z.object({
    certificates: z.array(z.object({
        name: z.string().min(1, "Name is required"),
        issuer: z.string().min(1, "Issuer is required"),
        date: z.string().min(1, "Date is required"),
        url: z.string().optional(),
    }))
});

type CertificatesValues = z.infer<typeof certificatesSchema>;

export function CertificatesForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    const parseCertificate = (certStr: string) => {
        // "Name – Issuer (Date)"
        // User provided: "Full Stack Web Development Certificate – Online Learning Platform (2022)"

        const parts = certStr.split(' – ');
        const name = parts[0] || '';

        let issuerAndDate = parts.slice(1).join(' – ');
        const dateMatch = issuerAndDate.match(/\((.*?)\)$/);
        const date = dateMatch ? dateMatch[1] : '';
        const issuer = dateMatch ? issuerAndDate.replace(dateMatch![0], '').trim() : issuerAndDate;

        return {
            name,
            issuer,
            date,
            url: '' // URL usually lost in string format unless we stash it or assume it isn't there
        };
    };

    const formatCertificate = (cert: any) => {
        // "Name – Issuer (Date)"
        let res = cert.name;
        if (cert.issuer) res += ` – ${cert.issuer}`;
        if (cert.date) res += ` (${cert.date})`;
        return res;
    };

    const form = useForm<CertificatesValues>({
        resolver: zodResolver(certificatesSchema),
        defaultValues: { certificates: resumeData?.certificates_and_training?.map(parseCertificate) || [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "certificates",
    });

    useEffect(() => {
        if (resumeData?.certificates_and_training) {
            // Sync logic omitted
        }
    }, [resumeData?.certificates_and_training]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            const formatted = value.certificates?.map(formatCertificate) || [];
            updateResumeData({ certificates_and_training: formatted });
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Certificates & Training</CardTitle>
                <Button size="sm" onClick={() => append({ name: '', issuer: '', date: '' })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Certificate
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
                                    <Label>Certificate Name</Label>
                                    <Input {...form.register(`certificates.${index}.name`)} placeholder="e.g. AWS Certified" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Issuer</Label>
                                    <Input {...form.register(`certificates.${index}.issuer`)} placeholder="e.g. Amazon" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input {...form.register(`certificates.${index}.date`)} placeholder="e.g. 2023" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No certificates added yet.</p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
