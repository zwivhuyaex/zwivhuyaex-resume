'use server';

/**
 * @fileOverview This file defines a Genkit flow for optimizing a Resume for a specific job description.
 *
 * - optimizeResumeForJob - A function that takes a Resume and job description as input and returns an optimized Resume.
 * - OptimizeResumeForJobInput - The input type for the optimizeResumeForJob function.
 * - OptimizeResumeForJobOutput - The return type for the optimizeResumeForJob function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ResumeRevampOutput, ResumeRevampOutputSchema } from '../schemas';

const OptimizeResumeForJobInputSchema = z.object({
  resume: ResumeRevampOutputSchema.describe('The structured content of the Resume to be optimized.'),
  jobDescription: z.string().describe('The job description to optimize the Resume for.'),
});
export type OptimizeResumeForJobInput = z.infer<typeof OptimizeResumeForJobInputSchema>;

export type OptimizeResumeForJobOutput = ResumeRevampOutput;

export async function optimizeResumeForJob(input: OptimizeResumeForJobInput): Promise<OptimizeResumeForJobOutput> {
  return optimizeResumeForJobFlow(input);
}

const optimizeResumeForJobPrompt = ai.definePrompt({
  name: 'optimizeResumeForJobPrompt',
  input: {schema: OptimizeResumeForJobInputSchema},
  output: {schema: ResumeRevampOutputSchema},
  prompt: `You are an expert Resume optimizer. You will receive a Resume in a structured JSON format and a job description.
Your task is to subtly optimize the 'professionalSummary' and the 'responsibilities' within each 'workExperience' entry.
Rewrite these sections to better align with the keywords and required skills found in the job description. Do not change any other part of the resume.

When you rewrite a section, you MUST store the original, unmodified text in the corresponding 'original' field.
- If you rewrite 'professionalSummary', copy the original text into 'originalProfessionalSummary'.
- If you rewrite 'responsibilities' for a work experience entry, copy the original text into 'originalResponsibilities' for that entry.
- If you do not modify a section, leave the 'original' field for that section empty or null.

Focus on word choice and highlighting relevant skills. Do not add new experiences or skills the user doesn't have.
Return the entire Resume in the same structured JSON format.

Resume (JSON):
{{{json resume}}}

Job Description:
{{{jobDescription}}}
`,
});

const optimizeResumeForJobFlow = ai.defineFlow(
  {
    name: 'optimizeResumeForJobFlow',
    inputSchema: OptimizeResumeForJobInputSchema,
    outputSchema: ResumeRevampOutputSchema,
  },
  async input => {
    const {output} = await optimizeResumeForJobPrompt(input);
    if (!output) throw new Error("The AI failed to generate an optimized Resume.");
    return output;
  }
);
