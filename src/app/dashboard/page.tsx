
'use client';

import { useState, useTransition, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { resumeRevamp } from '@/ai/flows/resume-revamp';
import { optimizeResumeForJob } from '@/ai/flows/job-specific-optimization';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2, UploadCloud, CheckCircle2, Wand2, Briefcase, FileSearch } from 'lucide-react';
import Header from '@/components/Header';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import Footer from '@/components/Footer';
import { ResumeRevampOutput } from '@/ai/schemas';
import { Label } from '@/components/ui/label';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function DashboardPage() {
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [resumeFileName, setResumeFileName] = useState('');
  const [jobDescriptionFileName, setJobDescriptionFileName] = useState('');

  const [resumeUploadProgress, setResumeUploadProgress] = useState<number | null>(null);
  const [resumeUploadStatus, setResumeUploadStatus] = useState('');
  const [jdUploadProgress, setJdUploadProgress] = useState<number | null>(null);
  const [jdUploadStatus, setJdUploadStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [processingMessage, setProcessingMessage] = useState('');
  
  const [isProcessing, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const jobDescFileInputRef = useRef<HTMLInputElement>(null);
  
  const simulateProgress = (setter: React.Dispatch<React.SetStateAction<number | null>>) => {
    let progress = 0;
    setter(progress);
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 10;
      if (progress >= 90) {
        clearInterval(interval);
      } else {
        setter(progress);
      }
    }, 200);
    return interval;
  };

  const handleResumeUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeFileName(file.name);
    setResumeContent('');
    setResumeUploadStatus('');

    const progressInterval = simulateProgress(setResumeUploadProgress);

    startTransition(async () => {
      try {
        let text = '';
        if (file.type === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(' ');
          }
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          text = result.value;
        } else if (file.type === 'text/plain') {
          text = await file.text();
        } else {
          clearInterval(progressInterval);
          setResumeUploadProgress(null);
          toast({
            variant: 'destructive',
            title: 'Unsupported File Type',
            description: 'Please upload a PDF, DOCX, or TXT file.',
          });
          setResumeFileName('');
          return;
        }

        clearInterval(progressInterval);
        setResumeUploadProgress(100);
        setResumeContent(text);
        setResumeUploadStatus('Resume content extracted successfully!');

      } catch (error) {
        clearInterval(progressInterval);
        setResumeUploadProgress(null);
        console.error('Error processing file:', error);
        setResumeFileName('');
        toast({
          variant: 'destructive',
          title: 'Error Processing File',
          description: 'Could not extract text from the uploaded file.',
        });
      }
    });
  };

  const handleJobDescriptionUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setJobDescriptionFileName(file.name);
    setJobDescription('');
    setJdUploadStatus('');

    const progressInterval = simulateProgress(setJdUploadProgress);
    
    startTransition(async () => {
        try {
            let text = '';
            if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map((item: any) => item.str).join(' ');
                }
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                text = result.value;
            } else if (file.type === 'text/plain') {
                text = await file.text();
            } else {
                clearInterval(progressInterval);
                setJdUploadProgress(null);
                toast({ variant: 'destructive', title: 'Unsupported File Type', description: 'Please upload a PDF, DOCX, or TXT file.'});
                setJobDescriptionFileName('');
                return;
            }
            clearInterval(progressInterval);
            setJdUploadProgress(100);
            setJobDescription(text);
            setJdUploadStatus('Job description extracted successfully!');
        } catch (error) {
            clearInterval(progressInterval);
            setJdUploadProgress(null);
            console.error('Error processing file:', error);
            setJobDescriptionFileName('');
            toast({ variant: 'destructive', title: 'Error Processing File', description: 'Could not extract text from the uploaded file.'});
        }
    });
  }

  const goToEditor = (resumeData: ResumeRevampOutput) => {
    if (!resumeData) return;
    try {
        sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
        router.push('/dashboard/editor');
    } catch (error) {
        console.error("Failed to save to sessionStorage", error);
        toast({
            variant: 'destructive',
            title: "Error preparing editor",
            description: "Could not save resume data. Your file might be too large for this browser session. Please try a smaller file."
        });
    }
  }

  const handlePreview = () => {
    if (!resumeContent.trim()) {
      toast({ variant: 'destructive', title: 'Resume is empty', description: 'Please upload your resume to get started.' });
      return;
    }

    startTransition(async () => {
      try {
        let finalResume: ResumeRevampOutput;

        setProcessingMessage('Revamping Resume... The AI is working its magic.');
        const revampedResume = await resumeRevamp({ resumeData: resumeContent });
        
        if (jobDescription.trim()) {
            setProcessingMessage('Optimizing for Job... Tailoring the resume for the specific role.');
            finalResume = await optimizeResumeForJob({ resume: revampedResume, jobDescription });
        } else {
            finalResume = revampedResume;
        }

        setProcessingMessage('');
        setSuccessMessage('Your resume is ready. Forwarding to editor...');
        goToEditor(finalResume);

      } catch (e: any) {
        setProcessingMessage('');
        toast({ variant: 'destructive', title: 'Error Processing Resume', description: e.message });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Column 1: Upload */}
          <Card className="glass-card col-span-1">
            <CardHeader>
              <CardTitle className="font-headline text-xl md:text-2xl flex items-center">
                <FileText className="mr-2 text-primary" /> 1. Provide Your Information
              </CardTitle>
              <CardDescription className="text-sm">
                Upload your resume and job description (DOCX, PDF, or TXT).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume-upload" className="font-bold">Upload Resume</Label>
                <p className="text-sm text-muted-foreground">
                  This is the first step to getting your resume revamped by our AI.
                </p>
                <Input
                  id="resume-upload"
                  type="file"
                  className="hidden"
                  ref={resumeFileInputRef}
                  onChange={handleResumeUpload}
                  accept=".pdf,.docx,.txt"
                  disabled={isProcessing}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => resumeFileInputRef.current?.click()}
                  disabled={isProcessing && resumeUploadProgress !== null}
                >
                  {isProcessing && resumeUploadProgress !== null ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                  {isProcessing && resumeUploadProgress !== null ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>

              {resumeUploadProgress !== null && (
                <div className="space-y-2">
                  <Progress value={resumeUploadProgress} />
                   {resumeFileName && <p className="text-sm text-center text-muted-foreground truncate pt-1">{resumeFileName}</p>}
                </div>
              )}
              
              {resumeUploadProgress === 100 && resumeUploadStatus && (
                <div className="flex items-center justify-center text-sm text-green-600 space-x-2 pt-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <p>{resumeUploadStatus}</p>
                </div>
              )}
              
              <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Optional
                      </span>
                  </div>
              </div>
              
              <div className="space-y-2 pt-2">
                  <Label htmlFor="job-description-upload" className="font-bold flex items-center"><Briefcase className="mr-2 h-4 w-4"/> Upload Job Description</Label>
                  <p className="text-sm text-muted-foreground">
                    This will help our AI tailor your resume for a specific role.
                  </p>
                   <Input
                    id="job-description-upload"
                    type="file"
                    className="hidden"
                    ref={jobDescFileInputRef}
                    onChange={handleJobDescriptionUpload}
                    accept=".pdf,.docx,.txt"
                    disabled={isProcessing}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => jobDescFileInputRef.current?.click()}
                    disabled={isProcessing && jdUploadProgress !== null}
                  >
                    {isProcessing && jdUploadProgress !== null ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                    {isProcessing && jdUploadProgress !== null ? 'Uploading...' : 'Upload File'}
                  </Button>
              </div>

              {jdUploadProgress !== null && (
                <div className="space-y-2">
                  <Progress value={jdUploadProgress} />
                   {jobDescriptionFileName && <p className="text-sm text-center text-muted-foreground truncate pt-1">{jobDescriptionFileName}</p>}
                </div>
              )}

              {jdUploadProgress === 100 && jdUploadStatus && (
                <div className="flex items-center justify-center text-sm text-green-600 space-x-2 pt-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <p>{jdUploadStatus}</p>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Column 2: Tools */}
          <Card className="glass-card col-span-1">
            <CardHeader>
              <CardTitle className="font-headline text-xl md:text-2xl flex items-center">
                <Wand2 className="mr-2 text-primary"/> 2. Generate Your Resume
              </CardTitle>
              <CardDescription className="text-sm">
                Click the button below to process your documents and see the result in our editor.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <Button onClick={handlePreview} disabled={!resumeContent || isProcessing} className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                  {isProcessing ? <Loader2 className="animate-spin" /> : <FileSearch />}
                  Edit | Preview
                </Button>
                 {isProcessing && processingMessage && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground space-x-2 pt-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p>{processingMessage}</p>
                    </div>
                )}
                 {successMessage && !isProcessing && (
                    <div className="flex items-center justify-center text-sm text-green-600 space-x-2 pt-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <p>{successMessage}</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );

}
