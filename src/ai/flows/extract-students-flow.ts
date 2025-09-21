'use server';

/**
 * @fileOverview An AI agent for extracting structured student data from a file.
 *
 * - extractStudents - A function that handles the student data extraction process.
 * - ExtractStudentsInput - The input type for the extractStudents function.
 * - ExtractStudentsOutput - The return type for the extractStudents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentSchema = z.object({
    name: z.string().describe("The full name of the student."),
    rollNo: z.string().describe("The student's unique roll number or ID."),
    program: z.string().describe("The academic program (e.g., Bachelor of Technology)."),
    branch: z.string().describe("The branch of study (e.g., Computer Science)."),
    department: z.string().describe("The department (e.g., Engineering)."),
    section: z.string().describe("The class section (e.g., A)."),
    phone: z.string().optional().describe("The student's phone number."),
    parentName: z.string().optional().describe("The name of the student's parent or guardian."),
    address: z.string().optional().describe("The student's address."),
});

const ExtractStudentsInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A file (CSV, TXT) containing a list of students, as a data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractStudentsInput = z.infer<typeof ExtractStudentsInputSchema>;

const ExtractStudentsOutputSchema = z.object({
    students: z.array(StudentSchema)
});
export type ExtractStudentsOutput = z.infer<typeof ExtractStudentsOutputSchema>;


export async function extractStudents(
  input: ExtractStudentsInput
): Promise<ExtractStudentsOutput> {
  return extractStudentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractStudentsPrompt',
  input: {schema: ExtractStudentsInputSchema},
  output: {schema: ExtractStudentsOutputSchema},
  prompt: `You are an expert at parsing and extracting structured information from various file formats containing student data.

Analyze the provided file (e.g., CSV, TXT) and extract all the students listed. The file may contain headers or be simple comma-separated values. Identify the following details for each student. All fields are required except for 'phone', 'parentName', and 'address'.

- name: The student's full name.
- rollNo: The unique roll number or student ID.
- program: The academic program.
- branch: The branch of study.
- department: The department.
- section: The class section.
- phone: The phone number (optional).
- parentName: The parent's or guardian's name (optional).
- address: The address (optional).

If the file is a CSV, the columns might be in any order. Match them based on likely column headers (e.g., 'Student Name', 'Full Name' for name; 'Roll Number', 'ID' for rollNo). If there are no headers, assume the order: name, rollNo, program, branch, department, section, phone, parentName, address.

Return the extracted information as a structured JSON object.

File: {{media url=fileDataUri}}`,
});

const extractStudentsFlow = ai.defineFlow(
  {
    name: 'extractStudentsFlow',
    inputSchema: ExtractStudentsInputSchema,
    outputSchema: ExtractStudentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
