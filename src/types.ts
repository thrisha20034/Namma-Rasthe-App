/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'submitted' | 'under-review' | 'in-progress' | 'resolved';
export type IssueType = 'pothole' | 'road-damage' | 'streetlight' | 'garbage' | 'drainage' | 'water-leak' | 'other';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Report {
  id: string;
  userId: string;
  type: IssueType;
  severity: Severity;
  description: string;
  imageUrl: string;
  location: Location;
  timestamp: number;
  status: Status;
  ticketId: string;
  upvotes: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  points: number;
  badges: string[];
  joinedAt: number;
}
