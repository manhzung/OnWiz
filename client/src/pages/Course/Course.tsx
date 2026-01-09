/**
 * Course Detail page - Coursera style
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../config/routes';
import { cn } from '../../utils/cn';

// ============================================================================
// Types
// ============================================================================

interface Lesson {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
  isCompleted: boolean;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// ============================================================================
// Component
// ============================================================================

export const Course = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'outcomes' | 'courses' | 'testimonials'>('about');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  // ==========================================================================
  // Data (Mock data - sẽ thay bằng API call)
  // ==========================================================================

  const course = {
    id: id || '1',
    provider: 'Google',
    providerLogo: 'G',
    title: 'Google AI Essentials Specialization',
    description: 'Boost Your Productivity with AI Tools. New to AI? Learn from Google experts how AI can help you speed up daily tasks and spark new ideas.',
    instructor: 'Google Career Certificates',
    rating: 4.8,
    totalRatings: 16789,
    students: 329157,
    startDate: 'Dec 17',
    isEnrolled: false,
    progress: 0,
    level: 'Beginner',
    duration: '4 hours',
    language: 'English',
    type: '5 course series',
    // New pricing fields
    pricing: {
      is_free: false,
      price: 150000, // 150,000 VND
      sale_price: 99000, // 99,000 VND (33% off)
      currency: 'VND'
    },
    is_paid_course: true
  };

  const learningOutcomes = [
    'Use generative AI tools to help develop ideas and content, make more informed decisions, and speed up daily work tasks',
    'Write clear and specific prompts to get the output you want - you\'ll apply prompting techniques to help summarize, create tag lines, and more',
    'Use AI responsibly by identifying AI\'s potential biases and avoiding harm',
    'Develop strategies to stay up-to-date in the emerging landscape of AI',
  ];

  const skills = [
    'Model Evaluation',
    'Prompt Patterns',
    'Natural Language Processing',
    'Data-Driven Decision-Making',
    'Emerging Technologies',
    'Artificial Intelligence and Machine Learning (AI/ML)',
    'Operational Efficiency',
  ];

  const chapters: Chapter[] = [
    {
      id: '1',
      title: 'Introduction to AI',
      lessons: [
        { id: '1', title: 'What is AI?', duration: '15:30', isPreview: true, isCompleted: false },
        { id: '2', title: 'AI Applications', duration: '20:15', isPreview: true, isCompleted: false },
        { id: '3', title: 'Getting Started', duration: '25:45', isPreview: false, isCompleted: false },
      ],
    },
    {
      id: '2',
      title: 'AI Tools and Techniques',
      lessons: [
        { id: '4', title: 'Prompt Engineering', duration: '18:20', isPreview: false, isCompleted: false },
        { id: '5', title: 'AI Workflows', duration: '22:10', isPreview: false, isCompleted: false },
      ],
    },
  ];

  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Sarah W.',
      rating: 5,
      comment: 'This course helped me understand AI tools and how to use them effectively in my daily work. Highly recommended!',
      date: '2024-01-20',
    },
    {
      id: '2',
      userName: 'John D.',
      rating: 5,
      comment: 'Great introduction to AI. The instructors explain complex concepts in an easy-to-understand way.',
      date: '2024-01-18',
    },
  ];

  // ==========================================================================
  // Handlers
  // ==========================================================================

  const toggleChapter = (chapterId: string) => {
    setSelectedChapter(selectedChapter === chapterId ? null : chapterId);
  };

  const handleEnroll = () => {
    if (course.isEnrolled) {
      navigate(ROUTES.LEARNING.replace(':courseId', course.id));
    } else {
      if (course.pricing.is_free) {
        // Free course - enroll directly
        console.log('Enrolling in free course:', course.id);
        // TODO: Call enrollment API
      navigate(ROUTES.LEARNING.replace(':courseId', course.id));
      } else {
        // Paid course - redirect to payment
        console.log('Redirecting to payment for course:', course.id);
        // TODO: Create order and redirect to payment
        // For now, redirect to wallet to show payment flow
        navigate(ROUTES.WALLET);
      }
    }
  };

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="w-full bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-8xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to={ROUTES.HOME} className="text-[#0056d2] hover:text-[#004494] no-underline">
              Browse
            </Link>
            <span>/</span>
            <Link to={ROUTES.COURSES} className="text-[#0056d2] hover:text-[#004494] no-underline">
              Data Science
            </Link>
            <span>/</span>
            <span>Machine Learning</span>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-6 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="text-2xl font-bold text-[#4285f4] mb-4">{course.provider}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-lg text-gray-700 mb-6 max-w-3xl">{course.description}</p>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Instructor:</span>
              <span className="text-sm font-semibold text-gray-900">{course.instructor}</span>
            </div>
            <button className="px-3 py-1 bg-blue-100 text-[#0056d2] rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
              + New AI skills
            </button>
          </div>

          {/* Enrollment Section */}
          <div className="flex items-start gap-6 mb-8">
            <div>
              {course.pricing.is_free ? (
                <>
              <Button
                variant="primary"
                size="lg"
                onClick={handleEnroll}
                className="bg-[#0056d2] hover:bg-[#004494] mb-2"
              >
                    {course.isEnrolled ? 'Continue Learning' : 'Enroll for free'}
              </Button>
              <p className="text-sm text-gray-600 mb-1">Starts {course.startDate}</p>
              <p className="text-sm text-gray-600">
                Try for free: Enroll to start your 7-day full access free trial
              </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: course.pricing.currency
                        }).format(course.pricing.sale_price || course.pricing.price)}
                      </span>
                      {course.pricing.sale_price && course.pricing.sale_price < course.pricing.price && (
                        <span className="text-lg text-gray-500 line-through">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: course.pricing.currency
                          }).format(course.pricing.price)}
                        </span>
                      )}
                    </div>
                    {course.pricing.sale_price && course.pricing.sale_price < course.pricing.price && (
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                        {Math.round((1 - course.pricing.sale_price / course.pricing.price) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleEnroll}
                    className="bg-[#0056d2] hover:bg-[#004494] mb-2"
                  >
                    {course.isEnrolled ? 'Continue Learning' : 'Purchase Course'}
                  </Button>
                  <p className="text-sm text-gray-600 mb-1">30-day money-back guarantee</p>
                  <p className="text-sm text-gray-600">Full lifetime access</p>
                </>
              )}
              <p className="text-sm text-gray-600 mt-2">{course.students.toLocaleString()} already enrolled</p>
              <div className="mt-2">
                <span className="text-sm text-gray-600">Included with </span>
                <span className="px-2 py-1 bg-[#0056d2] text-white rounded text-xs font-semibold">PLUS</span>
                <button className="text-[#0056d2] hover:text-[#004494] text-sm font-medium ml-2">
                  Learn more
                </button>
              </div>
            </div>
          </div>

          {/* Course Metrics Card */}
          <Card className="mb-8">
            <div className="grid grid-cols-4 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-1">{course.type}</div>
                <div className="text-xs text-gray-600">Get in-depth knowledge of a subject</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {course.rating} ★ ({course.totalRatings.toLocaleString()} reviews)
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-1">{course.level} level</div>
                <div className="text-xs text-gray-600">Recommended experience</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-1">{course.duration} to complete</div>
                <div className="text-xs text-gray-600">Flexible schedule</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            {(['about', 'outcomes', 'courses', 'testimonials'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'pb-4 px-2 text-sm font-medium transition-colors capitalize',
                  activeTab === tab
                    ? 'text-[#0056d2] border-b-2 border-[#0056d2]'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {tab === 'outcomes' ? "What you'll learn" : tab === 'courses' ? 'Courses' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-[1fr_400px] gap-8 max-lg:grid-cols-1">
          <div>
            {activeTab === 'about' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">What you'll learn</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-gray-700">{outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills you'll gain</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button className="text-[#0056d2] hover:text-[#004494] text-sm font-medium mt-4">
                    View all skills
                  </button>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Details to know</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#0056d2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span className="text-gray-700">Shareable certificate</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#0056d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-700">Taught in {course.language}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'outcomes' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Learning Outcomes</h2>
                <div className="space-y-4">
                  {learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-gray-700">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Course Content</h2>
                <div className="space-y-2">
                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div
                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleChapter(chapter.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[#0056d2]">
                            {selectedChapter === chapter.id ? '▼' : '▶'}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900 m-0">{chapter.title}</h3>
                        </div>
                        <span className="text-sm text-gray-600">{chapter.lessons.length} lessons</span>
                      </div>
                      {selectedChapter === chapter.id && (
                        <div className="border-t border-gray-200 bg-gray-50">
                          {chapter.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-[#0056d2] font-bold">
                                  {lesson.isCompleted ? '✓' : '○'}
                                </span>
                                <span className="text-gray-900">{lesson.title}</span>
                                {lesson.isPreview && (
                                  <span className="px-2 py-1 bg-blue-100 text-[#0056d2] text-xs font-semibold rounded">
                                    Preview
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-600">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Testimonials</h2>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-gray-200 last:border-b-0">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0056d2] text-white flex items-center justify-center font-semibold">
                            {review.userName[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{review.userName}</span>
                            <span className="text-sm text-gray-600">{review.date}</span>
                          </div>
                        </div>
                        <div className="text-yellow-400">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Enrollment Card */}
          <div className="max-lg:order-first">
            <Card className="sticky top-8">
              {!course.pricing.is_free && !course.isEnrolled && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-green-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: course.pricing.currency
                      }).format(course.pricing.sale_price || course.pricing.price)}
                    </span>
                    {course.pricing.sale_price && course.pricing.sale_price < course.pricing.price && (
                      <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-semibold">
                        {Math.round((1 - course.pricing.sale_price / course.pricing.price) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  {course.pricing.sale_price && course.pricing.sale_price < course.pricing.price && (
                    <p className="text-sm text-gray-600 line-through">
                      Original: {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: course.pricing.currency
                      }).format(course.pricing.price)}
                    </p>
                  )}
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleEnroll}
                className="bg-[#0056d2] hover:bg-[#004494] mb-4"
              >
                {course.isEnrolled
                  ? 'Continue Learning'
                  : course.pricing.is_free
                    ? 'Enroll for free'
                    : 'Purchase Course'
                }
              </Button>

              <p className="text-sm text-gray-600 mb-4">
                {course.pricing.is_free
                  ? `Starts ${course.startDate} · ${course.students.toLocaleString()} already enrolled`
                  : `${course.students.toLocaleString()} already enrolled · 30-day money-back guarantee`
                }
              </p>
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Shareable certificate</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">100% online</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Flexible schedule</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
