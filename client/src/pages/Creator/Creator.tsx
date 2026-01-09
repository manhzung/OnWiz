/**
 * Creator page - Content creation hub
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ROUTES } from '../../config/routes';
import { showToast } from '../../utils';

// ============================================================================
// Types
// ============================================================================

interface ContentType {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  comingSoon?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export const Creator = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('');
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');

  // Mock data for created courses
  const createdCourses = [
    {
      id: '1',
      title: 'Web Development from A to Z',
      description: 'Complete course on HTML, CSS, JavaScript and React',
      studentsCount: 45,
      rating: 4.8,
      totalRevenue: 2250000,
      isPublished: true,
      createdAt: '2024-01-15',
      thumbnail: '',
      price: 50000,
      enrollments: [
        { id: 'e1', studentName: 'John Smith', progress: 85, enrolledAt: '2024-01-16', status: 'active' },
        { id: 'e2', studentName: 'Sarah Johnson', progress: 100, enrolledAt: '2024-01-14', status: 'completed' },
        { id: 'e3', studentName: 'Mike Davis', progress: 60, enrolledAt: '2024-01-18', status: 'active' },
      ]
    },
    {
      id: '2',
      title: 'Advanced Mathematics - Calculus',
      description: 'Fundamental calculus knowledge for science students',
      studentsCount: 23,
      rating: 4.6,
      totalRevenue: 1150000,
      isPublished: true,
      createdAt: '2024-01-10',
      thumbnail: '',
      price: 50000,
      enrollments: [
        { id: 'e4', studentName: 'Emily Wilson', progress: 40, enrolledAt: '2024-01-12', status: 'active' },
        { id: 'e5', studentName: 'David Brown', progress: 90, enrolledAt: '2024-01-11', status: 'active' },
      ]
    },
    {
      id: '3',
      title: 'English Communication',
      description: 'Improve daily English communication skills',
      studentsCount: 67,
      rating: 4.9,
      totalRevenue: 3350000,
      isPublished: false,
      createdAt: '2024-01-20',
      thumbnail: '',
      price: 50000,
      enrollments: []
    }
  ];

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const contentTypes: ContentType[] = [
    {
      id: 'quiz',
      title: 'Create Quiz',
      description: 'Create quiz sets for study and knowledge testing',
      icon: '',
      features: [
        'Multiple choice questions',
        'Set time limit and passing score',
        'Detailed answer explanations',
        'Share link with friends'
      ]
    }
  ];

  const handleCreate = (typeId: string) => {
    console.log('handleCreate called with typeId:', typeId);
    setSelectedType(typeId);

    // Navigate to specific creation page
    switch (typeId) {
      case 'quiz':
        console.log('Navigating to CREATE_QUIZ:', ROUTES.CREATE_QUIZ);
        navigate(ROUTES.CREATE_QUIZ);
        break;
      case 'course':
        console.log('Navigating to CREATE_COURSE:', ROUTES.CREATE_COURSE);
        navigate(ROUTES.CREATE_COURSE);
        break;
      case 'material':
        // Coming soon - show notification
        showToast.info('Material creation feature coming soon!');
        break;
      case 'group':
        // Coming soon - show notification
        showToast.info('Study group creation feature coming soon!');
        break;
    }
  };

  const handleCreateQuiz = () => {
    if (!quizTitle.trim()) {
      showToast.error('Please enter quiz name!');
      return;
    }

    // For now, navigate to a mock quiz creation page
    // Later this will integrate with actual quiz builder
    navigate('/creator/quiz-builder', {
      state: {
        title: quizTitle,
        description: quizDescription
      }
    });
  };

  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Creator Hub</h1>
          <p className="text-gray-600">Manage courses and create new content</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">C</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{createdCourses.length}</h3>
            <p className="text-sm text-gray-600">Courses Created</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">S</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {createdCourses.reduce((sum, course) => sum + course.studentsCount, 0)}
            </h3>
            <p className="text-sm text-gray-600">Total Students</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">$</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(createdCourses.reduce((sum, course) => sum + course.totalRevenue, 0))}
            </h3>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">★</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {(createdCourses.reduce((sum, course) => sum + course.rating, 0) / createdCourses.length).toFixed(1)}
            </h3>
            <p className="text-sm text-gray-600">Average Rating</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Content</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer text-center"
              onClick={(e) => {
                e.stopPropagation();
                handleCreate('quiz');
              }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                Q
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Quiz</h3>
              <p className="text-sm text-gray-600 mb-4">Study and test knowledge</p>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreate('quiz');
                }}
              >
                Create Quiz
              </Button>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer text-center"
              onClick={(e) => {
                e.stopPropagation();
                handleCreate('course');
              }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                C
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Course</h3>
              <p className="text-sm text-gray-600 mb-4">Full structured courses</p>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreate('course');
                }}
              >
                Create Course
              </Button>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center opacity-60">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                D
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Material</h3>
              <p className="text-sm text-gray-600 mb-4">Share articles and documents</p>
              <Button variant="outline" size="sm" fullWidth disabled>
                Coming Soon
              </Button>
            </Card>
          </div>
        </div>

        {/* Created Courses */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Courses Created</h2>

          {createdCourses.length === 0 ? (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">+</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses created yet</h3>
              <p className="text-gray-600">Start creating your first course</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {createdCourses.map((course) => (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleCourseClick(course)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">C</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{course.studentsCount} students</span>
                          <span>★ {course.rating}</span>
                          <span>{new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(course.totalRevenue)} revenue</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-gray-400">→</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quiz Creation Form */}
        {showQuizForm && (
          <Card className="border-primary">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New Quiz</h2>
              <button
                onClick={() => setShowQuizForm(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Quiz Title"
                placeholder="Example: Math Quiz - Algebra Basics"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of the quiz content..."
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  onClick={handleCreateQuiz}
                  disabled={!quizTitle.trim()}
                >
                  Start Creating Questions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowQuizForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Course Detail Modal */}
        {showCourseDetail && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Course Details</h2>
                <button
                  onClick={() => setShowCourseDetail(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              {/* Course Info */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedCourse.title}</h3>
                <p className="text-gray-600 mb-4">{selectedCourse.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{selectedCourse.studentsCount}</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{selectedCourse.rating}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(selectedCourse.totalRevenue)}
                    </div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(selectedCourse.price)}
                    </div>
                    <div className="text-sm text-gray-600">Price</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCourse.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedCourse.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-sm text-gray-600">
                    Created: {new Date(selectedCourse.createdAt).toLocaleDateString('en-US')}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-6">
                      <button className="pb-3 px-2 text-primary border-b-2 border-primary font-medium">
                    Students ({selectedCourse.enrollments.length})
                  </button>
                  <button className="pb-3 px-2 text-gray-600 hover:text-gray-900 font-medium">
                    Settings
                  </button>
                  <button className="pb-3 px-2 text-gray-600 hover:text-gray-900 font-medium">
                    Analytics
                  </button>
                </div>
              </div>

              {/* Enrollments List */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Student List</h4>

                {selectedCourse.enrollments.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">
                    No students have enrolled in this course yet
                  </div>
                ) : (
                  selectedCourse.enrollments.map((enrollment: any) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {enrollment.studentName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{enrollment.studentName}</div>
                          <div className="text-sm text-gray-600">
                            Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString('en-US')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{enrollment.progress}%</div>
                          <div className="text-sm text-gray-600">Completed</div>
                        </div>

                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          enrollment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {enrollment.status === 'completed' ? 'Completed' : 'In Progress'}
                        </div>

                        <button className="text-gray-400 hover:text-primary text-sm">
                          Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button variant="primary">
                Edit Course
              </Button>
              <Button variant="outline">
                Export Data
              </Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                Delete Course
              </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Effective Course Management Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-lg">•</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Track Student Progress</h4>
              <p className="text-sm text-gray-700">Monitor completion rates and scores of individual students to adjust content.</p>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-lg">•</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Engage with Students</h4>
              <p className="text-sm text-gray-700">Answer questions and build a learning community to increase completion rates.</p>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-lg">•</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Optimize Revenue</h4>
              <p className="text-sm text-gray-700">Adjust pricing and create promotional programs to increase revenue.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
