"use client";

import { useState } from 'react';
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
    const [isOptimizing, setIsOptimizing] = useState(false);

    const handleOptimize = async () => {
        if (!resumeData || !jobDescription) return;

        setIsOptimizing(true);
        try {
            const result = await api.optimizeResume(resumeData, jobDescription);
            setOptimizationResult(result);
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
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Optimization Score</h4>
                                <Badge variant={optimizationResult.score > 80 ? "default" : "secondary"} className="text-lg px-3 py-1">
                                    {optimizationResult.score}/100
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Suggestions</h4>
                                <ul className="space-y-2">
                                    {optimizationResult.suggestions.map((suggestion, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                            <span>{suggestion}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {optimizationResult.improvedSummary && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Improved Summary</h4>
                                    <div className="bg-muted p-3 rounded-md text-sm italic">
                                        "{optimizationResult.improvedSummary}"
                                    </div>
                                </div>
                            )}

                            <Button onClick={handleOptimize} variant="outline" className="w-full mt-2">
                                Re-optimize
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
