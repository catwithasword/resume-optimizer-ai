"use client";

import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeForm } from '@/components/resume-form';
import { ResumePreview } from '@/components/resume-preview';
import { AiOptimizer } from '@/components/ai-optimizer';
import { JobDescriptionInput } from '@/components/job-description-input';

export default function EditorPage() {
    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="px-6 h-14 flex items-center border-b shrink-0 bg-background z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div className="font-semibold flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground rounded-md p-1">
                            <Zap className="h-4 w-4" />
                        </div>
                        ResumeOptimizer <span className="text-muted-foreground font-normal">/ Editor</span>
                    </div>
                </div>

            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel: Editor */}
                <div className="w-1/2 flex flex-col border-r bg-muted/10">
                    <div className="p-4 overflow-y-auto h-full space-y-6 scrollbar-thin">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold">Resume Details</h2>
                            <p className="text-sm text-muted-foreground">Update your information below.</p>
                        </div>
                        <ResumeForm />
                    </div>
                </div>

                {/* Right Panel: Tools & Preview */}
                <div className="w-1/2 flex flex-col bg-muted/30">
                    <Tabs defaultValue="preview" className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-4 pt-2 border-b bg-background">
                            <TabsList>
                                <TabsTrigger value="preview">Live Preview</TabsTrigger>
                                <TabsTrigger value="optimize">AI Optimizer</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="preview" className="flex-1 m-0 p-4 overflow-hidden h-full">
                            <ResumePreview />
                        </TabsContent>

                        <TabsContent value="optimize" className="flex-1 m-0 p-4 overflow-y-auto h-full space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold">AI Optimization</h2>
                                <p className="text-sm text-muted-foreground">Tailor your resume for specific job roles.</p>
                            </div>
                            <JobDescriptionInput />
                            <AiOptimizer />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
