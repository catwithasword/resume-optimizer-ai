"use client";

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResumeStore } from '@/lib/store';

export function JobDescriptionInput() {
    const jobDescription = useResumeStore((state) => state.jobDescription);
    const setJobDescription = useResumeStore((state) => state.setJobDescription);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="jd">Paste the job description here to optimize your resume</Label>
                    <Textarea
                        id="jd"
                        placeholder="e.g. We are looking for a Senior React Developer..."
                        className="min-h-[150px]"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
