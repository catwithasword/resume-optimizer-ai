"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';
import { CheckCircle, Zap } from 'lucide-react';
import { useResumeStore } from '@/lib/store';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const resumeData = useResumeStore((state) => state.resumeData);

  // If resume data is set (after upload), redirect to editor
  // useEffect(() => {
  //   if (resumeData) {
  //     router.push('/editor');
  //   }
  // }, [resumeData, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-16 flex items-center border-b">
        <div className="font-bold text-xl flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-md p-1">
            <Zap className="h-5 w-5" />
          </div>
          ResumeOptimizer
        </div>
        <nav className="ml-auto flex gap-4">
          {resumeData && (
            <Button variant="ghost" asChild>
              <Link href="/editor">Continue Editing</Link>
            </Button>
          )}

        </nav>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-balance">
            Optimize Your Resume for <span className="text-primary">Every Application</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto">
            Upload your resume, analyze it against job descriptions, and get AI-powered suggestions to land your dream job.
          </p>

          <div className="max-w-xl mx-auto mt-12 space-y-4">
            {resumeData ? (
              <div className="bg-muted p-6 rounded-lg border flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <CheckCircle className="h-5 w-5" />
                  Resume Loaded
                </div>
                <p className="text-sm text-foreground/80">
                  You have a resume loaded. You can continue editing or upload a new one to replace it.
                </p>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/editor">Continue Editing</Link>
                  </Button>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Reset
                  </Button>
                </div>
              </div>
            ) : null}

            <div className={resumeData ? "opacity-50 hover:opacity-100 transition-opacity" : ""}>
              <p className="font-semibold mb-2">{resumeData ? "Or upload a new resume" : ""}</p>
              <FileUpload className="bg-background shadow-lg" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Supported formats: PDF, JPG, PNG
            </p>
          </div>
        </section>


      </main>

      <footer className="py-8 px-6 border-t text-center text-muted-foreground">
        &copy; 2025 ResumeOptimizer. All rights reserved.
      </footer>
    </div>
  );
}
