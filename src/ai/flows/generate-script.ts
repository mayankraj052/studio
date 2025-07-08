// src/ai/flows/generate-script.ts
'use server';
/**
 * @fileOverview AI script generation flow.
 *
 * This file defines a Genkit flow for generating a 60-second video script
 * from a user-provided topic, including a title, relevant hashtags, and an emoji-based summary.
 *
 * @exports generateScript - The main function to trigger the script generation flow.
 * @exports GenerateScriptInput - The input type for the generateScript function.
 * @exports GenerateScriptOutput - The output type for the generateScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateScriptInputSchema = z.object({
  topic: z.string().describe('The topic for the video script.'),
});
export type GenerateScriptInput = z.infer<typeof GenerateScriptInputSchema>;

// Define the output schema
const GenerateScriptOutputSchema = z.object({
  title: z.string().describe('The title of the video script.'),
  script: z.string().describe('The generated 60-second video script.'),
  hashtags: z.string().describe('Relevant hashtags for the video.'),
  emojiSummary: z.string().describe('An emoji-based summary of the script.'),
});
export type GenerateScriptOutput = z.infer<typeof GenerateScriptOutputSchema>;

// Exported function to call the flow
export async function generateScript(input: GenerateScriptInput): Promise<GenerateScriptOutput> {
  return generateScriptFlow(input);
}

// Define the prompt
const generateScriptPrompt = ai.definePrompt({
  name: 'generateScriptPrompt',
  input: {schema: GenerateScriptInputSchema},
  output: {schema: GenerateScriptOutputSchema},
  prompt: `You are an AI video script generator. Your task is to create a concise, engaging 60-second video script based on a given topic.

  The script should include:
  - A catchy title
  - A full script for a 60-second video, complete with engaging questions and tips.
  - Relevant hashtags to increase visibility
  - An emoji-based summary of the video content for a quick overview

  Topic: {{{topic}}}

  Output the following fields:
  title: The title of the video.
  script: The complete 60-second video script.
  hashtags: Relevant hashtags for the video, separated by spaces.
  emojiSummary: An emoji-based summary of the video content.
  `,
});

// Define the flow
const generateScriptFlow = ai.defineFlow(
  {
    name: 'generateScriptFlow',
    inputSchema: GenerateScriptInputSchema,
    outputSchema: GenerateScriptOutputSchema,
  },
  async input => {
    const {output} = await generateScriptPrompt(input);
    return output!;
  }
);
