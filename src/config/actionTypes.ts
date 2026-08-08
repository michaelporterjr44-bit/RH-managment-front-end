import { ActionType, ActionTypeConfig } from "@/types/recruitment/historical";

export const actionTypeConfig: Record<ActionType, ActionTypeConfig> = {
  [ActionType.READ]: {
    label: 'Consultation',
    color: 'text-blue-600',
    bgColor: 'bg-blue-200',
    icon: 'eye'
  },
  [ActionType.CREATE]: {
    label: 'Creation',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: 'plus-circle'
  },
  [ActionType.UPDATE]: {
    label: 'Modification',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    icon: 'edit'
  },
  [ActionType.DELETE]: {
    label: 'Suppression',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: 'trash-2'
  }
};