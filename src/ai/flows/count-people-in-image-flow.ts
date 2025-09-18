'use server';

/**
 * @fileOverview An AI agent for counting people in an image.
 *
 * - countPeopleInImage - A function that counts people in a given image.
 * - CountPeopleInImageInput - The input type for the countPeopleInImage function.
 * - CountPeopleInImageOutput - The return type for the countPeopleInImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CountPeopleInImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a classroom or space with people, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CountPeopleInImageInput = z.infer<typeof CountPeopleInImageInputSchema>;

const CountPeopleInImageOutputSchema = z.object({
  count: z.number().describe('The number of people detected in the image.'),
});
export type CountPeopleInImageOutput = z.infer<typeof CountPeopleInImageOutputSchema>;

export async function countPeopleInImage(
  input: CountPeopleInImageInput
): Promise<CountPeopleInImageOutput> {
  return countPeopleInImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'countPeopleInImagePrompt',
  input: {schema: CountPeopleInImageInputSchema},
  output: {schema: CountPeopleInImageOutputSchema},
  prompt: `You are an expert at analyzing images and counting the number of people present.

Analyze the provided image and return the total count of individuals visible.

Image: {{media url=imageDataUri}}`,
});

const countPeopleInImageFlow = ai.defineFlow(
  {
    name: 'countPeopleInImageFlow',
    inputSchema: CountPeopleInImageInputSchema,
    outputSchema: CountPeopleInImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
