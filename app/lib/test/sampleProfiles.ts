import { UserProfile } from '@/app/types/onboarding';

/**
 * Sample student profiles for testing the chat interfaces with enhanced metrics
 * for the six key areas: Academics, Test Prep, Community Involvement,
 * Character Building via Experiential Learning, Honors and Awards, and Special Talents
 */

// Completed profile with all onboarding questions answered - Strong in all areas
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
  apCourses: ['AP Calculus BC', 'AP Computer Science A', 'AP Physics C', 'AP Chemistry'],
  questionsAsked: 8,
  questionsLeft: 0,
  honors: [
    'State Math Olympiad 2nd Place',
    'AP Computer Science Student of the Year',
    'National Merit Scholarship Finalist',
    'School Leadership Award',
    'Regional Soccer Championship MVP'
  ],
  answers: [
    // Special Talents - Athletics
    { questionNumber: 1, answer: 'I play varsity soccer and have been team captain for the last two years. We won the regional championship last season, and I was named MVP.' },
    
    // Special Talents - Arts/Music
    { questionNumber: 2, answer: 'I play piano and have performed in several school concerts. I was selected for the All-State Music Festival last year and have been taking lessons for 10 years.' },
    
    // Other interests/projects
    { questionNumber: 3, answer: 'While I\'m not particularly artistic, I do enjoy photography as a hobby. I\'ve documented several school events and my work was featured in the yearbook.' },
    
    // Community Involvement + Leadership
    { questionNumber: 4, answer: 'I\'m the president of our school\'s Computer Science Club and active in Math Club. I also founded a peer tutoring organization that serves over 50 students in our district.' },
    
    // Community Involvement + Service
    { questionNumber: 5, answer: 'I volunteer teaching coding to middle school students on weekends, about 5 hours per week. I also organized a community service project to build a website for our local food bank, which improved their donation process by 35%.' },
    
    // Character/Personality
    { questionNumber: 6, answer: 'I\'m analytical, detail-oriented, and persistent when solving problems. My teachers often comment on my ability to collaborate with others and lead group projects effectively.' },
    
    // Honors and Awards
    { questionNumber: 7, answer: 'I won 2nd place in the State Math Olympiad and received the AP Computer Science Student of the Year award. I was also awarded a National Merit Scholarship finalist status and received our school\'s Leadership Award.' },
    
    // Character Building via Experiential Learning
    { questionNumber: 8, answer: 'I interned at a local tech startup last summer working on their machine learning algorithms. I\'ve also completed several research projects with my AP Physics teacher, including building a functioning weather station that we use to collect data for the school. I\'m particularly interested in AI and machine learning and have completed several online courses in these subjects.' }
  ]
};

// Partial profile with basic info but incomplete onboarding - Strong in academics and special talents
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
  strongSubjects: ['Biology', 'Chemistry', 'Mathematics'],
  weakSubjects: ['English'],
  regularCourses: ['World History', 'Spanish III', 'English Literature'],
  apCourses: ['AP Biology', 'AP Chemistry'],
  questionsAsked: 5,
  questionsLeft: 3,
  honors: [
    'School Swimming Record - 200m Freestyle',
    'Regional Science Fair Silver Medal',
    'AP Biology Award of Excellence'
  ],
  answers: [
    // Special Talents - Athletics
    { questionNumber: 1, answer: 'I\'m on the school swim team and compete at regional level. I\'ve qualified for state championships twice and hold the school record for the 200m freestyle.' },
    
    // Special Talents - Arts/Music
    { questionNumber: 2, answer: 'No musical activities currently, but I\'m learning digital art and design in my free time.' },
    
    // Other interests/hobbies
    { questionNumber: 3, answer: 'I enjoy drawing scientific illustrations for my biology notes. My biology teacher has used some of my drawings in her class materials.' },
    
    // Community Involvement
    { questionNumber: 4, answer: 'I volunteer at the local hospital twice a month, shadowing healthcare professionals. I\'ve accumulated over 100 service hours there in the past year.' },
    
    // Experiential Learning
    { questionNumber: 5, answer: 'Last summer, I participated in a two-week research program at the university, working on a project about water quality analysis. We published our findings in a student research journal.' }
  ]
};

// Minimal profile with just the required fields - Strong in academics and test prep
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
  actScore: '35',
  strongSubjects: ['Biology', 'Chemistry', 'Mathematics', 'English'],
  weakSubjects: [],
  regularCourses: ['Spanish IV', 'Economics'],
  apCourses: ['AP Biology', 'AP Chemistry', 'AP Calculus BC', 'AP English Literature', 'AP Psychology'],
  questionsAsked: 0,
  questionsLeft: 8,
  // Even though they haven't answered questions yet, we can add some honors for display
  honors: ['National Merit Finalist', 'Presidential Scholar Candidate', 'Science Olympiad Gold Medal'],
  answers: []
}; 