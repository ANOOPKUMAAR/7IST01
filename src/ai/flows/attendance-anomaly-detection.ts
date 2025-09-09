'use server';

/**
 * @fileOverview An AI agent for detecting unusual attendance patterns.
 *
 * - detectAttendanceAnomaly - A function that detects anomalies in attendance records.
 * - DetectAttendanceAnomalyInput - The input type for the detectAttendanceAnomaly function.
 * - DetectAttendanceAnomalyOutput - The return type for the detectAttendanceAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAttendanceAnomalyInputSchema = z.object({
  checkInTime: z
    .string()
    .describe('The check-in time of the user (e.g., 09:00 AM).'),
  checkOutTime: z
    .string()
    .describe('The check-out time of the user (e.g., 05:00 PM).'),
  expectedCheckInTime: z
    .string()
    .describe('The expected check-in time of the user (e.g., 09:00 AM).'),
  expectedCheckOutTime: z
    .string()
    .describe('The expected check-out time of the user (e.g., 05:00 PM).'),
  attendanceHistory: z
    .string()
    .describe(
      'The attendance history of the user, including check-in and check-out times for the past week.'
    ),
});
export type DetectAttendanceAnomalyInput = z.infer<
  typeof DetectAttendanceAnomalyInputSchema
>;

const DetectAttendanceAnomalyOutputSchema = z.object({
  isAnomaly: z
    .boolean()
    .describe(
      'Whether the attendance pattern is unusual or not, based on the user history and provided data.'
    ),
  anomalyReason: z
    .string()
    .describe('The reason why the attendance pattern is considered an anomaly.'),
});
export type DetectAttendanceAnomalyOutput = z.infer<
  typeof DetectAttendanceAnomalyOutputSchema
>;

export async function detectAttendanceAnomaly(
  input: DetectAttendanceAnomalyInput
): Promise<DetectAttendanceAnomalyOutput> {
  return detectAttendanceAnomalyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAttendanceAnomalyPrompt',
  input: {schema: DetectAttendanceAnomalyInputSchema},
  output: {schema: DetectAttendanceAnomalyOutputSchema},
  prompt: `You are an AI assistant specializing in identifying anomalies in user attendance patterns.

You will receive the check-in time, check-out time, expected check-in time, expected check-out time, and attendance history of a user.

Based on this information, determine if the user's current attendance pattern is unusual or not.

Consider factors such as late check-ins, early check-outs, and deviations from their typical attendance history.

Provide a clear explanation of why the attendance pattern is considered an anomaly, if applicable.

Check-in Time: {{{checkInTime}}}
Check-out Time: {{{checkOutTime}}}
Expected Check-in Time: {{{expectedCheckInTime}}}
Expected Check-out Time: {{{expectedCheckOutTime}}}
Attendance History: {{{attendanceHistory}}}

Set the isAnomaly field to true if the attendance pattern is unusual, and provide a detailed explanation in the anomalyReason field.
If it is normal set isAnomaly to false and set anomalyReason to "".`,
});

const detectAttendanceAnomalyFlow = ai.defineFlow(
  {
    name: 'detectAttendanceAnomalyFlow',
    inputSchema: DetectAttendanceAnomalyInputSchema,
    outputSchema: DetectAttendanceAnomalyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
