'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../lib/context/UserContext';
import Link from 'next/link';
import Header from '@/components/features/Header';
import OnboardingProgressBar from '@/components/onboarding/OnboardingProgressBar';
import {
  User,
  GraduationCap,
  Phone,
  Mail,
  School,
  Award,
  BookOpen,
  Building,
  ArrowRight,
  AlertCircle,
  X,
  Plus,
  Search,
  BookText,
  Check,
  XCircle
} from 'lucide-react';

const universities = [
  { name: 'Harvard University', location: 'Cambridge, MA' },
  { name: 'Stanford University', location: 'Stanford, CA' },
  { name: 'MIT', location: 'Cambridge, MA' },
  { name: 'Yale University', location: 'New Haven, CT' },
  { name: 'Princeton University', location: 'Princeton, NJ' },
  { name: 'Columbia University', location: 'New York, NY' },
  { name: 'University of California, Berkeley', location: 'Berkeley, CA' },
  { name: 'University of California, Los Angeles', location: 'Los Angeles, CA' },
  // Add more universities as needed
];

const majors = [
  'Undecided',
  'Business Administration',
  'Computer Science',
  'Engineering',
  'Biology',
  'Psychology',
  'Economics',
  'English',
  'Political Science',
  'Chemistry',
  'Mathematics',
  'Communications',
  'History',
  'Nursing',
  'Physics',
  'Sociology',
  'Art & Design',
  'Education',
  'Environmental Science',
  'Pre-Med',
  'Pre-Law',
  'Other'
];

// Sample courses for dropdown suggestions
const regularCourses = [
  'Algebra I', 'Algebra II', 'Geometry', 'Pre-Calculus', 'Calculus', 
  'Statistics', 'Biology', 'Chemistry', 'Physics', 'Earth Science',
  'English Literature', 'English Composition', 'World History', 'U.S. History',
  'Economics', 'Government', 'Psychology', 'Sociology', 'Spanish I',
  'Spanish II', 'French I', 'French II', 'Computer Science', 'Art History',
  'Music Theory', 'Physical Education', 'Health'
];

const apCourses = [
  'AP Biology', 'AP Chemistry', 'AP Physics 1', 'AP Physics 2', 'AP Physics C: Mechanics',
  'AP Physics C: Electricity & Magnetism', 'AP Environmental Science', 'AP Calculus AB',
  'AP Calculus BC', 'AP Statistics', 'AP Computer Science A', 'AP Computer Science Principles',
  'AP English Language & Composition', 'AP English Literature & Composition',
  'AP U.S. History', 'AP World History', 'AP European History', 'AP Human Geography',
  'AP Government & Politics: U.S.', 'AP Government & Politics: Comparative',
  'AP Macroeconomics', 'AP Microeconomics', 'AP Psychology', 'AP Spanish Language & Culture',
  'AP Spanish Literature & Culture', 'AP French Language & Culture', 'AP Chinese Language & Culture',
  'AP Japanese Language & Culture', 'AP German Language & Culture', 'AP Italian Language & Culture',
  'AP Latin', 'AP Art History', 'AP Studio Art: 2-D Design', 'AP Studio Art: 3-D Design',
  'AP Studio Art: Drawing', 'AP Music Theory'
];

