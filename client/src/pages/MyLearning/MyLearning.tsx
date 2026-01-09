/**
 * My Learning page - Coursera style
 */

import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import CourseCard from '../../components/common/CourseCard';
import { ROUTES } from '../../config/routes';
import { useSearch } from '../../contexts/SearchContext';

// ============================================================================
// Component
// ============================================================================

export const MyLearning = () => {
  const { searchTerm } = useSearch();
  // ==========================================================================
  // Data (Mock data - sẽ thay bằng API call)
  // ==========================================================================

  const enrolledCourses: any[] = [
    {
      id: '1',
      title: 'React from Basics to Advanced',
      provider: 'Meta',
      providerLogo: 'M',
      instructor: 'John Doe',
      thumbnail: '',
      progress: 35,
      lastAccessed: '2024-01-20',
      totalLessons: 24,
      completedLessons: 8,
    },
    {
      id: '2',
      title: 'UI/UX Design Fundamentals',
      provider: 'Google',
      providerLogo: 'G',
      instructor: 'Jane Smith',
      thumbnail: '',
      progress: 60,
      lastAccessed: '2024-01-19',
      totalLessons: 18,
      completedLessons: 11,
    },
    {
      id: '3',
      title: 'Digital Marketing Mastery',
      provider: 'IBM',
      providerLogo: 'IBM',
      instructor: 'Mike Johnson',
      thumbnail: '',
      progress: 80,
      lastAccessed: '2024-01-18',
      totalLessons: 20,
      completedLessons: 16,
    },
  ];

  const filteredEnrolledCourses = enrolledCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCourses: any[] = [
    {
      id: '4',
      title: 'JavaScript ES6+ Advanced',
      provider: 'Meta',
      providerLogo: 'M',
      instructor: 'Sarah Williams',
      thumbnail: '',
      progress: 100,
      lastAccessed: '2024-01-15',
      totalLessons: 15,
      completedLessons: 15,
    },
  ];

  const filteredCompletedCourses = completedCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==========================================================================
  // Handlers
  // ==========================================================================

  

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="w-full bg-white">
      <div className="max-w-8xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Learning</h1>
          <p className="text-lg text-gray-600">
            Continue your learning journey and achieve your goals
          </p>
        </div>

        {/* Enrolled Courses */}
        {filteredEnrolledCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">In Progress</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
              {filteredEnrolledCourses.map((course) => (
                <div key={course.id}>
                  <CourseCard
                    to={ROUTES.LEARNING.replace(':courseId', course.id)}
                    title={course.title}
                    provider={course.instructor.split(' ')[0]}
                    instructor={course.instructor}
                    rating={4.0}
                    students={course.totalLessons}
                    level={course.level}
                    duration={course.duration}
                    progress={course.progress}
                    type="Course"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Courses */}
        {filteredCompletedCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Completed</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
              {filteredCompletedCourses.map((course) => (
                <div key={course.id}>
                  <CourseCard
                    title={course.title}
                    provider={course.instructor.split(' ')[0]}
                    instructor={course.instructor}
                    rating={4.8}
                    students={course.totalLessons}
                    level={course.level}
                    duration={course.duration}
                    type="Course"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredEnrolledCourses.length === 0 && filteredCompletedCourses.length === 0 && (
          <Card className="p-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <p className="text-lg text-gray-600 m-0">You haven't enrolled in any courses yet</p>
              <Link to={ROUTES.COURSES}>
                <Button variant="primary" size="lg" className="bg-[#0056d2] hover:bg-[#004494]">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
