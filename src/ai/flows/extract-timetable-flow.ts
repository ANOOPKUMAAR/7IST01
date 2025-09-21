'use server';

/**
 * @fileOverview An AI agent for extracting structured data from a timetable image or document.
 *
 * - extractTimetable - A function that handles the timetable extraction process.
 * - ExtractTimetableInput - The input type for the extractTimetable function.
 * - ExtractTimetableOutput - The return type for the extractTimetable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const daysOfWeekMap: { [key: string]: number } = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 0,
};

const SubjectSchema = z.object({
    name: z.string().describe('The name of the subject or course.'),
    expectedCheckIn: z.string().describe("The start time of the class in HH:mm format."),
    expectedCheckOut: z.string().describe("The end time of the class in HH:mm format."),
    totalClasses: z.number().describe('The total number of classes for the subject in the semester. If not specified, estimate a reasonable number like 20 or 25.'),
    dayOfWeek: z.string().describe('The day of the week for the class (e.g., "Monday", "Tuesday").'),
});

const ExtractTimetableInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "An image (JPEG, PNG) or a PDF file of a timetable, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTimetableInput = z.infer<typeof ExtractTimetableInputSchema>;

const ExtractTimetableOutputSchema = z.object({
    subjects: z.array(SubjectSchema)
});
export type ExtractTimetableOutput = z.infer<typeof ExtractTimetableOutputSchema>;


export async function extractTimetable(
  input: ExtractTimetableInput
): Promise<ExtractTimetableOutput> {
  const result = await extractTimetableFlow(input);
  
  const processedSubjects = result.subjects.map(subject => {
      const dayNumber = daysOfWeekMap[subject.dayOfWeek.toLowerCase()];
      return {
          ...subject,
          dayOfWeek: dayNumber !== undefined ? dayNumber : 1, 
      }
  });

  return { subjects: processedSubjects };
}

const prompt = ai.definePrompt({
  name: 'extractTimetablePrompt',
  input: {schema: ExtractTimetableInputSchema},
  output: {schema: ExtractTimetableOutputSchema},
  prompt: `You are an expert at parsing and extracting structured information from timetable images or documents for students.

Analyze the provided file and extract all the subjects listed. For each subject, identify the following details:
- name: The name of the subject.
- expectedCheckIn: The start time of the class, formatted as HH:mm.
- expectedCheckOut: The end time of the class, formatted as HH:mm.
- totalClasses: The total number of classes scheduled for this subject. If not explicitly mentioned, make a reasonable estimate (e.g., 20).
- dayOfWeek: The day of the week the class occurs on (e.g., "Monday").

Return the extracted information as a structured JSON object.

File: {{media url=fileDataUri}}`,
});

const extractTimetableFlow = ai.defineFlow(
  {
    name: 'extractTimetableFlow',
    inputSchema: ExtractTimetableInputSchema,
    outputSchema: ExtractTimetableOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