export default function OnboardingFormPage() {
  const router = useRouter();
  const { saveOnboardingData } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    gpa: '',
    gpaType: 'unweighted',
    dreamSchool: '',
    major: '',
    satScore: '',
    actScore: '',
    strongSubjects: [] as string[],
    weakSubjects: [] as string[],
    apCourses: [] as string[],
    regularCourses: [] as string[],
  });
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [universitySearchTerm, setUniversitySearchTerm] = useState('');
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredUniversities, setFilteredUniversities] = useState(universities);
  const universityRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [strongSubjectSearch, setStrongSubjectSearch] = useState('');
  const [weakSubjectSearch, setWeakSubjectSearch] = useState('');
  const [apCourseSearch, setApCourseSearch] = useState('');
  const [regularCourseSearch, setRegularCourseSearch] = useState('');
  const [showStrongSubjectDropdown, setShowStrongSubjectDropdown] = useState(false);
  const [showWeakSubjectDropdown, setShowWeakSubjectDropdown] = useState(false);
  const [showApCourseDropdown, setShowApCourseDropdown] = useState(false);
  const [showRegularCourseDropdown, setShowRegularCourseDropdown] = useState(false);
  const [filteredStrongSubjects, setFilteredStrongSubjects] = useState(regularCourses);
  const [filteredWeakSubjects, setFilteredWeakSubjects] = useState(regularCourses);
  const [filteredApCourses, setFilteredApCourses] = useState(apCourses);
  const [filteredRegularCourses, setFilteredRegularCourses] = useState(regularCourses);
  const strongSubjectRef = useRef<HTMLDivElement>(null);
  const weakSubjectRef = useRef<HTMLDivElement>(null);
  const apCourseRef = useRef<HTMLDivElement>(null);
  const regularCourseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (universityRef.current && !universityRef.current.contains(event.target as Node)) {
        setShowUniversityDropdown(false);
      }
      if (strongSubjectRef.current && !strongSubjectRef.current.contains(event.target as Node)) {
        setShowStrongSubjectDropdown(false);
      }
      if (weakSubjectRef.current && !weakSubjectRef.current.contains(event.target as Node)) {
        setShowWeakSubjectDropdown(false);
      }
      if (apCourseRef.current && !apCourseRef.current.contains(event.target as Node)) {
        setShowApCourseDropdown(false);
      }
      if (regularCourseRef.current && !regularCourseRef.current.contains(event.target as Node)) {
        setShowRegularCourseDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUniversitySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUniversitySearchTerm(value);
    setFormData(prev => ({
      ...prev,
      dreamSchool: value
    }));
    setShowUniversityDropdown(true);

    const filtered = universities.filter(uni =>
      uni.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUniversities(filtered);
  };

  const handleUniversitySelect = (university: typeof universities[0]) => {
    setFormData(prev => ({
      ...prev,
      dreamSchool: university.name
    }));
    setUniversitySearchTerm(university.name);
    setShowUniversityDropdown(false);
  };

  const handleStrongSubjectSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStrongSubjectSearch(value);
    setShowStrongSubjectDropdown(true);

    const filtered = regularCourses.filter(course =>
      course.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStrongSubjects(filtered);
  };

  const handleWeakSubjectSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWeakSubjectSearch(value);
    setShowWeakSubjectDropdown(true);

    const filtered = regularCourses.filter(course =>
      course.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredWeakSubjects(filtered);
  };

  const handleApCourseSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApCourseSearch(value);
    setShowApCourseDropdown(true);

    const filtered = apCourses.filter(course =>
      course.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredApCourses(filtered);
  };

  const handleRegularCourseSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRegularCourseSearch(value);
    setShowRegularCourseDropdown(true);

    const filtered = regularCourses.filter(course =>
      course.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRegularCourses(filtered);
  };

  const handleAddStrongSubject = (course: string) => {
    if (!formData.strongSubjects.includes(course)) {
      setFormData(prev => ({
        ...prev,
        strongSubjects: [...prev.strongSubjects, course]
      }));
    }
    setStrongSubjectSearch('');
    setShowStrongSubjectDropdown(false);
  };

  const handleAddWeakSubject = (course: string) => {
    if (!formData.weakSubjects.includes(course)) {
      setFormData(prev => ({
        ...prev,
        weakSubjects: [...prev.weakSubjects, course]
      }));
    }
    setWeakSubjectSearch('');
    setShowWeakSubjectDropdown(false);
  };

  const handleAddApCourse = (course: string) => {
    if (!formData.apCourses.includes(course)) {
      setFormData(prev => ({
        ...prev,
        apCourses: [...prev.apCourses, course]
      }));
    }
    setApCourseSearch('');
    setShowApCourseDropdown(false);
  };

  const handleAddRegularCourse = (course: string) => {
    if (!formData.regularCourses.includes(course)) {
      setFormData(prev => ({
        ...prev,
        regularCourses: [...prev.regularCourses, course]
      }));
    }
    setRegularCourseSearch('');
    setShowRegularCourseDropdown(false);
  };

  const handleRemoveStrongSubject = (course: string) => {
    setFormData(prev => ({
      ...prev,
      strongSubjects: prev.strongSubjects.filter(c => c !== course)
    }));
  };

  const handleRemoveWeakSubject = (course: string) => {
    setFormData(prev => ({
      ...prev,
      weakSubjects: prev.weakSubjects.filter(c => c !== course)
    }));
  };

  const handleRemoveApCourse = (course: string) => {
    setFormData(prev => ({
      ...prev,
      apCourses: prev.apCourses.filter(c => c !== course)
    }));
  };

  const handleRemoveRegularCourse = (course: string) => {
    setFormData(prev => ({
      ...prev,
      regularCourses: prev.regularCourses.filter(c => c !== course)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveOnboardingData(formData);
    router.push('/onboarding/chat');
  };

  const handleSkip = () => {
    setShowSkipModal(true);
  };

  const handleContinueSkip = () => {
    // Save the current form data even if incomplete
    saveOnboardingData(formData);
    router.push('/onboarding/chat');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header component without share functionality */}
      <Header 
        currentPage="form"
        rightContent={
          <div className="flex items-center">
            <Link 
              href="/onboarding/analysis" 
              className="bg-green-50 hover:bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <GraduationCap className="h-4 w-4" />
              View Analysis
            </Link>
          </div>
        }
      />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <OnboardingProgressBar currentStep="form" />
        
        <div className="mx-auto">
          <h1 className="text-2xl font-display font-bold mb-6 text-center">Tell Us About Student</h1>

          <div className="bg-white rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Information Section */}
              {/* <div className="space-y-4">
                <h2 className="text-lg font-bold flex items-center">
                  <User className="mr-2 h-5 w-5 text-green-600" />
                  Personal Information
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Student's Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter student's name"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Academic Information Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h2 className="text-lg font-bold flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-green-600" />
                  Academic Information
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Current Grade Level</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <School className="h-4 w-4 text-gray-400" />
                      </div>
                      <select
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-no-repeat bg-right"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em" }}
                        required
                      >
                        <option value="">Select grade</option>
                        <option value="6th">6th Grade</option>
                        <option value="7th">7th Grade</option>
                        <option value="8th">8th Grade</option>
                        <option value="9th">9th Grade</option>
                        <option value="10th">10th Grade</option>
                        <option value="11th">11th Grade</option>
                        <option value="12th">12th Grade</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="gpa" className="block text-sm font-medium text-gray-700">Current GPA</label>
                    <div className="flex space-x-4">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Award className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="gpa"
                          name="gpa"
                          value={formData.gpa}
                          onChange={handleChange}
                          placeholder="Enter GPA"
                          step="0.01"
                          min="0"
                          max={formData.gpaType === 'weighted' ? '5.0' : '4.0'}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-4 bg-gray-50 px-4 rounded-lg">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="gpaType"
                            value="unweighted"
                            checked={formData.gpaType === 'unweighted'}
                            onChange={handleChange}
                            className="form-radio text-green-600 focus:ring-green-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Unweighted</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="gpaType"
                            value="weighted"
                            checked={formData.gpaType === 'weighted'}
                            onChange={handleChange}
                            className="form-radio text-green-600 focus:ring-green-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Weighted</span>
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.gpaType === 'weighted' ? 'Enter weighted GPA (up to 5.0)' : 'Enter unweighted GPA (up to 4.0)'}
                    </p>
                  </div>
                </div>

                {/* Standardized Test Scores - Only show for 11th and 12th grade */}
                {(formData.grade === '10th' || formData.grade === '11th' || formData.grade === '12th') && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-md font-semibold text-gray-700">Standardized Test Scores (Optional)</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="satScore" className="block text-sm font-medium text-gray-700">SAT Score</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Award className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            id="satScore"
                            name="satScore"
                            value={formData.satScore}
                            onChange={handleChange}
                            placeholder="Enter SAT score (out of 1600)"
                            min="400"
                            max="1600"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Leave blank if not taken</p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="actScore" className="block text-sm font-medium text-gray-700">ACT Score</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Award className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            id="actScore"
                            name="actScore"
                            value={formData.actScore}
                            onChange={handleChange}
                            placeholder="Enter ACT score (out of 36)"
                            min="1"
                            max="36"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Leave blank if not taken</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Regular Courses Section */}
              {/* <div className="space-y-4 pt-4 border-t border-gray-100">
                <h2 className="text-lg font-bold flex items-center">
                  <BookText className="mr-2 h-5 w-5 text-green-600" />
                  Regular Courses
                </h2>
                
                <div className="space-y-2" ref={regularCourseRef}>
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={regularCourseSearch}
                        onChange={handleRegularCourseSearch}
                        onFocus={() => setShowRegularCourseDropdown(true)}
                        placeholder="Search for regular courses..."
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (regularCourseSearch && !formData.regularCourses.includes(regularCourseSearch)) {
                          handleAddRegularCourse(regularCourseSearch);
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium shadow-sm transition flex items-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {showRegularCourseDropdown && filteredRegularCourses.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                      {filteredRegularCourses.map((course, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddRegularCourse(course)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center justify-between"
                        >
                          <span>{course}</span>
                          {formData.regularCourses.includes(course) && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {formData.regularCourses.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-2">Selected regular courses:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.regularCourses.map((course, index) => (
                          <div 
                            key={index} 
                            className="bg-green-50 rounded-full px-3 py-1 text-sm flex items-center"
                          >
                            <span>{course}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveRegularCourse(course)}
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div> */}

              {/* Courses Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h2 className="text-lg font-bold flex items-center">
                  <BookText className="mr-2 h-5 w-5 text-green-600" />
                  Subjects
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Strong Subjects */}
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-700">Strong Subjects</h3>
                    
                    <div className="space-y-2" ref={strongSubjectRef}>
                      <div className="flex space-x-2">
                        <div className="flex-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={strongSubjectSearch}
                            onChange={handleStrongSubjectSearch}
                            onFocus={() => setShowStrongSubjectDropdown(true)}
                            placeholder="Search for strong subjects..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (strongSubjectSearch && !formData.strongSubjects.includes(strongSubjectSearch)) {
                              handleAddStrongSubject(strongSubjectSearch);
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium shadow-sm transition flex items-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {showStrongSubjectDropdown && filteredStrongSubjects.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                          {filteredStrongSubjects.map((course, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleAddStrongSubject(course)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center justify-between"
                            >
                              <span>{course}</span>
                              {formData.strongSubjects.includes(course) && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {formData.strongSubjects.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500 mb-2">Selected strong subjects:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.strongSubjects.map((course, index) => (
                              <div 
                                key={index} 
                                className="bg-green-50 rounded-full px-3 py-1 text-sm flex items-center"
                              >
                                <span>{course}</span>
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveStrongSubject(course)}
                                  className="ml-2 text-gray-500 hover:text-red-500"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Weak Subjects */}
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-700">Weak Subjects</h3>
                    
                    <div className="space-y-2" ref={weakSubjectRef}>
                      <div className="flex space-x-2">
                        <div className="flex-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={weakSubjectSearch}
                            onChange={handleWeakSubjectSearch}
                            onFocus={() => setShowWeakSubjectDropdown(true)}
                            placeholder="Search for weak subjects..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (weakSubjectSearch && !formData.weakSubjects.includes(weakSubjectSearch)) {
                              handleAddWeakSubject(weakSubjectSearch);
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium shadow-sm transition flex items-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {showWeakSubjectDropdown && filteredWeakSubjects.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                          {filteredWeakSubjects.map((course, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleAddWeakSubject(course)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center justify-between"
                            >
                              <span>{course}</span>
                              {formData.weakSubjects.includes(course) && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {formData.weakSubjects.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500 mb-2">Selected weak subjects:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.weakSubjects.map((course, index) => (
                              <div 
                                key={index} 
                                className="bg-red-50 rounded-full px-3 py-1 text-sm flex items-center"
                              >
                                <span>{course}</span>
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveWeakSubject(course)}
                                  className="ml-2 text-gray-500 hover:text-red-500"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* AP Courses Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h2 className="text-lg font-bold flex items-center">
                  <BookText className="mr-2 h-5 w-5 text-green-600" />
                  AP Courses
                </h2>
                
                <div className="space-y-2" ref={apCourseRef}>
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={apCourseSearch}
                        onChange={handleApCourseSearch}
                        onFocus={() => setShowApCourseDropdown(true)}
                        placeholder="Search for AP courses..."
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (apCourseSearch && !formData.apCourses.includes(apCourseSearch)) {
                          handleAddApCourse(apCourseSearch);
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium shadow-sm transition flex items-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {showApCourseDropdown && filteredApCourses.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                      {filteredApCourses.map((course, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddApCourse(course)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center justify-between"
                        >
                          <span>{course}</span>
                          {formData.apCourses.includes(course) && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {formData.apCourses.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-2">Selected AP courses:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.apCourses.map((course, index) => (
                          <div 
                            key={index} 
                            className="bg-green-50 rounded-full px-3 py-1 text-sm flex items-center"
                          >
                            <span>{course}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveApCourse(course)}
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* College Aspirations Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h2 className="text-lg font-bold flex items-center">
                  <Building className="mr-2 h-5 w-5 text-green-600" />
                  College Aspirations
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2" ref={universityRef}>
                    <label htmlFor="dreamSchool" className="block text-sm font-medium text-gray-700">
                      Dream University
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="dreamSchool"
                        name="dreamSchool"
                        value={universitySearchTerm}
                        onChange={handleUniversitySearch}
                        onFocus={() => setShowUniversityDropdown(true)}
                        placeholder="Search universities..."
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                      {showUniversityDropdown && filteredUniversities.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                          {filteredUniversities.map((university, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleUniversitySelect(university)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                            >
                              <div className="font-medium">{university.name}</div>
                              <div className="text-sm text-gray-500">{university.location}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                      Intended Major
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                      </div>
                      <select
                        id="major"
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-no-repeat bg-right"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em" }}
                      >
                        <option value="">Select a major</option>
                        {majors.map((major, index) => (
                          <option key={index} value={major}>
                            {major}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={handleSkip}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium flex items-center gap-2"
                >
                  Skip for now
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-semibold shadow-sm transition flex items-center gap-2"
                >
                  Start Chat
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Skip Warning Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Are you sure you want to skip?</h3>
              <button 
                onClick={() => setShowSkipModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                Filling in more information helps us provide a more personalized experience tailored to your college journey.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowSkipModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Go Back
              </button>
              <button
                onClick={handleContinueSkip}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition flex items-center gap-2"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">&copy; 2024 7Edu. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-green-600 transition">Terms</a>
              <a href="#" className="text-gray-500 hover:text-green-600 transition">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-green-600 transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 