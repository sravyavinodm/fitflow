import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  deleteUser,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  ActionCodeSettings,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  weight: number;
  height: number;
  bmi: number;
  sleepGoal: number;
  waterGoal: number;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

export const authService = {
  // Sign up with email and password
  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<UserCredential> {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(result.user, { displayName });
      await sendEmailVerification(result.user);

      // Create user profile in Firestore
      await authService.createUserProfile(result.user);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Update last login time
      await updateDoc(doc(db, 'users', result.user.uid), {
        lastLoginAt: new Date(),
      });

      return result;
    } catch (error) {
      throw error;
    }
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user is new
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        // Create user profile in Firestore
        await authService.createUserProfile(result.user);
      } else {
        // Update last login time
        await updateDoc(doc(db, 'users', result.user.uid), {
          lastLoginAt: new Date(),
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      // Configure action code settings for password reset
      const actionCodeSettings: ActionCodeSettings = {
        // URL you want to redirect back to after password reset
        // This should be your app's URL where you handle the reset
        url: window.location.origin + '/login',
        // This must be true for email link sign-in
        handleCodeInApp: false,
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(
    user: User,
    updates: Partial<UserProfile>
  ): Promise<void> {
    try {
      await updateProfile(user, updates);
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw error;
    }
  },

  // Get user profile from Firestore
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Create user profile in Firestore
  async createUserProfile(user: User): Promise<UserProfile> {
    try {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || '',
        weight: 0,
        height: 0,
        bmi: 0,
        sleepGoal: 8,
        waterGoal: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      return userProfile;
    } catch (error) {
      throw error;
    }
  },

  // Send email verification
  async sendEmailVerification(user: User): Promise<void> {
    try {
      await sendEmailVerification(user);
    } catch (error) {
      throw error;
    }
  },

  // Delete user account and all associated data
  async deleteAccount(user: User): Promise<void> {
    try {
      const userId = user.uid;

      // Delete all user data from Firestore collections
      const collections = ['users', 'dailyEntries', 'goals', 'reminders', 'chatHistory', 'notifications'];
      
      for (const collectionName of collections) {
        if (collectionName === 'users') {
          // Delete user profile document
          await deleteDoc(doc(db, 'users', userId));
        } else {
          // Delete all documents where userId matches
          const q = query(collection(db, collectionName), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          
          const deletePromises = querySnapshot.docs.map(docSnapshot => 
            deleteDoc(docSnapshot.ref)
          );
          
          await Promise.all(deletePromises);
        }
      }

      // Delete user from Firebase Auth
      await deleteUser(user);
    } catch (error) {
      throw error;
    }
  },
};
