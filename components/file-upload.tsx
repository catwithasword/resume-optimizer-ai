"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, File as FileIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useResumeStore } from '@/lib/store';
// import { useToast } from '@/hooks/use-toast'; // Assuming shadcn toast

import { useRouter } from 'next/navigation';

interface FileUploadProps {
    className?: string;
}

export function FileUpload({ className }: FileUploadProps) {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const setResumeData = useResumeStore((state) => state.setResumeData);
    // const { toast } = useToast(); // We haven't installed toast yet, I'll skip toast for now or basic alert

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const data = await api.uploadResume(file);
            setResumeData(data);
            // toast({ title: "Success", description: "Resume uploaded and parsed successfully." });
            router.push('/editor');
        } catch (error) {
            console.error(error);
            // toast({ title: "Error", description: "Failed to upload resume.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    }, [setResumeData, router]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 1,
    });

    return (
        <Card
            {...getRootProps()}
            className={cn(
                "border-2 border-dashed p-16 cursor-pointer hover:bg-muted/50 transition-colors flex flex-col items-center justify-center text-center min-h-[16rem]",
                isDragActive && "border-primary bg-muted",
                className
            )}
        >
            <input {...getInputProps()} />
            {isUploading ? (
                <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Analyzing resume...</p>
                </div>
            ) : (
                <>
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <CloudUpload className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">
                        {isDragActive ? "Drop your resume here" : "Upload your resume"}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Drag & drop your PDF or Image resume, or click to browse.
                    </p>
                </>
            )}
        </Card>
    );
}
