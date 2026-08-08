import React, { useEffect, useState } from "react";
import CustomCalendar from "./CustomCalendar";
import LeaveDetails from "./LeaveDetails";

import { Leave, ListLeavesParams } from "@/types/leave/leave.types";
import { getLeaves } from "@/api/dashboard/leave/leave";

const CalendarPageContent: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [view, setView] = useState<"list" | "details">("list");

  const [params] = useState<ListLeavesParams>({
    page: 0,
    size: 20,
  });

  const loadLeaves = async () => {
    try {
      const result = await getLeaves(params.page, params.size);
      setLeaves(result.content || []);
    } catch (error) {
      console.error("Erreur chargement congés :", error);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleLeaveClick = (leave: Leave) => {
    setSelectedLeave(leave);
    setView("details");
  };

  const handleBackToList = () => {
    setSelectedLeave(null);
    setView("list");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {view === "list" && (
        <CustomCalendar leaves={leaves} onLeaveClick={handleLeaveClick} />
      )}

      {view === "details" && selectedLeave && (
        <LeaveDetails
          leave={selectedLeave}
          onBack={handleBackToList}
          onUpdate={(updatedLeave) => {
            setLeaves((prev) =>
              prev.map((l) => (l.id === updatedLeave.id ? updatedLeave : l))
            );
            setSelectedLeave(updatedLeave);
          }}
        />
      )}
    </div>
  );
};

export default CalendarPageContent;