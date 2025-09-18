'use server';

/**
 * @fileOverview An AI agent for counting people in an image from the camera.
 *
 * - getCameraHeadcount - A function that counts people in a given image.
 * - GetCameraHeadcountInput - The input type for the getCameraHeadcount function.
 * - GetCameraHeadcountOutput - The return type for the getCameraHeadcount function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCameraHeadcountInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a classroom or space with people, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GetCameraHeadcountInput = z.infer<typeof GetCameraHeadcountInputSchema>;

const GetCameraHeadcountOutputSchema = z.object({
  count: z.number().describe('The number of people detected in the image.'),
});
export type GetCameraHeadcountOutput = z.infer<typeof GetCameraHeadcountOutputSchema>;

export async function getCameraHeadcount(
  input: GetCameraHeadcountInput
): Promise<GetCameraHeadcountOutput> {
  return getCameraHeadcountFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCameraHeadcountPrompt',
  input: {schema: GetCameraHeadcountInputSchema},
  output: {schema: GetCameraHeadcountOutputSchema},
  prompt: `You are an expert at analyzing images and counting the number of people present.

Analyze the provided image and return the total count of individuals visible.

Image: {{media url=imageDataUri}}`,
});

const getCameraHeadcountFlow = ai.defineFlow(
  {
    name: 'getCameraHeadcountFlow',
    inputSchema: GetCameraHeadcountInputSchema,
    outputSchema: GetCameraHeadcountOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
