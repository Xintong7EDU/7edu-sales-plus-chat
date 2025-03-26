/**
 * UserContext - React Context for managing user profile data throughout the application
 * 
 * This context provides global state management for user information collected during onboarding
 * and updated throughout the user journey.
 * 
 * Used in:
 * - app/layout.tsx: Wraps the entire application with UserProvider
 * - app/onboarding/form/page.tsx: Saves initial user data from onboarding form
 * - app/onboarding/chat/chat.tsx: Accesses and updates user profile during chat interactions
 * - app/onboarding/analysis/analysis.tsx: Retrieves user data for generating educational analysis
 * - app/api/student-analysis/analysisChatRoute.ts: Processes user profile for analysis generation
 * 
 * The context tracks:
 * - Basic user information (name, grade, GPA, dream school)
 * - Question/answer progress
 * - User responses to educational assessment questions
 */

'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { OnboardingFormData, UserProfile } from '../../types/onboarding';

// Define the total number of questions in one place
export const TOTAL_QUESTIONS = 8;

interface UserContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  saveOnboardingData: (data: OnboardingFormData) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load user profile from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          console.log('Loaded user profile from localStorage:', parsedProfile);
          setUserProfile(parsedProfile);
        } catch (e) {
          console.error('Failed to parse user profile from localStorage:', e);
        }
      }
    }
  }, []);

  // Save user profile to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && userProfile) {
      console.log('Saving user profile to localStorage:', userProfile);
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...data });
    }
  };

  const saveOnboardingData = (data: OnboardingFormData) => {
    // Create a new user profile with the onboarding data
    const newProfile: UserProfile = {
      ...data,
      id: Math.random().toString(36).substring(2, 9), // Simple ID generation
      questionsAsked: 0,
      questionsLeft: TOTAL_QUESTIONS, // Use the constant instead of hardcoded value
      answers: [] // Initialize empty answers array
    };
    setUserProfile(newProfile);
  };

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, updateUserProfile, saveOnboardingData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 