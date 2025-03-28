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
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Skeleton } from '../../../components/ui/skeleton';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { ScrollArea } from '../../../components/ui/scroll-area';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  TooltipItem
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function ProfilePage() {
  const { userProfile } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);

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
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">You haven&apos;t completed the onboarding process yet. Please complete it to create your profile.</p>
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
  
  // Create radar chart data based on student's profile metrics
  // Calculate values for each of the 6 metrics on a scale of 0-5

  // 1. ACADEMICS
  // Get the GPA as a number for radar chart (default to 3.0 if not available)
  const gpaValue = profile.gpa ? parseFloat(profile.gpa) : 3.0;
  // Scale GPA to a value between 0-5 for consistency with other metrics
  const scaledGpa = Math.min(gpaValue * (5/4), 5);
  
  // Calculate curriculum rigor based on AP courses
  const apRigor = Math.min((profile.apCourses?.length || 0) / 2, 5); // Scale AP count, max of 5
  
  // Calculate total academic score (combination of GPA and curriculum rigor)
  const academicsScore = ((scaledGpa * 0.6) + (apRigor * 0.4));

  // 2. TEST PREP
  // Convert SAT score to a value between 0-5 (assuming max score of 1600)
  const satValue = profile.satScore ? parseInt(profile.satScore) : 0;
  const scaledSat = satValue ? (satValue / 1600) * 5 : 0;
  
  // Convert ACT score to a value between 0-5 (assuming max score of 36)
  const actValue = profile.actScore ? parseInt(profile.actScore) : 0;
  const scaledAct = actValue ? (actValue / 36) * 5 : 0;
  
  // Use the better of SAT or ACT for the test prep score
  const testPrepScore = Math.max(scaledSat, scaledAct);

  // 3. COMMUNITY INVOLVEMENT
  // This would ideally come from the answers to relevant questions
  // For now, we'll use a placeholder calculation based on available data
  // In a real implementation, this would use data from answers or other profile fields
  // Analyze answers for community involvement keywords
  const communityInvolvementScore = profile.answers
    ? Math.min(profile.answers.reduce((score, qa) => {
        const answer = qa.answer.toLowerCase();
        // Look for keywords related to community involvement
        if (answer.includes('volunteer') || 
            answer.includes('community') || 
            answer.includes('service') ||
            answer.includes('leadership') ||
            answer.includes('president') ||
            answer.includes('founder') ||
            answer.includes('organization')) {
          return score + 1;
        }
        return score;
      }, 0), 5)
    : 0;

  // 4. CHARACTER BUILDING VIA EXPERIENTIAL LEARNING
  // Similar to community involvement, we'll analyze answers for relevant keywords
  const experientialLearningScore = profile.answers
    ? Math.min(profile.answers.reduce((score, qa) => {
        const answer = qa.answer.toLowerCase();
        // Look for keywords related to experiential learning
        if (answer.includes('research') || 
            answer.includes('project') || 
            answer.includes('work experience') ||
            answer.includes('job') ||
            answer.includes('intern') ||
            answer.includes('summer') ||
            answer.includes('program')) {
          return score + 1;
        }
        return score;
      }, 0), 5)
    : 0;

  // 5. HONORS AND AWARDS
  // Calculate score based on honors field and relevant keywords in answers
  const honorsBaseScore = profile.honors ? Math.min(profile.honors.length, 4) : 0;
  const honorsAnswersScore = profile.answers
    ? Math.min(profile.answers.reduce((score, qa) => {
        const answer = qa.answer.toLowerCase();
        // Look for keywords related to honors and awards
        if (answer.includes('award') || 
            answer.includes('honor') || 
            answer.includes('recognition') ||
            answer.includes('prize') ||
            answer.includes('medal') ||
            answer.includes('certificate') ||
            answer.includes('scholarship') ||
            answer.includes('won')) {
          return score + 1;
        }
        return score;
      }, 0), 5)
    : 0;
  
  // Combine both scores, but cap at 5
  const honorsAndAwardsScore = Math.min(honorsBaseScore + (honorsAnswersScore * 0.5), 5);

  // 6. SPECIAL TALENTS
  // Analyze answers for special talents and skills
  const specialTalentsScore = profile.answers
    ? Math.min(profile.answers.reduce((score, qa) => {
        const answer = qa.answer.toLowerCase();
        // Look for keywords related to special talents
        if (answer.includes('music') || 
            answer.includes('instrument') || 
            answer.includes('art') ||
            answer.includes('dance') ||
            answer.includes('sing') ||
            answer.includes('perform') ||
            answer.includes('sport') ||
            answer.includes('athlete') ||
            answer.includes('team') ||
            answer.includes('player') ||
            answer.includes('varsity')) {
          return score + 1;
        }
        return score;
      }, 0), 5)
    : 0;

  const radarData = {
    labels: [
      'Academics', 
      'Test Prep', 
      'Community Involvement', 
      'Experiential Learning',
      'Honors & Awards',
      'Special Talents'
    ],
    datasets: [
      {
        label: 'College Admissions Profile',
        data: [
          academicsScore, 
          testPrepScore, 
          communityInvolvementScore, 
          experientialLearningScore,
          honorsAndAwardsScore,
          specialTalentsScore
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointHoverRadius: 5,
      }
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function(tooltipItems: TooltipItem<'radar'>[]) {
            const titles: Record<string, string> = {
              'Academics': 'Academic Performance & Rigor',
              'Test Prep': 'Standardized Test Performance',
              'Community Involvement': 'Service & Community Leadership',
              'Experiential Learning': 'Character Building & Experiences',
              'Honors & Awards': 'Recognitions & Achievements',
              'Special Talents': 'Distinctive Skills & Abilities'
            };
            
            return titles[tooltipItems[0].label] || tooltipItems[0].label;
          },
          label: function(context: TooltipItem<'radar'>) {
            const score = (context.raw as number).toFixed(1);
            const metrics = [
              `${context.dataset.label}: ${score}/5`,
              '-------------------'
            ];
            
            // Add detailed explanation based on which metric
            switch(context.label) {
              case 'Academics':
                metrics.push('Factors included:');
                metrics.push(`• GPA: ${profile.gpa || 'Not specified'}`);
                metrics.push(`• AP Courses: ${profile.apCourses?.length || 0}`);
                metrics.push(`• Regular Courses: ${profile.regularCourses?.length || 0}`);
                break;
              case 'Test Prep':
                metrics.push('Best scores from:');
                if (profile.satScore) metrics.push(`• SAT: ${profile.satScore}`);
                if (profile.actScore) metrics.push(`• ACT: ${profile.actScore}`);
                if (!profile.satScore && !profile.actScore) metrics.push('• No test scores provided');
                break;
              case 'Community Involvement':
                metrics.push('Based on volunteering, leadership,');
                metrics.push('and community service activities');
                metrics.push('mentioned in your answers.');
                break;
              case 'Experiential Learning':
                metrics.push('Based on research, work experience,');
                metrics.push('internships, and projects');
                metrics.push('mentioned in your answers.');
                break;
              case 'Honors & Awards':
                metrics.push('Based on awards, scholarships,');
                metrics.push('and recognitions mentioned');
                metrics.push('in your answers.');
                if (profile.honors && profile.honors.length > 0) {
                  metrics.push('');
                  metrics.push('Your honors include:');
                  profile.honors.forEach(honor => {
                    metrics.push(`• ${honor}`);
                  });
                }
                break;
              case 'Special Talents':
                metrics.push('Based on athletics, music, arts,');
                metrics.push('and other special skills mentioned');
                metrics.push('in your answers.');
                break;
            }
            
            return metrics;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // Sort answers by question number if they exist
  const sortedAnswers = profile.answers 
    ? [...profile.answers].sort((a, b) => a.questionNumber - b.questionNumber) 
    : [];

  return (
    <div className="space-y-6">
      {/* Top section: Radar chart and profile details side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>College Admissions Profile</CardTitle>
            <CardDescription>A holistic view of your strengths for college applications</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-4">
            <div className="w-full h-[400px]">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <p>This radar chart visualizes six key admissions factors on a scale of 0-5.</p>
          </CardFooter>
        </Card>

        {/* Student Profile Details */}
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
                label="Honors & Awards" 
                value={
                  profile.honors && profile.honors.length > 0 
                    ? profile.honors.map((honor, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-1">
                          {honor}
                        </Badge>
                      ))
                    : 'None specified'
                } 
              />
              <ProfileItem 
                label="Questions progress" 
                value={
                  <div className="space-y-2 w-full">
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        {profile.questionsAsked} questions completed, {profile.questionsLeft} remaining
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowQuestions(!showQuestions)}
                        className="text-xs h-6 px-2"
                      >
                        {showQuestions ? "Hide Details" : "Show Details"}
                      </Button>
                    </div>
                  </div>
                } 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions and Answers Section - Conditionally rendered based on showQuestions state */}
      {showQuestions && (
        <Card>
          <CardHeader>
            <CardTitle>Questions & Answers</CardTitle>
            <CardDescription>
              Your responses to assessment questions. These help us better understand your academic needs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedAnswers.length > 0 ? (
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-6">
                  {sortedAnswers.map((qa) => (
                    <div key={qa.questionNumber} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-2 py-1">Q{qa.questionNumber}</Badge>
                        <h3 className="text-sm font-medium">
                          {getQuestionText(qa.questionNumber)}
                        </h3>
                      </div>
                      <div className="pl-8 border-l-2 border-muted-foreground/20 text-sm">
                        {qa.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No Answers Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven&apos;t answered any assessment questions yet. Complete questions to see your responses here.
                </p>
                <Button asChild>
                  <Link href="/dashboard/questions">Answer Questions</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
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

// Helper function to get the question text based on question number
// In a real application, these would come from a database or API
function getQuestionText(questionNumber: number): string {
  const questions: Record<number, string> = {
    1: "What subjects do you find most challenging?",
    2: "How many hours per week do you spend studying outside of class?",
    3: "What are your academic goals for this year?",
    4: "What extracurricular activities are you involved in?",
    5: "How do you prefer to learn new material?",
    6: "What is your biggest academic concern right now?",
    7: "What strategies do you use when preparing for exams?",
    8: "How do you manage your time between schoolwork and other activities?",
    9: "What resources do you typically use when you need help with schoolwork?",
    10: "What colleges or universities are you considering applying to?",
    // Add more questions as needed
  };
  
  return questions[questionNumber] || `Question ${questionNumber}`;
} 