/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
// Try to use the named database, but fallback to default if needed
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Validate Connection to Firestore
async function testConnection() {
  try {
    // Attempt to fetch a non-existent doc to test connectivity
    await getDocFromServer(doc(db, '_internal_', 'connection_test'));
    console.log("Firestore connection established successfully.");
    
    // Try to seed a test incident to verify write permissions
    await setDoc(doc(db, 'incidents', 'test-incident'), {
      incidentTitle: 'Test Connectivity Incident',
      incidentSeverity: 'Low',
      status: 'Open',
      reportedBy: 'system',
      createdAt: serverTimestamp(),
      detectionMethod: 'System Check'
    });
    console.log("Seed data written successfully.");
  } catch (error) {
    console.error("Firestore connectivity/seed test failed:", error);
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client appears to be offline.");
    }
  }
}

testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: 'guest-user',
      email: 'analyst@phishguard.ai',
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
