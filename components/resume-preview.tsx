"use client";

import { useResumeStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect } from 'react';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { HarvardTemplate } from './templates/harvard-template';
import { ModernTemplate } from './templates/modern-template';
import { MinimalTemplate } from './templates/minimal-template';

export function ResumePreview() {
    const resumeData = useResumeStore((state) => state.resumeData);
    const layout = useResumeStore((state) => state.layout);
    const updateLayout = useResumeStore((state) => state.updateLayout);
    const isOptimizing = useResumeStore((state) => state.isOptimizing);
    const contentRef = useRef<HTMLDivElement>(null);
    const [numPages, setNumPages] = useState<number>(1);

    const pageStyle = `
        @page {
            size: A4;
            margin: 0;
        }
        @media print {
            body {
                -webkit-print-color-adjust: exact;
            }
            /* Reset any conflicting styles */
            html, body {
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            .resume-document {
                transform: none !important;
            }
        }
    `;

    // Calculate number of pages based on content height
    useEffect(() => {
        if (!contentRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // A4 height in pixels (96 DPI) is approx 1122.5px
                const a4HeightPx = 1122.5;
                const contentHeight = entry.contentRect.height;
                // At least 1 page, round up
                const pages = Math.ceil(contentHeight / a4HeightPx) || 1;
                setNumPages(pages);
            }
        });

        observer.observe(contentRef.current);
        return () => observer.disconnect();
    }, [layout.selectedTemplate, layout.fontScale, layout.lineHeight, layout.margin]); // Re-calculate on layout changes

    const reactToPrintFn = useReactToPrint({
        contentRef,
        documentTitle: `Resume - ${resumeData?.name || 'Draft'}`,
        pageStyle: pageStyle,
    });

    if (!resumeData) {
        return (
            <Card className="h-full flex items-center justify-center p-8 text-muted-foreground bg-muted/30 border-dashed">
                <p>Resume preview will appear here</p>
            </Card>
        );
    }

    const renderTemplate = () => {
        switch (layout.selectedTemplate) {
            case 'modern':
                return <ModernTemplate resumeData={resumeData} layout={layout} />;
            case 'minimal':
                return <MinimalTemplate resumeData={resumeData} layout={layout} />;
            case 'harvard':
            default:
                return <HarvardTemplate resumeData={resumeData} layout={layout} />;
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <div className="p-4 border-b space-y-4 bg-muted/30">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Live Preview</h3>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => reactToPrintFn()}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                    </div>
                </div>

                {/* Layout Controls */}
                <div className="space-y-4 text-sm">
                    {/* Row 1: Template Selector */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Template</Label>
                            <Select
                                value={layout.selectedTemplate}
                                onValueChange={(val) => updateLayout({ selectedTemplate: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="harvard">Harvard (Classic)</SelectItem>
                                    <SelectItem value="modern">Modern (Sidebar)</SelectItem>
                                    <SelectItem value="minimal">Minimal (Clean)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 2: Layout Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Font Size: {layout?.fontScale || 100}%</Label>
                            </div>
                            <Slider
                                value={[layout?.fontScale || 100]}
                                min={70}
                                max={130}
                                step={5}
                                onValueChange={(val: number[]) => updateLayout({ fontScale: val[0] })}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Line Spacing: {layout?.lineHeight || 1.2}</Label>
                            </div>
                            <Slider
                                value={[layout?.lineHeight || 1.2]}
                                min={1.0}
                                max={2.0}
                                step={0.1}
                                onValueChange={(val: number[]) => updateLayout({ lineHeight: val[0] })}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Margin: {layout?.margin || 15}mm</Label>
                            </div>
                            <Slider
                                value={[layout?.margin || 15]}
                                min={5}
                                max={30}
                                step={1}
                                onValueChange={(val: number[]) => updateLayout({ margin: val[0] })}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Zoom: {layout?.zoom || 100}%</Label>
                            </div>
                            <Slider
                                value={[layout?.zoom || 100]}
                                min={50}
                                max={150}
                                step={10}
                                onValueChange={(val: number[]) => updateLayout({ zoom: val[0] })}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-16 bg-gray-100 dark:bg-gray-900 flex justify-center items-start relative">
                {isOptimizing && (
                    <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm font-medium text-primary">Optimizing Resume...</p>
                        </div>
                    </div>
                )}
                <style type="text/css" media="print">
                    {pageStyle}
                </style>
                {/* Sale scaling wrapper */}
                <div
                    style={{
                        transform: `scale(${(layout?.zoom || 100) / 100})`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.2s ease-in-out',
                        position: 'relative'
                    }}
                >
                    {/* Background Pages Layer */}
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center print:hidden z-0">
                        {Array.from({ length: Math.max(numPages, 1) }).map((_, i) => (
                            <div
                                key={i}
                                className="w-[210mm] h-[297mm] bg-white shadow-2xl relative"
                            >
                                {/* Page Break Marker (except for last page) */}
                                {i < numPages - 1 && (
                                    <div className="absolute bottom-0 w-full border-b-2 border-dashed border-gray-300 print:hidden">
                                        <span className="absolute right-2 bottom-1 text-[10px] text-gray-400 font-sans">
                                            Page Break
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Template Content */}
                    <div ref={contentRef}>
                        {renderTemplate()}
                    </div>
                </div>
            </div>
        </Card>
    );
}
