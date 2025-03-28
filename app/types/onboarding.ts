export interface OnboardingFormData {
  name?: string;
  email?: string;
  phone: string;
  grade: string;
  gpa: string;
  gpaType: string;
  dreamSchool: string;
  major: string;
  satScore: string;
  actScore: string;
  strongSubjects: string[];
  weakSubjects: string[];
  regularCourses: string[];
  apCourses: string[];
}

export interface QuestionAnswer {
  questionNumber: number;
  answer: string;
}

export interface UserProfile extends OnboardingFormData {
  id: string;
  questionsAsked: number;
  questionsLeft: number;
  answers?: QuestionAnswer[];
  honors?: string[];
} 