import { config } from 'dotenv';
config();

import '@/ai/flows/attendance-anomaly-detection.ts';
import '@/ai/flows/extract-timetable-flow.ts';
import '@/ai/flows/get-headcount-flow.ts';
import '@/ai/flows/count-people-in-image-flow.ts';
import '@/ai/flows/get-camera-headcount-flow.ts';
import '@/ai/flows/extract-classes-flow.ts';
