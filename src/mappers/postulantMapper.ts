import { Postulant } from "@/types/recruitment/applicant";
import { InterviewTestScheduling } from "@/types/recruitment/interview";
import CalendarEventBubble from "@/app/interview/interview-calendar/components/CalendarEventBubble";

export const mapPostulant = (data: any): Postulant => {
    return {
        ...data,
        decision: mapStatueToDecision(data.statue),
    };
};

const mapStatueToDecision = (statue: string) => {
    switch (statue) {
        case "validate":
        case "hired":
            return "accepte";
        case "rejected":
            return "refuse";
        default:
            return "en_attente";
    }
};