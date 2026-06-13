'use server';
/**
 * @fileOverview Resume Revamp AI agent.
 *
 * - resumeRevamp - A function that revamps the uploaded Resume to enhance the content.
 * - ResumeRevampInput - The input type for the resumeRevamp function.
 * - ResumeRevampOutput - The return type for the resumeRevamp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ResumeRevampOutput, ResumeRevampOutputSchema } from '../schemas';

const ResumeRevampInputSchema = z.object({
  resumeData: z
    .string()
    .describe(
      'The Resume data as a string. This can be the text extracted from a PDF or Word document, or text directly pasted by the user.'
    ),
});
export type ResumeRevampInput = z.infer<typeof ResumeRevampInputSchema>;

export async function resumeRevamp(input: ResumeRevampInput): Promise<ResumeRevampOutput> {
  return resumeRevampFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeRevampPrompt',
  input: {schema: ResumeRevampInputSchema},
  output: {schema: ResumeRevampOutputSchema},
  prompt: `You are an expert resume writer and data extractor. Analyze the following Resume content and extract the information into a structured JSON format. Also, rewrite and improve the content for clarity, impact, and professional tone.

Resume Content: {{{resumeData}}}

Parse the content and populate all the fields in the output schema.
For work experience, extract start and end dates. If an end date says "Present", "Current", or is very recent, set isCurrentJob to true and endDate to null. Format dates as YYYY-MM-DD.
For work experience, list the key responsibilities as a single string with each responsibility on a new line.
For skills, provide them as a single comma-separated string.
`,
});

const resumeRevampFlow = ai.defineFlow(
  {
    name: 'resumeRevampFlow',
    inputSchema: ResumeRevampInputSchema,
    outputSchema: ResumeRevampOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("The AI failed to generate a revamped Resume.");
    return output;
  }
);
