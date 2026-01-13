"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResumeStore } from '@/lib/store';
import { useEffect } from 'react';

const etcSchema = z.object({
    etc: z.string(),
});

type EtcValues = z.infer<typeof etcSchema>;

export function EtcForm() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const updateResumeData = useResumeStore((state) => state.updateResumeData);

    const form = useForm<EtcValues>({
        resolver: zodResolver(etcSchema),
        defaultValues: { etc: resumeData?.etc?.join('\n') || '' },
    });

    useEffect(() => {
        const currentContent = form.getValues().etc;
        const storeContent = resumeData?.etc?.join('\n') || '';
        if (currentContent !== storeContent) {
            form.reset({ etc: storeContent });
        }
    }, [resumeData?.etc, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            const lines = value.etc?.split('\n').filter(line => line.trim() !== '') || [];
            updateResumeData({ etc: lines });
        });
        return () => subscription.unsubscribe();
    }, [form.watch, updateResumeData]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>ETC.</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <Textarea
                        {...form.register("etc")}
                        className="min-h-[200px]"
                    />
                </form>
            </CardContent>
        </Card>
    );
}
