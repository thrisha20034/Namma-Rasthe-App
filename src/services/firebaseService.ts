/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Report, UserProfile } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const firebaseService = {
  async submitReport(report: Omit<Report, 'id' | 'ticketId' | 'status' | 'timestamp' | 'upvotes'>) {
    const ticketId = `TRA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newReport: Omit<Report, 'id'> = {
      ...report,
      ticketId,
      status: 'submitted',
      timestamp: Date.now(),
      upvotes: 0,
    };
    
    try {
      const docRef = await addDoc(collection(db, 'reports'), newReport);
      return { id: docRef.id, ...newReport } as Report;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reports');
      throw error;
    }
  },

  async getUserReports(userId: string) {
    try {
      const q = query(
        collection(db, 'reports'), 
        where('userId', '==', userId), 
        orderBy('timestamp', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `reports?userId=${userId}`);
      throw error;
    }
  },

  onNearbyReports(callback: (reports: Report[]) => void) {
    try {
      const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'), limit(15));
      return onSnapshot(q, (snapshot) => {
        const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
        callback(reports);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'reports');
      });
    } catch (error) {
       handleFirestoreError(error, OperationType.LIST, 'reports');
       throw error;
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { uid: userId, ...userDoc.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
      throw error;
    }
  }
};

