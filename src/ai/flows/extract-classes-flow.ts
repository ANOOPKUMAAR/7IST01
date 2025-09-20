'use server';

/**
 * @fileOverview An AI agent for extracting structured class data from a timetable image or document for admins.
 *
 * - extractClasses - A function that handles the class timetable extraction process.
 * - ExtractClassesInput - The input type for the extractClasses function.
 * - ExtractClassesOutput - The return type for the extractClasses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassSchema = z.object({
    name: z.string().describe('The name of the class or subject.'),
    coordinator: z.string().describe("The name of the class coordinator or primary instructor. If not specified, use 'N/A'."),
    day: z.string().describe('The day of the week for the class (e.g., "Monday", "Tuesday").'),
    startTime: z.string().describe("The start time of the class in HH:mm format."),
    endTime: z.string().describe("The end time of the class in HH:mm format."),
});

const ExtractClassesInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "An image (JPEG, PNG) or a PDF file of a timetable, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractClassesInput = z.infer<typeof ExtractClassesInputSchema>;

const ExtractClassesOutputSchema = z.object({
    classes: z.array(ClassSchema)
});
export type ExtractClassesOutput = z.infer<typeof ExtractClassesOutputSchema>;


export async function extractClasses(
  input: ExtractClassesInput
): Promise<ExtractClassesOutput> {
  return extractClassesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractClassesPrompt',
  input: {schema: ExtractClassesInputSchema},
  output: {schema: ExtractClassesOutputSchema},
  prompt: `You are an expert at parsing and extracting structured information from university class timetables.

Analyze the provided file (image or PDF) and extract all the classes listed. For each class, identify the following details:
- name: The name of the subject or class.
- coordinator: The name of the assigned coordinator or instructor. If not available, use "N/A".
- day: The day of the week the class occurs on (e.g., "Monday").
- startTime: The start time of the class, formatted as HH:mm.
- endTime: The end time of the class, formatted as HH:mm.

Return the extracted information as a structured JSON object.

File: {{media url=fileDataUri}}`,
});

const extractClassesFlow = ai.defineFlow(
  {
    name: 'extractClassesFlow',
    inputSchema: ExtractClassesInputSchema,
    outputSchema: ExtractClassesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
