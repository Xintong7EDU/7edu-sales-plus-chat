import { UserProfile } from '@/app/types/onboarding';

/**
 * Sample student profiles for testing the chat interfaces
 */

// Completed profile with all onboarding questions answered
export const completedProfile: UserProfile = {
  id: 'test-completed-profile-123',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '123-456-7890',
  grade: '11',
  gpa: '3.85',
  gpaType: '4.0',
  dreamSchool: 'Stanford University',
  major: 'Computer Science',
  satScore: '1480',
  actScore: '32',
  strongSubjects: ['Mathematics', 'Computer Science', 'Physics'],
  weakSubjects: ['History', 'Spanish'],
  regularCourses: ['English Literature', 'U.S. History'],
  apCourses: ['AP Calculus BC', 'AP Computer Science A', 'AP Physics C'],
  questionsAsked: 8,
  questionsLeft: 0,
  answers: [
    { questionNumber: 1, answer: 'I play varsity soccer and have been team captain for the last two years.' },
    { questionNumber: 2, answer: 'I play piano and have performed in several school concerts.' },
    { questionNumber: 3, answer: 'While I\'m not particularly artistic, I do enjoy photography as a hobby.' },
    { questionNumber: 4, answer: 'I\'m the president of our school\'s Computer Science Club and active in Math Club.' },
    { questionNumber: 5, answer: 'I volunteer teaching coding to middle school students on weekends, about 5 hours per week.' },
    { questionNumber: 6, answer: 'I\'m analytical, detail-oriented, and persistent when solving problems.' },
    { questionNumber: 7, answer: 'I won 2nd place in the State Math Olympiad and received the AP Computer Science Student of the Year award.' },
    { questionNumber: 8, answer: 'I\'m particularly interested in AI and machine learning and have completed several online courses in these subjects.' }
  ]
};

// Partial profile with basic info but incomplete onboarding
export const partialProfile: UserProfile = {
  id: 'test-partial-profile-456',
  name: 'Jamie Smith',
  email: 'jamie.smith@example.com',
  phone: '234-567-8901',
  grade: '10',
  gpa: '3.7',
  gpaType: '4.0',
  dreamSchool: 'MIT',
  major: 'Bioengineering',
  satScore: '',
  actScore: '29',
  strongSubjects: ['Biology', 'Chemistry'],
  weakSubjects: ['English'],
  regularCourses: ['World History', 'Spanish III'],
  apCourses: ['AP Biology'],
  questionsAsked: 3,
  questionsLeft: 5,
  answers: [
    { questionNumber: 1, answer: 'I\'m on the school swim team and compete at regional level.' },
    { questionNumber: 2, answer: 'No musical activities currently.' },
    { questionNumber: 3, answer: 'I enjoy drawing scientific illustrations for my biology notes.' }
  ]
};

// Minimal profile with just the required fields
export const minimalProfile: UserProfile = {
  id: 'test-minimal-profile-789',
  name: 'Taylor Wong',
  email: 'taylor.wong@example.com',
  phone: '345-678-9012',
  grade: '12',
  gpa: '4.0',
  gpaType: '5.0',
  dreamSchool: 'Harvard University',
  major: 'Pre-Med',
  satScore: '1520',
  actScore: '',
  strongSubjects: [],
  weakSubjects: [],
  regularCourses: [],
  apCourses: [],
  questionsAsked: 0,
  questionsLeft: 8,
  answers: []
}; 