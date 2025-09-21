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

const getHeadcountFlow = ai.defineFlow(
  {
    name: 'getHeadcountFlow',
    inputSchema: GetHeadcountInputSchema,
    outputSchema: GetHeadcountOutputSchema,
  },
  async ({ totalStudentsInClass }) => {
    // Generate a realistic headcount: a random integer between 85% and 95% of the total students.
    const min = Math.floor(totalStudentsInClass * 0.85);
    const max = Math.floor(totalStudentsInClass * 0.95);
    const headcount = Math.floor(Math.random() * (max - min + 1)) + min;
    
    return {
      headcount: Math.min(headcount, totalStudentsInClass) // Ensure headcount doesn't exceed total.
    };
  }
);
