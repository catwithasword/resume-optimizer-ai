"use client";


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useResumeStore } from '@/lib/store';
import { api } from '@/lib/api';

export function AiOptimizer() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const jobDescription = useResumeStore((state) => state.jobDescription);
    const optimizationResult = useResumeStore((state) => state.optimizationResult);
    const setOptimizationResult = useResumeStore((state) => state.setOptimizationResult);
    const isOptimizing = useResumeStore((state) => state.isOptimizing);
    const setIsOptimizing = useResumeStore((state) => state.setIsOptimizing);

    const setResumeData = useResumeStore((state) => state.setResumeData);

    const handleOptimize = async () => {
        if (!resumeData || !jobDescription) return;

        setIsOptimizing(true);
        try {
            const updatedResume = await api.optimizeResume(resumeData, jobDescription);
            setResumeData(updatedResume);
            // We use optimizationResult just to show success state for now
            // In a real refactor we might want to change this state variable name or logic
            setOptimizationResult({ score: 100, suggestions: [], improvedSummary: "Optimized" });
        } catch (error) {
            console.error(error);
        } finally {
            setIsOptimizing(false);
        }
    };

    if (!resumeData) return null;

    return (
        <div className="space-y-4">
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI Optimization
                    </CardTitle>
                    <CardDescription>
                        Analyze your resume against the job description to get tailored suggestions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!optimizationResult ? (
                        <>
                            <div className="space-y-4">
                                <Button
                                    onClick={handleOptimize}
                                    disabled={isOptimizing || !jobDescription}
                                    className="w-full"
                                >
                                    {isOptimizing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Optimizing...
                                        </>
                                    ) : (
                                        "Optimize Resume"
                                    )}
                                </Button>
                                <p className="text-xs text-muted-foreground text-center">
                                    This will update your resume content to better match the job description.
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-green-600 justify-center p-4 bg-green-50 rounded-lg">
                                <CheckCircle2 className="h-6 w-6" />
                                <span className="font-semibold">Resume Optimized Successfully!</span>
                            </div>

                            <p className="text-sm text-center text-muted-foreground">
                                Your resume has been updated with tailored content based on the job description.
                            </p>

                            <Button
                                onClick={handleOptimize}
                                variant="outline"
                                className="w-full mt-2"
                                disabled={isOptimizing}
                            >
                                {isOptimizing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Optimizing...
                                    </>
                                ) : (
                                    "Re-optimize"
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
