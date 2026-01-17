"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';
import { CheckCircle } from 'lucide-react';
import { SiReactiveresume } from "react-icons/si";
import { useResumeStore } from '@/lib/store';
import { hasResumeData } from '@/lib/utils';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const resumeData = useResumeStore((state) => state.resumeData);
  const setResumeData = useResumeStore((state) => state.setResumeData);

  const handleCreateFromScratch = () => {
    setResumeData({
      name: '',
      address: '',
      phone_number: '',
      email: '',
      links: [],
      profile: '',
      education: [],
      experience: [],
      skills: [],
      achievements_awards: [],
      certificates_and_training: [],
      extracurricular_or_volunteer_experience: [],
      references: [],
      etc: []
    });
    router.push('/editor');
  };

  const showContinueEditing = hasResumeData(resumeData);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-16 flex items-center border-b">
        <div className="font-bold text-xl flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-md p-1">
            <SiReactiveresume className="h-5 w-5" />
          </div>
          Resume Optimizer
        </div>
        <nav className="ml-auto flex gap-4">
          {showContinueEditing && (
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
            {showContinueEditing ? (
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

            <div className={showContinueEditing ? "opacity-50 hover:opacity-100 transition-opacity" : ""}>
              <div className="space-y-4">
                <p className="font-semibold">{showContinueEditing ? "Or start over" : "Get Started"}</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileUpload className="w-full" />
                  </div>
                  <div className="border rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 transition-colors shadow-sm">
                    <p className="font-medium">No resume?</p>
                    <Button onClick={handleCreateFromScratch} variant="outline" className="w-full">
                      Create from Scratch
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Supported formats: PDF, JPG, PNG
            </p>
          </div>
        </section>


      </main>

      <footer className="py-8 px-6 border-t text-center text-muted-foreground">
        &copy; {new Date().getFullYear()} Resume Optimizer. All rights reserved.
      </footer>
    </div>
  );
}
