import React from 'react';
import { MessageSquare, FlaskConical } from 'lucide-react';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-[10px] px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-2',
};

export default function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const isTest = type === 'TEST';
  return (
    <span
      className={`inline-flex items-center font-600 rounded-full border ${
        isTest
          ? 'bg-purple-50 text-purple-700 border-purple-200' :'bg-green-50 text-green-700 border-green-200'
      } ${sizeClasses[size]}`}
    >
      {isTest ? <FlaskConical size={12} /> : <MessageSquare size={12} />}
      {isTest ? 'Test' : 'Entretien'}
    </span>
  );
}