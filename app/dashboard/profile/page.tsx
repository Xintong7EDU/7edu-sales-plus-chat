'use client';

import { useUser } from '../../lib/context/UserContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UserProfile } from '../../types/onboarding';

export default function ProfilePage() {
  const { userProfile } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Allow a short delay for loading from localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-green-500 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no profile exists
  if (!userProfile) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-semibold text-gray-900">Student Profile</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Complete onboarding to see your profile.</p>
        </div>
        <div className="border-t border-gray-200 text-center py-12">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16 text-gray-300 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Information</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't completed the onboarding process yet. Please complete it to create your profile.</p>
          <Link 
            href="/onboarding/form" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Complete Onboarding
          </Link>
        </div>
      </div>
    );
  }

  // At this point, userProfile is guaranteed to be defined
  const profile = userProfile as UserProfile;

  // Format subjects as comma-separated strings
  const strongSubjects = profile.strongSubjects?.join(', ') || 'None specified';
  const weakSubjects = profile.weakSubjects?.join(', ') || 'None specified';
  const regularCourses = profile.regularCourses?.join(', ') || 'None specified';
  const apCourses = profile.apCourses?.join(', ') || 'None specified';

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-2xl font-semibold text-gray-900">Student Profile</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and academic information.</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.name || 'Not specified'}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.email || 'Not specified'}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Phone number</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.phone || 'Not specified'}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Current grade</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.grade || 'Not specified'}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">GPA</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {profile.gpa ? `${profile.gpa} (${profile.gpaType || 'Not specified'})` : 'Not specified'}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Dream school</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.dreamSchool || 'Not specified'}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Intended major</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{profile.major || 'Not specified'}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Test scores</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {profile.satScore ? `SAT: ${profile.satScore}` : 'SAT: Not taken'}<br />
              {profile.actScore ? `ACT: ${profile.actScore}` : 'ACT: Not taken'}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Strong subjects</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{strongSubjects}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Weak subjects</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{weakSubjects}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Regular courses</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{regularCourses}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">AP courses</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{apCourses}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Questions progress</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${profile.questionsAsked / (profile.questionsAsked + profile.questionsLeft) * 100}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {profile.questionsAsked} questions completed, {profile.questionsLeft} remaining
              </p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
} 