
'use server';

/**
 * @fileOverview An AI agent for simulating an automatic headcount via Wi-Fi.
 *
 * - getHeadcount - A function that returns a simulated headcount for a class.
 * - GetHeadcountInput - The input type for the getHeadcount function.
 * - GetHeadcountOutput - The return type for the getHeadcount function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetHeadcountInputSchema = z.object({
  subjectId: z
    .string()
    .describe('The ID of the subject for which to get the headcount.'),
  totalStudentsInClass: z
    .number()
    .describe('The total number of students enrolled in the class.'),
});
export type GetHeadcountInput = z.infer<typeof GetHeadcountInputSchema>;

const GetHeadcountOutputSchema = z.object({
  headcount: z
    .number()
    .describe('The number of students detected as present.'),
});
export type GetHeadcountOutput = z.infer<typeof GetHeadcountOutputSchema>;

export async function getHeadcount(
  input: GetHeadcountInput
): Promise<GetHeadcountOutput> {
  return getHeadcountFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getHeadcountPrompt',
  input: {schema: GetHeadcountInputSchema},
  output: {schema: GetHeadcountOutputSchema},
  prompt: `You are an AI simulating a Wi-Fi based headcount system for a classroom.

You will receive the subject ID and the total number of students in the class.

Your task is to generate a realistic headcount. The number should be exactly 90% of the total students in the class, rounded down.

Subject ID: {{{subjectId}}}
Total Students in Class: {{{totalStudentsInClass}}}

Return the simulated headcount in the 'headcount' field of the output.`,
});

const getHeadcountFlow = ai.defineFlow(
  {
    name: 'getHeadcountFlow',
    inputSchema: GetHeadcountInputSchema,
    outputSchema: GetHeadcountOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (output) {
      // Ensure the headcount doesn't exceed the total number of students.
      output.headcount = Math.min(output.headcount, input.totalStudentsInClass);
    }
    return output!;
  }
);
