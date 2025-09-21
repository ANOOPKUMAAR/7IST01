'use server';

/**
 * @fileOverview An AI agent for extracting structured faculty data from a file.
 *
 * - extractFaculty - A function that handles the faculty data extraction process.
 * - ExtractFacultyInput - The input type for the extractFaculty function.
 * - ExtractFacultyOutput - The return type for the extractFaculty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FacultySchema = z.object({
    name: z.string().describe("The full name of the faculty member."),
    email: z.string().email().describe("The faculty member's email address."),
    phone: z.string().optional().describe("The faculty member's phone number."),
    department: z.string().describe("The department the faculty member belongs to (e.g., Computer Science)."),
    designation: z.string().describe("The faculty member's designation (e.g., Professor, Assistant Professor)."),
});

const ExtractFacultyInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A file (CSV, TXT, XLSX) containing a list of faculty, as a data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractFacultyInput = z.infer<typeof ExtractFacultyInputSchema>;

const ExtractFacultyOutputSchema = z.object({
    faculty: z.array(FacultySchema)
});
export type ExtractFacultyOutput = z.infer<typeof ExtractFacultyOutputSchema>;


export async function extractFaculty(
  input: ExtractFacultyInput
): Promise<ExtractFacultyOutput> {
  return extractFacultyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractFacultyPrompt',
  input: {schema: ExtractFacultyInputSchema},
  output: {schema: ExtractFacultyOutputSchema},
  prompt: `You are an expert at parsing and extracting structured information from various file formats containing faculty member data.

Analyze the provided file (e.g., CSV, TXT, Excel) and extract all the faculty members listed. The file may contain headers or be simple comma-separated values. Identify the following details for each person. All fields are required except 'phone'.

- name: The faculty member's full name.
- email: The faculty member's email address.
- phone: The phone number (optional).
- department: The department they belong to.
- designation: Their job title or designation (e.g., Professor, Head of Department).

If the file is a CSV, the columns might be in any order. Match them based on likely column headers (e.g., 'Full Name', 'Faculty Name' for name; 'Email Address' for email). If there are no headers, assume the order: name, email, phone, department, designation.

Return the extracted information as a structured JSON object.

File: {{media url=fileDataUri}}`,
});

const extractFacultyFlow = ai.defineFlow(
  {
    name: 'extractFacultyFlow',
    inputSchema: ExtractFacultyInputSchema,
    outputSchema: ExtractFacultyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
