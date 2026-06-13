
import type { ResumeRevampOutput } from '@/ai/schemas';
import { Mail, Phone, MapPin, Linkedin, Briefcase, GraduationCap, Star, BookOpen, Code, Terminal, Building, BarChart, Server, User, Award, CheckCircle, UploadCloud } from 'lucide-react';
import React from 'react';

type ResumePreviewProps = {
  resumeData: ResumeRevampOutput;
  template: 'academic' | 'classic' | 'creative' | 'entry-level' | 'executive' | 'infographic' | 'minimalist' | 'modern' | 'portfolio' | 'professional' | 'technical' | 'two-column';
  onProfilePictureChange: (dataUri: string) => void;
};

const PageWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("h-full", className)}>
        {children}
    </div>
);


const ResumePreview = ({ resumeData, template, onProfilePictureChange }: ResumePreviewProps) => {
  if (!resumeData) return null;

  const { personalInfo, professionalSummary, skills, education, workExperience } = resumeData;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          onProfilePictureChange(loadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderResponsibilities = (responsibilities: string | string[]) => {
      const respArray = typeof responsibilities === 'string' ? responsibilities.split('\n').filter(r => r.trim() !== '') : responsibilities;
      return respArray.map((r, idx) => <li key={idx}>{r}</li>);
  }
  
  const formatDateRange = (startDate: string, endDate: string | null, isCurrentJob: boolean) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
        // Use a try-catch for environments that might not have full Intl support, though modern ones do.
        try {
            return new Intl.DateTimeFormat('en-US', options).format(date);
        } catch (e) {
            // Fallback for older environments
            const year = date.getFullYear();
            const month = date.toLocaleString('en-US', { month: 'short' });
            return `${month} ${year}`;
        }
    };

    const start = formatDate(startDate);
    if (isCurrentJob) return `${start} - Present`;
    const end = endDate ? formatDate(endDate) : 'N/A';
    return `${start} - ${end}`;
}

  const renderSkills = (skillsData: string | string[]) => {
      const skillsArray = typeof skillsData === 'string' 
        ? skillsData.split(',').map(s => s.trim()).filter(s => s) 
        : skillsData;
      return skillsArray;
  }

  const skillsList = renderSkills(skills);
  
  const ProfilePicture = ({ className, defaultIcon }: { className: string, defaultIcon: React.ReactNode }) => (
    <label className={cn(className, "cursor-pointer group relative")}>
      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      {personalInfo.profilePicture ? (
        <img src={personalInfo.profilePicture} alt={personalInfo.name} className="w-full h-full object-cover" />
      ) : (
        defaultIcon
      )}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-white text-xs text-center">Change Photo</span>
      </div>
    </label>
  );


  const templates = {
    academic: (
      <div className="p-4 sm:p-6 md:p-8 bg-white text-gray-900 font-[Alegreya] w-full h-full text-xs sm:text-sm">
        <header className="text-center mb-6 pb-4 border-b">
          <h1 className="text-2xl sm:text-3xl font-bold font-[Belleza]">{personalInfo.name}</h1>
          <p className="text-sm sm:text-base mt-1">{workExperience[0]?.role || 'Researcher'}</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-3 text-xs mt-2 text-gray-500">
            <span>{personalInfo.address}</span>
            <span className="hidden sm:inline">•</span>
            <span>{personalInfo.phone}</span>
            <span className="hidden sm:inline">•</span>
            <span>{personalInfo.email}</span>
            {personalInfo.linkedin && <><span className="hidden sm:inline">•</span> <a href={personalInfo.linkedin} className="text-blue-600">LinkedIn</a></>}
          </div>
        </header>
        
        <section><SectionAcademic title="Professional Summary">{professionalSummary}</SectionAcademic></section>
        
        <section><SectionAcademic title="Education">
            {education.map((edu, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start mb-2">
                <p className="w-full sm:w-1/4 font-semibold text-gray-700 mb-1 sm:mb-0">{edu.year}</p>
                <div className="w-full sm:w-3/4">
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="text-gray-600 italic">{edu.school}</p>
                </div>
            </div>
            ))}
        </SectionAcademic></section>

        <section><SectionAcademic title="Work Experience">
          {workExperience.map((job, i) => (
            <div key={i} className="mb-4">
              <div className="flex flex-col sm:flex-row items-baseline">
                <p className="w-full sm:w-1/4 font-semibold text-gray-700 mb-1 sm:mb-0">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                <div className="w-full sm:w-3/4">
                    <h3 className="font-bold text-sm sm:text-base">{job.role}</h3>
                    <p className="italic mb-1">{job.company}</p>
                </div>
              </div>
              <ul className="list-disc list-outside space-y-1 pl-5 sm:ml-[25%] text-xs">
                {renderResponsibilities(job.responsibilities)}
              </ul>
            </div>
          ))}
        </SectionAcademic></section>
        
        <section><SectionAcademic title="Skills">
          <p className="text-xs">{skillsList.join(', ')}</p>
        </SectionAcademic></section>
      </div>
    ),
    classic: (
      <div className="p-4 sm:p-6 md:p-8 bg-white text-gray-800 font-[Alegreya] w-full h-full text-xs sm:text-sm">
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-widest uppercase font-[Belleza]">{personalInfo.name}</h1>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs mt-2 text-gray-600">
            <span>{personalInfo.address}</span>
            <span className="hidden sm:inline">|</span>
            <span>{personalInfo.phone}</span>
            <span className="hidden sm:inline">|</span>
            <span>{personalInfo.email}</span>
            {personalInfo.linkedin && <><span className="hidden sm:inline">|</span> <a href={personalInfo.linkedin} className="text-blue-600">LinkedIn</a></>}
          </div>
        </header>
        <hr className="my-6 border-gray-400"/>
        <section><SectionClassic title="Professional Summary">{professionalSummary}</SectionClassic></section>
        <section><SectionClassic title="Work Experience">
          {workExperience.map((job, i) => (
            <div key={i} className="mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-baseline">
                <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-0">{job.company} — <span className="font-normal italic">{job.role}</span></h3>
                <p className="text-xs font-mono">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
              </div>
              <ul className="list-disc list-outside space-y-1 pl-5 mt-1 text-xs">
                {renderResponsibilities(job.responsibilities)}
              </ul>
            </div>
          ))}
        </SectionClassic></section>
        <section><SectionClassic title="Skills">
          <p>{skillsList.join(' · ')}</p>
        </SectionClassic></section>
        <section><SectionClassic title="Education">
          {education.map((edu, i) => (
            <div key={i} className="flex flex-col sm:flex-row justify-between items-baseline mb-1">
              <div>
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school}</p>
              </div>
              <p className="text-xs font-mono mt-1 sm:mt-0">{edu.year}</p>
            </div>
          ))}
        </SectionClassic></section>
      </div>
    ),
    creative: (
      <div className="w-full h-full bg-white text-gray-800 font-[Lato] text-xs sm:text-sm">
        <header className="bg-gray-50 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <ProfilePicture
                className="w-24 h-24 rounded-full bg-primary/10 text-primary flex-shrink-0 overflow-hidden"
                defaultIcon={
                  <div className="flex flex-col items-center justify-center w-full h-full text-center">
                      <UploadCloud className="w-6 h-6 mb-1"/>
                      <span className="text-xs font-semibold">Upload Photo</span>
                  </div>
                }
            />
            <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold font-[Belleza] text-gray-800">{personalInfo.name}</h1>
                <p className="text-base sm:text-lg text-primary">{workExperience[0]?.role || 'Professional'}</p>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-xs mt-2 text-gray-500">
                    {personalInfo.phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3"/>{personalInfo.phone}</p>}
                    {personalInfo.email && <p className="flex items-center gap-1.5"><Mail className="w-3 h-3"/>{personalInfo.email}</p>}
                    {personalInfo.linkedin && <a href={personalInfo.linkedin} className="flex items-center gap-1.5 text-blue-600 hover:underline"><Linkedin className="w-3 h-3"/>LinkedIn</a>}
                    {personalInfo.address && <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/>{personalInfo.address}</p>}
                </div>
            </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-x-8 p-4 sm:p-6 md:p-8">
            <div className="md:col-span-2">
                <section className="mb-6">
                    <h2 className="text-lg sm:text-xl font-bold font-[Belleza] text-primary mb-2">Summary</h2>
                    <p className="text-xs sm:text-sm leading-relaxed">{professionalSummary}</p>
                </section>
                <section>
                    <h2 className="text-lg sm:text-xl font-bold font-[Belleza] text-primary mb-3">Experience</h2>
                    {workExperience.map((job, i) => (
                        <div key={i} className="mb-4">
                            <h3 className="font-bold text-sm sm:text-base">{job.role}</h3>
                            <div className="flex justify-between items-baseline mb-1">
                                <p className="text-gray-600 italic">{job.company}</p>
                                <p className="text-xs text-gray-500 font-mono">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                            </div>
                            <ul className="list-disc list-outside pl-4 space-y-1 text-xs">
                                {renderResponsibilities(job.responsibilities)}
                            </ul>
                        </div>
                    ))}
                </section>
            </div>
            <div className="md:col-span-1 mt-6 md:mt-0">
                <section className="mb-6">
                    <h2 className="text-lg sm:text-xl font-bold font-[Belleza] text-primary mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2 text-xs">
                        {skillsList.map((skill, i) => (
                            <span key={i} className="bg-primary/10 font-semibold px-2 py-1 rounded-full text-primary">{skill}</span>
                        ))}
    
                    </div>
                </section>
                <section>
                    <h2 className="text-lg sm:text-xl font-bold font-[Belleza] text-primary mb-2">Education</h2>
                    {education.map((edu, i) => (
                        <div key={i} className="mb-2">
                            <h3 className="font-bold text-sm">{edu.degree}</h3>
                            <p className="text-xs text-gray-600">{edu.school}</p>
                            <p className="text-xs text-gray-500">{edu.year}</p>
                        </div>
                    ))}
                </section>
            </div>
        </main>
      </div>
    ),
    'entry-level': (
        <div className="p-4 sm:p-6 md:p-8 bg-white text-gray-800 font-[Source_Sans_Pro] w-full h-full text-xs sm:text-sm">
            <header className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">{personalInfo.name}</h1>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-3 text-xs mt-2 text-gray-500">
                    <span>{personalInfo.address}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{personalInfo.phone}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{personalInfo.email}</span>
                </div>
            </header>
            <hr className="mb-6"/>
            <main>
                <section className="mb-6">
                    <h2 className="text-base sm:text-lg font-semibold text-primary mb-2">Objective</h2>
                    <p className="text-xs sm:text-sm">{professionalSummary}</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-base sm:text-lg font-semibold text-primary mb-2">Education</h2>
                    {education.map((edu, i) => (
                        <div key={i} className="mb-2">
                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                <h3 className="font-bold text-sm sm:text-base">{edu.school}</h3>
                                <p className="text-xs sm:text-sm mt-1 sm:mt-0">{edu.year}</p>
                            </div>
                            <p className="text-xs sm:text-sm italic">{edu.degree}</p>
                        </div>
                    ))}
                </section>
                <section className="mb-6">
                    <h2 className="text-base sm:text-lg font-semibold text-primary mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm">
                        {skillsList.map((skill, i) => (
                            <p key={i} className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" />{skill}</p>
                        ))}
                    </div>
                </section>
                {workExperience && workExperience.length > 0 && (
                    <section>
                        <h2 className="text-base sm:text-lg font-semibold text-primary mb-2">Experience</h2>
                        {workExperience.map((job, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex flex-col sm:flex-row justify-between items-baseline">
                                    <h3 className="font-bold text-sm sm:text-base">{job.role}, <span className="font-normal">{job.company}</span></h3>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-0">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                                </div>
                                <ul className="list-disc list-outside pl-5 mt-1 text-xs sm:text-sm space-y-1">
                                    {renderResponsibilities(job.responsibilities)}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    ),
    executive: (
        <div className="p-4 sm:p-6 md:p-8 bg-white text-gray-700 font-[Merriweather] w-full h-full text-xs sm:text-sm">
            <header className="text-center pb-6 border-b-2 border-gray-800">
                <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 tracking-wider">{personalInfo.name.toUpperCase()}</h1>
                <p className="text-lg sm:text-xl text-gray-500 mt-2">{workExperience[0]?.role || 'Executive Professional'}</p>
            </header>
            <div className="flex flex-col sm:flex-row text-center sm:justify-center gap-2 sm:gap-6 text-xs my-4">
                <span>{personalInfo.phone}</span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <span>{personalInfo.email}</span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <span>{personalInfo.address}</span>
                {personalInfo.linkedin && <>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <a href={personalInfo.linkedin} className="text-blue-700 hover:underline">{personalInfo.linkedin}</a>
                </>}
            </div>
            <main>
                <section><SectionExecutive title="Executive Summary">{professionalSummary}</SectionExecutive></section>
                <section><SectionExecutive title="Professional Experience">
                    {workExperience.map((job, i) => (
                        <div key={i} className="mb-5">
                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                <h3 className="text-base sm:text-lg font-bold text-gray-800">{job.role}</h3>
                                <p className="text-xs font-semibold mt-1 sm:mt-0">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                            </div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-600 italic mb-2">{job.company}</h4>
                            <ul className="list-disc list-outside space-y-1 pl-5 text-xs">
                                {renderResponsibilities(job.responsibilities)}
                            </ul>
                        </div>
                    ))}
                </SectionExecutive></section>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10">
                    <section>
                    <SectionExecutive title="Core Competencies">
                        <ul className="columns-1 sm:columns-2 text-xs">
                            {skillsList.map((skill, i) => <li key={i}>{skill}</li>)}
                        </ul>
                    </SectionExecutive>
                    </section>
                    <section>
                    <SectionExecutive title="Education">
                        {education.map((edu, i) => (
                            <div key={i} className="mb-2">
                                <h3 className="font-bold">{edu.degree}</h3>
                                <p className="text-gray-600">{edu.school}, {edu.year}</p>
                            </div>
                        ))}
                    </SectionExecutive>
                    </section>
                </div>
            </main>
        </div>
    ),
    infographic: (
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50 text-gray-700 font-[Lato] w-full h-full text-xs sm:text-sm">
        <header className="text-center mb-8">
             <ProfilePicture
                className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary/20 flex items-center justify-center ring-4 ring-white shadow-md overflow-hidden"
                defaultIcon={
                    <div className="flex flex-col items-center justify-center w-full h-full text-center text-primary">
                        <UploadCloud className="w-8 h-8 mb-1"/>
                        <span className="text-xs font-semibold">Upload Photo</span>
                    </div>
                  }
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{personalInfo.name}</h1>
            <p className="text-primary">{workExperience[0]?.role || 'Professional'}</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center text-xs mb-8 border-y py-4">
            <div className="flex items-center justify-center gap-2 break-all"><Mail className="w-4 h-4 text-primary flex-shrink-0"/><span>{personalInfo.email}</span></div>
            <div className="flex items-center justify-center gap-2"><Phone className="w-4 h-4 text-primary flex-shrink-0"/><span>{personalInfo.phone}</span></div>
            <div className="flex items-center justify-center gap-2 break-all"><Linkedin className="w-4 h-4 text-primary flex-shrink-0"/><span>{personalInfo.linkedin}</span></div>
        </div>
        <main>
            <section className="mb-6"><h2 className="text-lg font-bold text-gray-800 text-center mb-4">SKILLS</h2>
                <div className="flex flex-wrap justify-center gap-2 text-xs">
                    {skillsList.slice(0, 10).map((skill, i) => (<div key={i} className="bg-white border border-gray-200 shadow-sm rounded-full px-3 py-1">{skill}</div>))}
                </div>
            </section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary"/>Experience</h2>
                    {workExperience.map((job, i) => (
                        <div key={i} className="mb-4 relative pl-4 border-l-2 border-primary/30">
                            <div className="absolute -left-[7px] top-1 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
                            <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                            <h3 className="font-bold">{job.role}</h3><p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary"/>Education</h2>
                     {education.map((edu, i) => (
                        <div key={i} className="mb-4"><h3 className="font-bold">{edu.degree}</h3><p className="text-gray-600">{edu.school} ({edu.year})</p></div>
                    ))}
                </section>
            </div>
        </main>
      </div>
    ),
    minimalist: (
        <div className="p-4 sm:p-6 md:p-8 bg-white text-gray-700 font-[Source_Sans_Pro] w-full h-full text-xs sm:text-sm">
            <header className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div><h1 className="text-3xl sm:text-4xl font-bold tracking-tighter">{personalInfo.name}</h1></div>
                <div className="sm:text-right text-xs space-y-1 break-words">
                    <p>{personalInfo.email}</p>
                    <p>{personalInfo.phone}</p>
                    <p>{personalInfo.address}</p>
                    {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
                </div>
            </header>
            <hr className="mb-8" />
            <main>
                <section className="mb-6">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">About Me</h2>
                    <p className="text-xs leading-relaxed">{professionalSummary}</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Experience</h2>
                    {workExperience.map((job, i) => (
                        <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 mb-3">
                            <div className="col-span-1 text-xs mb-1 sm:mb-0">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</div>
                            <div className="col-span-3">
                                <h3 className="font-semibold">{job.role}</h3>
                                <p className="text-xs text-gray-500">{job.company}</p>
                                <ul className="list-disc list-outside pl-4 mt-1 text-xs">
                                    {renderResponsibilities(job.responsibilities)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </section>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <section className="mb-6">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Education</h2>
                        {education.map((edu, i) => (
                            <div key={i} className="mb-2">
                                <h3 className="font-semibold">{edu.degree}</h3>
                                <p className="text-xs text-gray-500">{edu.school} - {edu.year}</p>
                            </div>
                        ))}
                    </section>
                     <section className="mb-6">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Skills</h2>
                        <p className="text-xs">{skillsList.join(', ')}</p>
                    </section>
                </div>
            </main>
        </div>
    ),
    modern: (
      <div className="bg-white text-gray-800 font-[Lato] w-full h-full text-xs sm:text-sm flex flex-col">
          <div className="p-4 sm:p-6 md:p-8">
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b-2 border-primary">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-primary tracking-tight font-[Belleza]">{personalInfo.name}</h1>
                <p className="text-base sm:text-lg text-gray-600">{workExperience[0]?.role || 'Professional'}</p>
              </div>
              <div className="text-left sm:text-right text-xs mt-2 sm:mt-0 space-y-1 break-words">
                {personalInfo.email && <div className="flex items-center sm:justify-end gap-2"><p>{personalInfo.email}</p><Mail className="w-3 h-3 text-primary"/></div>}
                {personalInfo.phone && <div className="flex items-center sm:justify-end gap-2"><p>{personalInfo.phone}</p><Phone className="w-3 h-3 text-primary"/></div>}
                {personalInfo.address && <div className="flex items-center sm:justify-end gap-2"><p>{personalInfo.address}</p><MapPin className="w-3 h-3 text-primary"/></div>}
                {personalInfo.linkedin && <div className="flex items-center sm:justify-end gap-2"><p>{personalInfo.linkedin}</p><Linkedin className="w-3 h-3 text-primary"/></div>}
              </div>
            </header>
          </div>
          <main className="flex flex-1">
              <div className="w-2/3 p-4 sm:p-6 md:p-8 pt-0">
                  <section><Section title="Professional Summary" icon={<Star className="w-5 h-5" />}>{professionalSummary}</Section></section>
                  <section><Section title="Work Experience" icon={<Briefcase className="w-5 h-5" />}>
                  {workExperience.map((job, i) => (
                      <div key={i} className="mb-4">
                      <h3 className="font-bold text-sm sm:text-base">{job.role} <span className="text-primary">@ {job.company}</span></h3>
                      <p className="text-xs text-gray-500 mb-1">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                      <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
                          {renderResponsibilities(job.responsibilities)}
                      </ul>
                      </div>
                  ))}
                  </Section></section>
                  <section><Section title="Education" icon={<GraduationCap className="w-5 h-5" />}>
                  {education.map((edu, i) => (
                      <div key={i} className="mb-2">
                      <h3 className="font-bold">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.school}</p>
                      <p className="text-xs text-gray-500">{edu.year}</p>
                      </div>
                  ))}
                  </Section></section>
              </div>
              <div className="w-1/3 bg-gray-50 p-4 sm:p-6 md:p-8">
                  <section><Section title="Skills">
                  <div className="flex flex-wrap gap-2">
                      {skillsList.map((skill, i) => <span key={i} className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">{skill}</span>)}
                  </div>
                  </Section></section>
              </div>
          </main>
      </div>
    ),
    portfolio: (
        <div className="p-4 sm:p-6 md:p-8 bg-white text-gray-800 font-[Open_Sans] w-full h-full text-xs sm:text-sm">
            <header className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 items-center mb-8 pb-6 border-b-2 border-primary/20">
                <div className="col-span-1 flex justify-center">
                      <ProfilePicture
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full shadow-lg overflow-hidden bg-primary/10 text-primary"
                        defaultIcon={
                            <div className="flex flex-col items-center justify-center w-full h-full text-center">
                                <UploadCloud className="w-8 h-8 sm:w-12 sm:h-12 mb-1"/>
                                <span className="text-xs sm:text-sm font-semibold">Upload Photo</span>
                            </div>
                          }
                     />
                </div>
                <div className="col-span-1 sm:col-span-2 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-4xl font-bold text-primary font-[Belleza]">{personalInfo.name}</h1>
                    <p className="text-lg sm:text-xl text-gray-600">{workExperience[0]?.role || 'Creative Professional'}</p>
                </div>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 text-xs">
                    <section>
                    <h2 className="font-bold text-primary uppercase tracking-widest text-sm mb-3">About Me</h2>
                    <p className="mb-6">{professionalSummary}</p>
                    </section>
                    <section>
                    <h2 className="font-bold text-primary uppercase tracking-widest text-sm mb-3">Contact</h2>
                    <div className="space-y-1 break-words">
                        <p className="flex items-center gap-2"><Phone className="w-3 h-3"/> {personalInfo.phone}</p>
                        <p className="flex items-center gap-2"><Mail className="w-3 h-3"/> {personalInfo.email}</p>
                        <p className="flex items-center gap-2"><Linkedin className="w-3 h-3"/> {personalInfo.linkedin}</p>
                    </div>
                    </section>
                </div>
                <div className="md:col-span-2">
                    <section>
                    <h2 className="font-bold text-primary uppercase tracking-widest text-sm mb-3">Experience</h2>
                    {workExperience.map((job, i) => (
                        <div key={i} className="mb-4">
                            <h3 className="font-bold text-sm sm:text-base">{job.company}</h3>
                            <div className="flex flex-col sm:flex-row justify-between items-baseline">
                                <p className="italic text-gray-600">{job.role}</p>
                                <p className="text-xs text-gray-500 mt-1 sm:mt-0">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                            </div>
                            <ul className="list-disc list-outside pl-5 space-y-1 text-xs mt-1">
                                {renderResponsibilities(job.responsibilities)}
                            </ul>
                        </div>
                    ))}
                    </section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
                        <section>
                            <h2 className="font-bold text-primary uppercase tracking-widest text-sm mb-3">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {skillsList.map((skill, i) => <span key={i} className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded">{skill}</span>)}
                            </div>
                        </section>
                        <section>
                            <h2 className="font-bold text-primary uppercase tracking-widest text-sm mb-3">Education</h2>
                             {education.map((edu, i) => (
                                <div key={i} className="mb-2 text-xs">
                                    <h3 className="font-semibold">{edu.degree}</h3>
                                    <p>{edu.school}, {edu.year}</p>
                                </div>
                            ))}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    ),
    professional: (
      <div className="p-4 sm:p-6 md:p-8 bg-white text-gray-800 font-[Source_Sans_Pro] w-full h-full text-xs sm:text-sm">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b-2 border-gray-200">
            <div className="text-left mb-2 sm:mb-0">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 tracking-tight">{personalInfo.name}</h1>
                <p className="text-base sm:text-lg text-primary">{workExperience[0]?.role || 'Professional'}</p>
            </div>
            <div className="text-left sm:text-right text-xs text-gray-600 space-y-1 break-words">
                <div className="flex items-center sm:justify-end gap-2"><p>{personalInfo.email}</p><Mail className="w-4 h-4 text-gray-400"/></div>
                <div className="flex items-center sm:justify-end gap-2"><p>{personalInfo.phone}</p><Phone className="w-4 h-4 text-gray-400"/></div>
                {personalInfo.linkedin && <div className="flex items-center sm:justify-end gap-2"><p>{personalInfo.linkedin}</p><Linkedin className="w-4 h-4 text-gray-400"/></div>}
            </div>
        </header>
        <main className="mt-6">
            <section className="mb-6"><h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-3">Summary</h2><p className="text-xs">{professionalSummary}</p></section>
            <section className="mb-6"><h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-3">Work Experience</h2>
                {workExperience.map((job, i) => (
                    <div key={i} className="mb-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-1">
                            <h3 className="text-sm sm:text-base font-bold text-left w-full mb-1 sm:mb-0">{job.role} at <span className="text-gray-600">{job.company}</span></h3>
                            <p className="text-xs text-gray-500 text-left sm:text-right w-full">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                        </div>
                        <ul className="list-disc list-outside pl-5 space-y-1 text-xs">{renderResponsibilities(job.responsibilities)}</ul>
                    </div>
                ))}
            </section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <section className="mb-6"><h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-3">Education</h2>
                    {education.map((edu, i) => (
                        <div key={i} className="mb-2"><h3 className="font-bold">{edu.degree}</h3><p className="text-gray-600">{edu.school} ({edu.year})</p></div>
                    ))}
                </section>
                <section className="mb-6"><h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-primary border-b border-gray-200 pb-1 mb-3">Skills</h2><p className="text-xs">{skillsList.join(', ')}</p></section>
            </div>
        </main>
      </div>
    ),
    technical: (
        <div className="p-4 sm:p-6 md:p-8 bg-white text-gray-800 font-[Roboto_Mono] w-full h-full text-xs">
            <header className="mb-6">
                <h1 className="text-lg sm:text-2xl font-bold">{personalInfo.name}</h1>
                <p className="text-primary text-sm sm:text-base">{workExperience[0]?.role || 'Technical Professional'}</p>
                <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4 text-gray-500 mt-1 break-words">
                    <span>{personalInfo.phone}</span>
                    <span className="hidden sm:inline">//</span>
                    <span>{personalInfo.email}</span>
                    {personalInfo.linkedin && <><span className="hidden sm:inline">//</span><a href={personalInfo.linkedin} className="text-blue-500 hover:underline">{personalInfo.linkedin}</a></>}
                </div>
            </header>
            
            <section><SectionTech title="SUMMARY.md">{professionalSummary}</SectionTech></section>
            
            <section><SectionTech title="SKILLS.json">
                <div className="flex flex-wrap gap-x-2 sm:gap-x-4 gap-y-1">
                    <span className="text-gray-400">{`[`}</span>
                    {skillsList.map((skill, i) => <span key={i} className="text-green-600">"{skill}"{i < skillsList.length-1 && ','}</span>)}
                    <span className="text-gray-400">{`]`}</span>
                </div>
            </SectionTech></section>

            <section><SectionTech title="EXPERIENCE.log">
                {workExperience.map((job, i) => (
                    <div key={i} className="mb-4">
                        <p><span className="text-yellow-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</span>: <span className="font-bold">{job.role}</span> @ <span className="text-cyan-600">{job.company}</span></p>
                        <ul className="pl-4 border-l-2 border-dashed border-gray-200 ml-2 mt-1">
                            {renderResponsibilities(job.responsibilities).map((item, idx) => <li key={idx} className="flex items-start gap-2"><Terminal className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" /><span>{item}</span></li>)}
                        </ul>
                    </div>
                ))}
            </SectionTech></section>
            
            <section><SectionTech title="EDUCATION.ini">
                {education.map((edu, i) => (
                    <p key={i} className="break-all">
                        <span className="font-bold text-gray-500">school=</span>{edu.school}, <span className="font-bold text-gray-500">degree=</span>{edu.degree}, <span className="font-bold text-gray-500">year=</span>{edu.year}
                    </p>
                ))}
            </SectionTech></section>
        </div>
    ),
    'two-column': (
        <div className="flex flex-col sm:flex-row font-[Alegreya] w-full h-full text-xs sm:text-sm bg-white">
            <aside className="w-full sm:w-1/3 bg-gray-100 text-gray-800 p-4 sm:p-6 md:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold font-[Belleza] text-primary">{personalInfo.name}</h1>
                <p className="mb-6 text-sm sm:text-base">{workExperience[0]?.role}</p>

                <section><h2 className="font-bold uppercase tracking-wider text-xs sm:text-sm mb-2 text-gray-600">Contact</h2>
                <div className="text-xs space-y-1 mb-6 border-b pb-6 break-words">
                    <p className="flex items-center gap-2"><Phone className="w-3 h-3 flex-shrink-0"/> {personalInfo.phone}</p>
                    <p className="flex items-center gap-2"><Mail className="w-3 h-3 flex-shrink-0"/> {personalInfo.email}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-3 h-3 flex-shrink-0"/> {personalInfo.address}</p>
                    {personalInfo.linkedin && <p className="flex items-center gap-2"><Linkedin className="w-3 h-3 flex-shrink-0"/> {personalInfo.linkedin}</p>}
                </div></section>
                
                <section><h2 className="font-bold uppercase tracking-wider text-xs sm:text-sm mb-2 text-gray-600">Skills</h2>
                <div className="text-xs space-y-1 mb-6 border-b pb-6">
                   {skillsList.map((skill, i) => <p key={i}>{skill}</p>)}
                </div></section>

                <section><h2 className="font-bold uppercase tracking-wider text-xs sm:text-sm mb-2 text-gray-600">Education</h2>
                <div className="text-xs space-y-2">
                    {education.map((edu, i) => (
                        <div key={i}>
                            <h3 className="font-semibold">{edu.degree}</h3>
                            <p className="text-gray-600">{edu.school}</p>
                            <p className="text-gray-500 text-xs">{edu.year}</p>
                        </div>
                    ))}
                </div></section>
            </aside>
            <main className="w-full sm:w-2/3 p-4 sm:p-6 md:p-8 text-gray-700">
                <section className="mb-6">
                    <h2 className="text-lg sm:text-xl font-bold font-[Belleza] border-b-2 border-primary pb-1 mb-3">Summary</h2>
                    <p className="text-xs leading-relaxed">{professionalSummary}</p>
                </section>
                <section>
                    <h2 className="text-lg sm:text-xl font-bold font-[Belleza] border-b-2 border-primary pb-1 mb-3">Work Experience</h2>
                    {workExperience.map((job, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex flex-col sm:flex-row justify-between items-baseline mb-1">
                                <h3 className="font-bold text-sm sm:text-base">{job.role}</h3>
                                <p className="text-xs text-gray-500 mt-1 sm:mt-0">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                            </div>
                            <p className="italic text-sm text-gray-600 mb-1">{job.company}</p>
                            <ul className="list-disc list-outside pl-4 space-y-1 text-xs">{renderResponsibilities(job.responsibilities)}</ul>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    ),
  };

  const TemplateComponent = templates[template] || templates.modern;

  return (
    <PageWrapper className="bg-white shadow-lg w-full h-full relative">
      {TemplateComponent}
    </PageWrapper>
  );
};

const Section = ({ title, icon, children }: { title: string, icon?: React.ReactNode, children: React.ReactNode }) => (
    <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-700 border-b border-gray-200 pb-1 mb-3 flex items-center gap-2 font-[Belleza]">
            {icon} {title}
        </h2>
        <div className="text-xs leading-relaxed">{children}</div>
    </div>
);

const SectionClassic = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-5">
        <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-gray-600 border-b-2 border-gray-300 pb-1 mb-2 font-[Belleza]">{title}</h2>
        <div className="text-xs sm:text-sm leading-relaxed">{children}</div>
    </div>
);

const SectionAcademic = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-6">
        <h2 className="text-sm sm:text-base font-semibold uppercase tracking-wider text-gray-800 border-b pb-1 mb-3">{title}</h2>
        <div className="text-xs leading-relaxed">{children}</div>
    </div>
);

const SectionTech = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-6">
        <h2 className="text-sm font-bold text-purple-600 flex items-center gap-2 mb-2">
            <Code className="w-4 h-4"/> {title}
        </h2>
        <div className="pl-6 text-gray-600">{children}</div>
    </div>
);

const SectionExecutive = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-6">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-500 pb-1 mb-3 border-b border-gray-300">{title}</h2>
        <div className="text-xs sm:text-sm leading-relaxed">{children}</div>
    </div>
);

function cn(...inputs: any[]) {
    // This is a simplified version of the `cn` utility.
    // In a real app, you'd use a library like `clsx` and `tailwind-merge`.
    return inputs.filter(Boolean).join(' ');
}


export default ResumePreview;
