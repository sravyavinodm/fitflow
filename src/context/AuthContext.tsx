import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { authService, UserProfile } from '../services/auth';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signup = authService.signUp;
  const login = authService.signIn;
  const signInWithGoogle = authService.signInWithGoogle;
  const logout = authService.signOut;
  const resetPassword = authService.resetPassword;

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (currentUser) {
      await authService.updateUserProfile(currentUser, updates);
      // Reload user profile after update
      try {
        const updatedProfile = await authService.getUserProfile(currentUser.uid);
        if (updatedProfile) {
          setUserProfile(updatedProfile);
        }
      } catch (error) {
        console.error('Error reloading user profile after update:', error);
      }
    }
  };

  const deleteAccount = async () => {
    if (currentUser) {
      await authService.deleteAccount(currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      try {
        console.log('onAuthStateChanged user:', user);
        setCurrentUser(user);
        setError(null);

        if (user) {
          // Fetch user profile from Firestore
          try {
            const profile = await authService.getUserProfile(user.uid);
            if (profile) {
              setUserProfile(profile);
            } else {
              // Profile doesn't exist, create a new one
              console.log('User profile not found, creating new profile for user:', user.uid);
              const newProfile = await authService.createUserProfile(user);
              setUserProfile(newProfile);
            }
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
            // Try to create a new profile if fetch failed
            try {
              console.log('Creating new profile due to fetch error for user:', user.uid);
              const newProfile = await authService.createUserProfile(user);
              setUserProfile(newProfile);
            } catch (createError) {
              console.error('Error creating user profile:', createError);
              setUserProfile(null);
            }
          }
        } else {
          setUserProfile(null);
        }
      } catch (authError) {
        console.error('Auth state change error:', authError);
        setError('Authentication error occurred');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    signup,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    deleteAccount,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div>Loading...</div>
          {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
