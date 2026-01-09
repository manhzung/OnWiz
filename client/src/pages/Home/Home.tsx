/**
 * Home page - Coursera style
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import CourseCard from '../../components/common/CourseCard';
import { ROUTES } from '../../config/routes';
import { useAuth } from '../../hooks';
import type { MyLearningCourse } from '../../types';
import { MOCK_ENROLLED_COURSES } from '../../utils';

// ============================================================================
// Component
// ============================================================================

export const Home = () => {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState('Th');
  const [goal] = useState('start a career');

  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // My enrolled courses (first 3)
  const myCourses: MyLearningCourse[] = MOCK_ENROLLED_COURSES.slice(0, 3).map(course => ({
    id: course.id,
    title: course.title,
    provider: course.instructor.split(' ')[0],
    providerLogo: course.instructor.charAt(0).toUpperCase(),
    type: course.type,
    thumbnail: course.thumbnail,
    progress: course.progress,
  }));

  // Generate courses by category (4-5 courses per category)
  const generateCoursesByCategory = (category: string, count: number = 5) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `${category.toLowerCase().replace(' ', '-')}-${index + 1}`,
      title: `${category} Course ${index + 1}`,
      provider: ['Google', 'Meta', 'Microsoft', 'Amazon', 'Coursera'][index % 5],
      providerLogo: ['G', '∞', 'M', 'A', 'C'][index % 5],
      type: 'Course' as const,
      thumbnail: '',
      badge: index === 0 ? 'Bestseller' : index === 1 ? 'New' : undefined,
      progress: undefined,
      category,
      instructor: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'][index % 5],
      rating: 4.5 + Math.random() * 0.5,
      students: Math.floor(Math.random() * 50000) + 1000,
      level: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as any,
      duration: `${Math.floor(Math.random() * 40) + 10} hours`,
      price: Math.floor(Math.random() * 200000) + 50000,
    }));
  };


  // Category sections data
  const categorySections = [
    {
      title: 'Web Development',
      courses: generateCoursesByCategory('Web Development', 5),
      description: 'Build modern websites and web applications',
      gradient: 'from-blue-50 to-indigo-50'
    },
    {
      title: 'Data Science',
      courses: generateCoursesByCategory('Data Science', 5),
      description: 'Master data analysis and machine learning',
      gradient: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Programming',
      courses: generateCoursesByCategory('Programming', 4),
      description: 'Learn coding fundamentals and advanced concepts',
      gradient: 'from-purple-50 to-violet-50'
    },
    {
      title: 'Business',
      courses: generateCoursesByCategory('Business', 4),
      description: 'Develop business skills and entrepreneurship',
      gradient: 'from-orange-50 to-amber-50'
    },
    {
      title: 'Design',
      courses: generateCoursesByCategory('Design', 4),
      description: 'Create beautiful and functional designs',
      gradient: 'from-pink-50 to-rose-50'
    },
    {
      title: 'AI & Machine Learning',
      courses: generateCoursesByCategory('AI & Machine Learning', 4),
      description: 'Explore artificial intelligence and automation',
      gradient: 'from-cyan-50 to-teal-50'
    }
  ];

  return (
    <div className="w-full bg-white">
      <div className="max-w-8xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/5 via-blue-50/50 to-purple-50/50 rounded-2xl p-8 mb-12 border border-primary/10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Welcome back, {user?.name || 'Learner'}!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Continue your learning journey. Your goal is to{' '}
                <button className="text-primary underline hover:no-underline inline-flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 font-medium">
                  {goal}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to={ROUTES.COURSES} className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors inline-block text-center">
                  Browse Courses
                </Link>
                <Link to={ROUTES.MY_LEARNING} className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors inline-block text-center">
                  Continue Learning
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-200/20 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">L</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity and My Courses - Side by Side */}
        <div className="grid grid-cols-[400px_1fr] gap-6 mb-12 max-lg:grid-cols-1">
          {/* Weekly Activity */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Weekly activity</h2>
            <p className="text-sm text-gray-600 mb-4">
              Learners with goals are 75% more likely to complete their courses.
            </p>
            <div className="flex gap-2 mb-4">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    selectedDay === day
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-2">0 items completed · 0 minutes learned</p>
            <button className="text-primary hover:text-primary-hover text-sm font-medium transition-colors">
              Set your learning plan
            </button>
          </Card>

          {/* My Courses */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Courses</h2>
            <div className="flex flex-col gap-4">
              {myCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`${ROUTES.COURSE.replace(':id', course.id)}`}
                  className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors no-underline"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-xl font-bold text-gray-400">{course.title[0]}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-primary mb-1">{course.provider}</div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
                    {course.progress !== undefined && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{course.progress}% complete</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to={ROUTES.MY_LEARNING}
              className="block mt-4 text-primary hover:text-primary-hover text-sm font-medium transition-colors text-center"
            >
              View all courses
            </Link>
          </Card>
        </div>

        {/* Category Sections */}
        {categorySections.map((section) => (
          <div key={section.title} className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{section.title}</h2>
              <p className="text-gray-600">{section.description}</p>
            </div>
              <Link
                to={`${ROUTES.COURSES}?type=Courses&category=${encodeURIComponent(section.title)}`}
                className="text-primary hover:text-primary-hover font-medium text-sm transition-colors flex items-center gap-1"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
              {section.courses.map((course, courseIndex) => (
                <div key={course.id} style={{ animationDelay: `${courseIndex * 100}ms` }}>
                  <CourseCard
                    to={`${ROUTES.COURSE.replace(':id', course.id)}`}
                    title={course.title}
                    provider={course.provider}
                    instructor={course.instructor}
                    badge={course.badge}
                    rating={course.rating}
                    students={course.students}
                    level={course.level}
                    duration={course.duration}
                    price={course.price}
                    gradient={section.gradient}
                    type="Course"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-primary to-primary-hover rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Join millions of learners worldwide and unlock your potential with our comprehensive course catalog
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.COURSES}
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Explore All
            </Link>
            <Link
              to={`${ROUTES.COURSES}?type=Courses`}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
