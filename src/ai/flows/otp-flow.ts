'use server';

/**
 * @fileOverview An AI agent for generating a one-time password (OTP).
 *
 * - generateOtp - A function that generates a 6-digit OTP and a simulated SMS message.
 * - GenerateOtpOutput - The return type for the generateOtp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOtpOutputSchema = z.object({
    otp: z.string().length(6).describe('The 6-digit one-time password.'),
    message: z.string().describe('The simulated SMS message containing the OTP.'),
});
export type GenerateOtpOutput = z.infer<typeof GenerateOtpOutputSchema>;

export async function generateOtp(): Promise<GenerateOtpOutput> {
    return generateOtpFlow();
}

const prompt = ai.definePrompt({
    name: 'generateOtpPrompt',
    output: {schema: GenerateOtpOutputSchema},
    prompt: `You are a security system. Your task is to generate a secure 6-digit one-time password (OTP) for verifying a user's identity.

Generate a random 6-digit number to be used as the OTP.

Then, create a standard SMS message that would be sent to the user, containing the generated OTP. The message should clearly state the OTP and that it is for changing the security code on the WiTrack app.

Example OTP: 123456
Example Message: Your OTP for changing the security code on WiTrack is 123456. It is valid for 5 minutes.
`,
});

const generateOtpFlow = ai.defineFlow(
  {
    name: 'generateOtpFlow',
    outputSchema: GenerateOtpOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
