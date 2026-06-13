import { z } from 'zod';

/**
 * @fileOverview This file defines the shared Zod schemas and TypeScript types for the AI flows.
 *
 * - ResumeRevampOutputSchema - The Zod schema for the structured Resume data.
 * - ResumeRevampOutput - The TypeScript type inferred from the ResumeRevampOutputSchema.
 */

export const ResumeRevampOutputSchema = z.object({
  personalInfo: z.object({
    name: z.string().describe('Full name.'),
    address: z.string().describe('Address.'),
    phone: z.string().describe('Phone number.'),
    email: z.string().describe('Email address.'),
    linkedin: z.string().optional().describe('LinkedIn profile URL.'),
    profilePicture: z.string().optional().describe('A data URI of the user\'s profile picture.'),
  }).describe("The user's personal information."),
  professionalSummary: z.string().describe('The professional summary section.'),
  originalProfessionalSummary: z.string().optional().describe('The original professional summary before AI modification. Only present if changes were made.'),
  skills: z.string().describe('A comma-separated string of skills.'),
  education: z.array(z.object({
    school: z.string().describe('Name of the school or institution.'),
    degree: z.string().describe('Degree or certificate obtained.'),
    year: z.string().describe('Year of completion or graduation.'),
  })).describe('A list of educational experiences.'),
  workExperience: z.array(z.object({
    company: z.string().describe('Name of the company.'),
    role: z.string().describe('Job title or role.'),
    startDate: z.string().describe('Employment start date, preferably in YYYY-MM-DD format.'),
    endDate: z.string().nullable().describe('Employment end date, preferably in YYYY-MM-DD format. Null if it is the current job.'),
    isCurrentJob: z.boolean().describe('Set to true if this is the current job.'),
    responsibilities: z.string().describe('A single string containing key responsibilities or achievements, separated by newlines.'),
    originalResponsibilities: z.string().optional().describe('The original responsibilities before AI modification. Only present if changes were made.'),
  })).describe('A list of work experiences.'),
});

export type ResumeRevampOutput = z.infer<typeof ResumeRevampOutputSchema>;
