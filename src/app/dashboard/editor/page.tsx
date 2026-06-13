

'use client';

import { useState, useTransition, useRef, useEffect, Suspense, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Trash2, CalendarIcon, PlusCircle, Crown, Eye, Download, Edit, FileText, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { Switch } from '@/components/ui/switch';
import type { ResumeRevampOutput } from '@/ai/schemas';
import Footer from '@/components/Footer';
import ResumePreview from '@/components/ResumePreview';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


type Template = 'academic' | 'classic' | 'creative' | 'entry-level' | 'executive' | 'infographic' | 'minimalist' | 'modern' | 'portfolio' | 'professional' | 'technical' | 'two-column';

const templateOptions: { value: Template, label: string }[] = [
    { value: 'academic', label: 'Academic' },
    { value: 'classic', label: 'Classic' },
    { value: 'creative', label: 'Creative' },
    { value: 'entry-level', label: 'Entry-Level' },
    { value: 'executive', label: 'Executive' },
    { value: 'infographic', label: 'Infographic' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'modern', label: 'Modern' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'professional', label: 'Professional' },
    { value: 'technical', label: 'Technical' },
    { value: 'two-column', label: 'Two Column' },
];

const initialResumeData: ResumeRevampOutput = {
    personalInfo: { name: '', address: '', phone: '', email: '', linkedin: '', profilePicture: '' },
    professionalSummary: '',
    skills: '',
    education: [],
    workExperience: [],
};

const ComparisonView = ({ original, modified, title }: { original?: string; modified: string; title: string }) => {
  if (!original) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
      <h4 className="font-semibold text-sm">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-muted-foreground">Original Version</Label>
          <Textarea
            value={original}
            readOnly
            className="mt-1 h-32 text-xs bg-background/50 pointer-events-none"
          />
        </div>
        <div>
          <Label className="text-xs text-green-600">AI Suggested Version</Label>
          <Textarea
            value={modified}
            readOnly
            className="mt-1 h-32 text-xs border-green-200 focus-visible:ring-green-400 bg-background/50 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};


function EditorComponent() {
  const [resumeData, setResumeData] = useState<ResumeRevampOutput>(initialResumeData);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [isDownloading, setIsDownloading] = useState(false);


  const [compareChanges, setCompareChanges] = useState(false);

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768) {
            setDirection('vertical');
        } else {
            setDirection('horizontal');
        }
    };
    
    handleResize(); // Set initial direction
    window.addEventListener('resize', handleResize);
    
    setIsClient(true);
    const initialResumeJson = sessionStorage.getItem('resumeData');
    if (initialResumeJson) {
      try {
        const parsedData = JSON.parse(initialResumeJson);
        setResumeData(parsedData);
        if (parsedData.originalProfessionalSummary || parsedData.workExperience.some((exp: any) => exp.originalResponsibilities)) {
            setCompareChanges(true);
        }
      } catch (error) {
        console.error("Failed to parse Resume data from sessionStorage", error);
        toast({
            variant: 'destructive',
            title: "Error loading Resume",
            description: "There was a problem loading your Resume data. Please go back and try again."
        })
      }
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [toast]);
  
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('modern');
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const hasChanges = useMemo(() => {
    return !!(resumeData?.originalProfessionalSummary || resumeData?.workExperience.some(exp => exp.originalResponsibilities));
  }, [resumeData]);

  const handleProfilePictureChange = (dataUri: string) => {
    setResumeData(prevData => ({
        ...prevData,
        personalInfo: {
            ...prevData.personalInfo,
            profilePicture: dataUri
        }
    }));
  };

  const handleInputChange = (section: keyof ResumeRevampOutput, value: any, index?: number, field?: string) => {
    setResumeData(prevData => {
        const newData = { ...prevData };
        if (index !== undefined && field) {
            const sectionData = [...(newData[section] as any[])];
            sectionData[index] = { ...sectionData[index], [field]: value };
            
            if (section === 'workExperience' && field === 'isCurrentJob') {
                if (value === true) {
                    sectionData[index].endDate = null;
                } else {
                     sectionData[index].endDate = new Date().toISOString().split('T')[0];
                }
            }
            
            (newData[section] as any) = sectionData;
        } else {
            (newData[section] as any) = value;
        }
        return newData;
    });
  };

  const handleAddItem = (section: 'education' | 'workExperience') => {
      let newItem: any;
      if (section === 'education') newItem = { school: '', degree: '', year: '' };
      if (section === 'workExperience') newItem = { company: '', role: '', startDate: new Date().toISOString().split('T')[0], endDate: null, isCurrentJob: false, responsibilities: ''};
      
      setResumeData(prev => ({
          ...prev,
          [section]: [...(prev[section] as any[]), newItem]
      }));
  }

  const handleRemoveItem = (section: 'education' | 'workExperience', index: number) => {
      setResumeData(prev => ({
          ...prev,
          [section]: (prev[section] as any[]).filter((_, i) => i !== index)
      }));
  }

  const handleDownloadPdf = async () => {
    const element = previewRef.current;
    if (!element) {
      toast({
        variant: 'destructive',
        title: 'Resume is empty',
        description: 'There is no content to download.',
      });
      return;
    }

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;

      const imgWidth = pdfWidth;
      const imgHeight = imgWidth / ratio;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      const fileName = `Resume-${resumeData.personalInfo.name.replace(/ /g, '-') || 'Untitled'}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "PDF Generation Failed",
        description: "An unexpected error occurred while creating the PDF."
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const editorPanel = (
    <div className="flex flex-col h-full">
        <div className="p-4 md:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardHeader className="p-0">
            <CardTitle className="font-headline text-xl md:text-2xl flex items-center">
                <Wand2 className="mr-2 text-primary"/> Edit Your Resume
            </CardTitle>
            <CardDescription>
                Review and edit the AI-generated Resume.
            </CardDescription>
            </CardHeader>
             {hasChanges && (
                <div className="flex items-center space-x-2">
                    <Switch
                        id="compare-switch"
                        checked={compareChanges}
                        onCheckedChange={setCompareChanges}
                    />
                    <Label htmlFor="compare-switch" className="flex items-center gap-2"><Eye className="w-4 h-4" /> Compare Changes</Label>
                </div>
            )}
        </div>
        <ScrollArea className="flex-1">
            <div className="p-4 md:p-6 space-y-6">
              <Card>
                  <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2"><Label>Full Name</Label><Input value={resumeData.personalInfo.name} onChange={e => handleInputChange('personalInfo', { ...resumeData.personalInfo, name: e.target.value })} /></div>
                      <div className="space-y-2"><Label>Email</Label><Input value={resumeData.personalInfo.email} onChange={e => handleInputChange('personalInfo', { ...resumeData.personalInfo, email: e.target.value })} /></div>
                      <div className="space-y-2"><Label>Phone</Label><Input value={resumeData.personalInfo.phone} onChange={e => handleInputChange('personalInfo', { ...resumeData.personalInfo, phone: e.target.value })} /></div>
                      <div className="space-y-2"><Label>Address</Label><Input value={resumeData.personalInfo.address} onChange={e => handleInputChange('personalInfo', { ...resumeData.personalInfo, address: e.target.value })} /></div>
                      <div className="space-y-2"><Label>LinkedIn Profile</Label><Input value={resumeData.personalInfo.linkedin || ''} onChange={e => handleInputChange('personalInfo', { ...resumeData.personalInfo, linkedin: e.target.value })} /></div>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader><CardTitle>Professional Summary</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                      {compareChanges && <ComparisonView title="Summary Comparison" original={resumeData.originalProfessionalSummary} modified={resumeData.professionalSummary} />}
                      <Textarea 
                        value={resumeData.professionalSummary} 
                        onChange={e => handleInputChange('professionalSummary', e.target.value)} 
                        rows={5}
                        disabled={compareChanges}
                        />
                  </CardContent>
              </Card>
              
              <Card>
                  <CardHeader>
                      <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <Textarea 
                          value={resumeData.skills} 
                          onChange={e => handleInputChange('skills', e.target.value)} 
                          rows={4}
                          placeholder="Enter skills, separated by commas..."
                          className="text-sm bg-background"
                      />
                  </CardContent>
              </Card>
              
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Work Experience</CardTitle>
                      <Button size="sm" variant="outline" onClick={() => handleAddItem('workExperience')}><PlusCircle className="mr-2"/>Add</Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {resumeData.workExperience.map((exp, index) => (
                          <div key={index} className="p-4 border rounded-lg space-y-3 relative bg-muted/20">
                              <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => handleRemoveItem('workExperience', index)}><Trash2 className="h-4 w-4 text-muted-foreground"/></Button>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Company</Label><Input value={exp.company} onChange={e => handleInputChange('workExperience', e.target.value, index, 'company')} /></div>
                                <div className="space-y-2"><Label>Role</Label><Input value={exp.role} onChange={e => handleInputChange('workExperience', e.target.value, index, 'role')} /></div>
                              </div>
                               <div className="flex items-center space-x-2 pt-2">
                                    <Switch
                                        id={`current-job-${index}`}
                                        checked={exp.isCurrentJob}
                                        onCheckedChange={(checked) => handleInputChange('workExperience', checked, index, 'isCurrentJob')}
                                    />
                                    <Label htmlFor={`current-job-${index}`}>I currently work here</Label>
                                </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !exp.startDate && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {exp.startDate ? format(new Date(exp.startDate), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={exp.startDate ? new Date(exp.startDate) : undefined} onSelect={(date) => handleInputChange('workExperience', date?.toISOString().split('T')[0], index, 'startDate')} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    {exp.isCurrentJob ? (
                                        <Input value="Present" disabled />
                                    ) : (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !exp.endDate && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {exp.endDate ? format(new Date(exp.endDate), "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar mode="single" selected={exp.endDate ? new Date(exp.endDate) : undefined} onSelect={(date) => handleInputChange('workExperience', date?.toISOString().split('T')[0], index, 'endDate')} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Responsibilities</Label>
                                 {compareChanges && <ComparisonView title="Responsibilities Comparison" original={exp.originalResponsibilities} modified={exp.responsibilities} />}
                                <Textarea 
                                    value={exp.responsibilities} 
                                    onChange={e => handleInputChange('workExperience', e.target.value, index, 'responsibilities')} 
                                    rows={6}
                                    placeholder="List responsibilities, one per line..."
                                    className="text-sm bg-background"
                                    disabled={compareChanges && !!exp.originalResponsibilities}
                                />
                              </div>
                          </div>
                      ))}
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Education</CardTitle>
                      <Button size="sm" variant="outline" onClick={() => handleAddItem('education')}><PlusCircle className="mr-2" />Add</Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {resumeData.education.map((edu, index) => (
                          <div key={index} className="p-4 border rounded-lg space-y-3 relative bg-muted/20">
                              <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => handleRemoveItem('education', index)}><Trash2 className="h-4 w-4 text-muted-foreground"/></Button>
                              <div className="space-y-2"><Label>School/Institution</Label><Input value={edu.school} onChange={e => handleInputChange('education', e.target.value, index, 'school')} /></div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Degree/Certificate</Label><Input value={edu.degree} onChange={e => handleInputChange('education', e.target.value, index, 'degree')} /></div>
                                <div className="space-y-2"><Label>Year</Label><Input value={edu.year} onChange={e => handleInputChange('education', e.target.value, index, 'year')} /></div>
                              </div>
                          </div>
                      ))}
                  </CardContent>
              </Card>
            </div>
        </ScrollArea>
    </div>
  );

  const previewPanel = (
    <ScrollArea className="flex-1 bg-muted/30">
        <div className="p-4 md:p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Download Options</CardTitle>
                    <CardDescription>
                    Select a template and download your Resume.
                    </CardDescription>
                </CardHeader>
                <CardContent className="border-t pt-4 space-y-4">
                    <div>
                        <Label className="font-bold">Select Template</Label>
                        <RadioGroup defaultValue="modern" value={selectedTemplate} onValueChange={(value: string) => setSelectedTemplate(value as Template)} className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {templateOptions.map(template => (
                             <Label key={template.value} htmlFor={`t-${template.value}`} className={`border rounded-md p-2 text-center cursor-pointer ${selectedTemplate === template.value ? 'border-primary ring-2 ring-primary' : 'border-border'}`}>
                                <RadioGroupItem value={template.value} id={`t-${template.value}`} className="sr-only"/>
                                {template.label}
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <Label htmlFor="watermark-switch" className="font-bold flex items-center gap-2">
                          <Crown className={cn("h-4 w-4", removeWatermark ? "text-yellow-500" : "text-muted-foreground")} />
                          <span>Remove Watermark</span>
                        </Label>
                        <Switch
                          id="watermark-switch"
                          checked={removeWatermark}
                          onCheckedChange={setRemoveWatermark}
                        />
                      </div>
                      <Button onClick={handleDownloadPdf} disabled={!resumeData || isDownloading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        {isDownloading ? 'Generating...' : 'Download PDF'}
                      </Button>
                       {isDownloading && (
                            <p className="text-center text-sm text-muted-foreground mt-2">
                                Your PDF is being generated. This may take a moment.
                            </p>
                        )}
                </CardContent>
              </Card>

              <div ref={previewRef} className="bg-background shadow-lg md:aspect-[8.5/11] relative mt-4">
                  <ResumePreview resumeData={resumeData} template={selectedTemplate} onProfilePictureChange={handleProfilePictureChange} />
                  {!removeWatermark && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotate(-45deg)',
                            fontSize: 'clamp(2rem, 15vmin, 6rem)',
                            color: 'rgba(0,0,0,0.08)',
                            fontFamily: 'sans-serif',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                            userSelect: 'none',
                            zIndex: 1,
                        }}
                    >
                        zwivhuyaex.cv
                    </div>
                  )}
              </div>
        </div>
    </ScrollArea>
  );

  if (!isClient) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-muted/20">
            <div className="flex flex-col items-center gap-4">
                <Wand2 className="h-12 w-12 text-primary animate-pulse" />
                <p className="text-muted-foreground">Loading your Resume editor...</p>
            </div>
        </div>
      )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 p-2 md:p-6 flex flex-col overflow-hidden">
        {direction === 'horizontal' ? (
             <ResizablePanelGroup
                direction={direction}
                className="rounded-lg border bg-background shadow-lg flex-1"
            >
                <ResizablePanel defaultSize={40} minSize={30} className="flex flex-col">
                    {editorPanel}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={60} minSize={30} className="flex flex-col bg-muted/30">
                    {previewPanel}
                </ResizablePanel>
            </ResizablePanelGroup>
        ) : (
            <div className="flex flex-col h-full rounded-lg border bg-background shadow-lg">
                <div className="flex border-b">
                    <Button 
                        onClick={() => setMobileView('editor')} 
                        variant={mobileView === 'editor' ? 'secondary' : 'ghost'} 
                        className="flex-1 rounded-none rounded-tl-lg"
                    >
                        <Edit className="w-4 h-4 mr-2" /> Editor
                    </Button>
                    <Button 
                        onClick={() => setMobileView('preview')} 
                        variant={mobileView === 'preview' ? 'secondary' : 'ghost'} 
                        className="flex-1 rounded-none rounded-tr-lg"
                    >
                         <FileText className="w-4 h-4 mr-2" /> Preview
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {mobileView === 'editor' && editorPanel}
                    {mobileView === 'preview' && (
                       <ScrollArea className="h-full bg-muted/30">
                           <div className="p-4 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-xl">Download Options</CardTitle>
                                        <CardDescription>
                                        Select a template and download your Resume.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="border-t pt-4 space-y-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold">Select Template</Label>
                                            <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as Template)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a template" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {templateOptions.map(template => (
                                                        <SelectItem key={template.value} value={template.value}>{template.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <Label htmlFor="watermark-switch-mobile" className="font-bold flex items-center gap-2">
                                                <Crown className={cn("h-4 w-4", removeWatermark ? "text-yellow-500" : "text-muted-foreground")} />
                                                <span>Remove Watermark</span>
                                            </Label>
                                            <Switch
                                                id="watermark-switch-mobile"
                                                checked={removeWatermark}
                                                onCheckedChange={setRemoveWatermark}
                                            />
                                        </div>
                                        <Button onClick={handleDownloadPdf} disabled={!resumeData || isDownloading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                            {isDownloading ? 'Generating...' : 'Download PDF'}
                                        </Button>
                                        {isDownloading && (
                                            <p className="text-center text-sm text-muted-foreground mt-2">
                                                Your PDF is being generated. This may take a moment.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                                <div className="flex justify-center mt-4">
                                  <div className="w-full max-w-full">
                                    <div ref={previewRef} className="bg-background shadow-lg relative aspect-[8.5/11]">
                                        <ResumePreview resumeData={resumeData} template={selectedTemplate} onProfilePictureChange={handleProfilePictureChange} />
                                        {!removeWatermark && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                                                    fontSize: 'clamp(2rem, 15vmin, 6rem)',
                                                    color: 'rgba(0,0,0,0.08)',
                                                    fontFamily: 'sans-serif',
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap',
                                                    pointerEvents: 'none',
                                                    userSelect: 'none',
                                                    zIndex: 1,
                                                }}
                                            >
                                                zwivhuyaex.cv
                                            </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                           </div>
                        </ScrollArea>
                    )}
                </div>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function EditorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-muted/20">
                <div className="flex flex-col items-center gap-4">
                    <Wand2 className="h-12 w-12 text-primary animate-pulse" />
                    <p className="text-muted-foreground">Loading Resume Editor...</p>
                </div>
            </div>
        }>
            <EditorComponent />
        </Suspense>
    )
}
