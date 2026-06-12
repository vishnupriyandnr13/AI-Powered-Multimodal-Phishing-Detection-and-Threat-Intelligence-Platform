/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type CaseStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type DetectionMethod = 'Random Forest' | 'NLP' | 'CNN' | 'Multimodal';

export interface PhishingIncident {
  id: string;
  incidentTitle: string;
  detectionConfidenceScore: number;
  detectionMethod: string;
  incidentSeverity: RiskLevel;
  actionTaken?: string;
  alertChannel?: string;
  communicationType: 'Email' | 'Website' | 'Message';
  detectionTimestamp: string;
  emailSenderAddress?: string;
  suspiciousUrl?: string;
  isAutomatedResponse?: boolean;
  status: CaseStatus;
  description?: string;
  urgency?: number;
  reportedBy: string;
  aiRiskScore?: number;
}

export interface ThreatFeed {
  id: string;
  feedName: string;
  feedSource: string;
  feedType: string;
  active: boolean;
  confidenceLevel: number;
  dateLastUpdated: string;
  maliciousIpsCount: number;
}

export interface DetectionModel {
  id: string;
  modelName: string;
  algorithmType: string;
  version: string;
  accuracy: number;
  f1Score: number;
  activeStatus: boolean;
  lastTrained: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: 'IT Manager' | 'Security Analyst' | 'Data Scientist' | 'System Administrator' | 'Network Engineer' | 'Compliance Officer' | 'admin';
  department?: string;
  lastLogin?: string;
}
