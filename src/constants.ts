/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const THEME = {
  primary: '#1E3A8A',    // Deep Blue
  success: '#10B981',    // Emerald Green
  warning: '#F59E0B',    // Orange
  danger: '#EF4444',     // Red
  background: '#F3F4F6', // Light Gray
  card: '#FFFFFF',
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    muted: '#9CA3AF',
  }
};

export const ISSUE_LABELS: Record<string, string> = {
  pothole: 'Pothole',
  'road-damage': 'Damaged Road',
  streetlight: 'Malfunctioning Streetlight',
  garbage: 'Garbage Accumulation',
  drainage: 'Drainage Issue',
  'water-leak': 'Water Leakage',
  other: 'Other Infrastructure Issue',
};

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
];
