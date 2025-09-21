"use server";

import type { AttendanceRecord, Subject } from "@/lib/types";
import { detectAttendanceAnomaly } from "@/ai/flows/attendance-anomaly-detection";

interface CheckOutData {
  checkInTime: string;
  checkOutTime: string;
  subject: Subject;
  history: AttendanceRecord[];
}

export async function checkAttendanceAnomaly({
  checkInTime,
  checkOutTime,
  subject,
  history,
}: CheckOutData) {
  try {
    const historyString = history
      .map(
        (rec) =>
          `Date: ${rec.date}, Check-in: ${new Date(
            rec.checkIn
          ).toLocaleTimeString()}, Check-out: ${
            rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString() : "N/A"
          }`
      )
      .join("\n");

    const result = await detectAttendanceAnomaly({
      checkInTime: new Date(checkInTime).toLocaleTimeString(),
      checkOutTime: new Date(checkOutTime).toLocaleTimeString(),
      expectedCheckInTime: subject.expectedCheckIn,
      expectedCheckOutTime: subject.expectedCheckOut,
      attendanceHistory: historyString || "No previous attendance history.",
    });

    return result;
  } catch (error) {
    console.error("Error detecting attendance anomaly:", error);
    return {
      isAnomaly: false,
      anomalyReason: "Error analyzing attendance.",
    };
  }
}
