import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTicketId(id: string) {
  return `TRA-${id.substring(0, 8).toUpperCase()}`;
}

export function getSeverityColor(severity: string) {
  switch (severity) {
    case 'low': return 'text-blue-600 bg-blue-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'high': return 'text-orange-600 bg-orange-50';
    case 'critical': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}
