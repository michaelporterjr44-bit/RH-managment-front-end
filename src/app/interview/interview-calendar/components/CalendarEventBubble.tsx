'use client';

import React from 'react';
import { InterviewTestScheduling } from '@/types/recruitment/interview';
import { InterviewStatus } from '@/types/recruitment/interview';
import { format } from 'date-fns';

interface EventBubbleProps {
  event: {
    resource: InterviewTestScheduling;
    title: string;
    start: Date;
    end: Date;
  };
}

export default function CalendarEventBubble({ event }: EventBubbleProps) {
  const interview = event.resource;
  const isTest = interview.interviewType === 'TEST';
  const status = interview.status as InterviewStatus;

  const timeStr = format(event.start, 'HH:mm');
  const candidateName = `${interview.postulant.prenom} ${interview.postulant.nom}`;
  const campRef = interview.campagne.ref;

  let bgColor = '';

  switch (status) {
    case InterviewStatus.CANCELLED:
      bgColor = 'bg-red-400';
      break;
    case InterviewStatus.COMPLETED:
      bgColor = 'bg-green-600';
      break;
    case InterviewStatus.SCHEDULED:
    default:
      bgColor = isTest ? 'bg-purple-500' : 'bg-blue-500';
      break;
  }

  return (
    <div
      className={`h-full w-full p-1.5 rounded-md gap-1 text-white overflow-hidden flex flex-col ${bgColor}`}
      title={`${timeStr} — ${candidateName} (${campRef})`}
    >
      <div className="flex items-center gap-1 min-w-0">
        <span className="text-[10px] font-700 opacity-90 flex-shrink-0">{timeStr}</span>
        <span className="text-[10px] font-500 truncate">{candidateName}</span>
      </div>
      <span className="text-[9px] opacity-75 truncate font-500">{campRef}</span>
    </div>
  );
}