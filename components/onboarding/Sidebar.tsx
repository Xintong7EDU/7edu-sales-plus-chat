import React from 'react';
import { Users, GraduationCap, BookOpen, Printer, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  userProfile: any;
  activeTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userProfile, activeTab }) => {
  const dreamSchool = userProfile?.dreamSchool || "Not specified";
  
  // Check if courses exist
  const hasRegularCourses = userProfile?.regularCourses && userProfile.regularCourses.length > 0;
  const hasApCourses = userProfile?.apCourses && userProfile.apCourses.length > 0;
  const hasStrongSubjects = userProfile?.strongSubjects && userProfile.strongSubjects.length > 0;
  const hasWeakSubjects = userProfile?.weakSubjects && userProfile.weakSubjects.length > 0;
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-base font-semibold mb-4 flex items-center">
          <Users className="mr-2 h-4 w-4 text-green-600" />
          Quick Stats
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Grade Level</span>
            <span className="text-sm font-medium">{userProfile.grade}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Current GPA</span>
            <span className="text-sm font-medium">{userProfile.gpa}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Dream School</span>
            </div>
            <span className="text-sm font-medium truncate max-w-[120px]">{dreamSchool}</span>
          </div>
        </div>
      </div>

      {/* Academic Profile */}
      {(hasStrongSubjects || hasWeakSubjects || hasRegularCourses || hasApCourses) && (
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-base font-semibold mb-4 flex items-center">
            <BookOpen className="mr-2 h-4 w-4 text-green-600" />
            Academic Profile
          </h2>
          
          {/* Strong Subjects */}
          {hasStrongSubjects && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Strong Subjects:</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.strongSubjects.map((subject: string, index: number) => (
                  <span key={index} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Weak Subjects */}
          {hasWeakSubjects && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Weak Subjects:</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.weakSubjects.map((subject: string, index: number) => (
                  <span key={index} className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Regular Courses */}
          {hasRegularCourses && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Regular Courses:</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.regularCourses.map((course: string, index: number) => (
                  <span key={index} className="bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* AP Courses */}
          {hasApCourses && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">AP Courses:</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.apCourses.map((course: string, index: number) => (
                  <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-lg font-semibold mb-4">Report Options</h2>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center border-green-600 text-green-600 hover:bg-green-50"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center border-green-600 text-green-600 hover:bg-green-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Email Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 