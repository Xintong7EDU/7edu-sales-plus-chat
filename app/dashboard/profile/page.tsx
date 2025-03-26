'use client';

import { useUser } from '../../lib/context/UserContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UserProfile } from '../../types/onboarding';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Skeleton } from '../../../components/ui/skeleton';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';

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
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no profile exists
  if (!userProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Profile</CardTitle>
          <CardDescription>Complete onboarding to see your profile.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="mb-4">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarFallback className="bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12 text-muted-foreground">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="text-lg font-medium mb-2">No Profile Information</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">You haven't completed the onboarding process yet. Please complete it to create your profile.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/onboarding/form">Complete Onboarding</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // At this point, userProfile is guaranteed to be defined
  const profile = userProfile as UserProfile;

  // Format subjects as comma-separated strings
  const strongSubjects = profile.strongSubjects?.join(', ') || 'None specified';
  const weakSubjects = profile.weakSubjects?.join(', ') || 'None specified';
  const regularCourses = profile.regularCourses?.join(', ') || 'None specified';
  const apCourses = profile.apCourses?.join(', ') || 'None specified';

  const progressPercentage = Math.round((profile.questionsAsked / (profile.questionsAsked + profile.questionsLeft) * 100) || 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Student Profile</CardTitle>
        <CardDescription>Personal details and academic information.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid divide-y">
          <ProfileItem label="Full name" value={profile.name || 'Not specified'} />
          <ProfileItem label="Email address" value={profile.email || 'Not specified'} />
          <ProfileItem label="Phone number" value={profile.phone || 'Not specified'} />
          <ProfileItem label="Current grade" value={profile.grade || 'Not specified'} />
          <ProfileItem 
            label="GPA" 
            value={profile.gpa ? `${profile.gpa} (${profile.gpaType || 'Not specified'})` : 'Not specified'} 
          />
          <ProfileItem label="Dream school" value={profile.dreamSchool || 'Not specified'} />
          <ProfileItem label="Intended major" value={profile.major || 'Not specified'} />
          <ProfileItem 
            label="Test scores" 
            value={
              <div className="space-y-1">
                {profile.satScore ? (
                  <Badge variant="outline" className="mr-2">SAT: {profile.satScore}</Badge>
                ) : (
                  <Badge variant="outline" className="bg-muted/50 mr-2">SAT: Not taken</Badge>
                )}
                {profile.actScore ? (
                  <Badge variant="outline">ACT: {profile.actScore}</Badge>
                ) : (
                  <Badge variant="outline" className="bg-muted/50">ACT: Not taken</Badge>
                )}
              </div>
            } 
          />
          <ProfileItem label="Strong subjects" value={strongSubjects} />
          <ProfileItem label="Weak subjects" value={weakSubjects} />
          <ProfileItem label="Regular courses" value={regularCourses} />
          <ProfileItem label="AP courses" value={apCourses} />
          <ProfileItem 
            label="Questions progress" 
            value={
              <div className="space-y-2 w-full">
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {profile.questionsAsked} questions completed, {profile.questionsLeft} remaining
                </p>
              </div>
            } 
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for profile items
function ProfileItem({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 p-4 items-center">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="col-span-2 text-sm">{value}</div>
    </div>
  );
} 