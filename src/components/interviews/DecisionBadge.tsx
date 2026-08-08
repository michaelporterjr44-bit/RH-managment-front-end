import React from 'react';

interface DecisionBadgeProps {
  decision: string; 
}

const decisionConfig: Record<string, { label: string; className: string }> = {
  VALIDATE: {
    label: "Validé",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  HIRED: {
    label: "Recruté",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  REJECTED: {
    label: "Refusé",
    className: "bg-red-50 text-red-600 border-red-200",
  },
};

export default function DecisionBadge({ decision }: DecisionBadgeProps) {
  const config = decisionConfig[decision];
  return (
    <span className={`inline-flex items-center text-xs font-600 px-2 py-1 rounded-full border ${config.className}`}>
      {config.label}
    </span>
  );
}