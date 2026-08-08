import { Postulant } from "./applicant";
import { Campagne } from "./campaign";

export enum InterviewStatus {
    SCHEDULED = "SCHEDULED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}

export interface InterviewTestScheduling {
    id: string;
    postulant: Postulant;
    start: string;
    endInterview: string;
    interviewType: string;

    reminderDays?: number;
    reminderHours?: number;
    reminderMinutes?: number;

    reminderDaySent: boolean;
    reminderHourSent: boolean;
    reminderMinuteSent: boolean;

    status: InterviewStatus;

    campagne: Campagne;

    title?: string;
    description?: string;
    physicalLocation?: string;
    callLinkMeeting?: string;
}
