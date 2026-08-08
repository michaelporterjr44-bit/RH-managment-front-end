import React from 'react';
import { InterviewStatus } from '@/types/recruitment/interview';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: InterviewStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  [InterviewStatus.SCHEDULED]: {
    label: 'Planifié',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: <Clock size={12} />,
  },
  [InterviewStatus.COMPLETED]: {
    label: 'Terminé',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 size={12} />,
  },
  [InterviewStatus.CANCELLED]: {
    label: 'Annulé',
    className: 'bg-red-50 text-red-600 border-red-200',
    icon: <XCircle size={12} />,
  },
};

const sizeClasses = {
  sm: 'text-[10px] px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-2',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center font-600 rounded-full border ${config.className} ${sizeClasses[size]}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}