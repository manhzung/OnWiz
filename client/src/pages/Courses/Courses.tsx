/**
 * Explore page - Display courses and quizzes with comprehensive filtering
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import CourseCard from '../../components/common/CourseCard';
import { useSearch } from '../../contexts/SearchContext';
import { ROUTES } from '../../config/routes';
import { COURSE_CATEGORIES, QUIZ_CATEGORIES } from '../../types';

// ============================================================================
// Component
// ============================================================================

export const Courses = () => {
  // ==========================================================================
  // State
  // ==========================================================================
  const { searchTerm } = useSearch();
  const location = useLocation();
  const isDegreePage = location.pathname.startsWith(ROUTES.DEGREES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<'All' | 'Courses' | 'Quizzes'>('All');

  // Mock Quizzes Data
  const quizzes = [
    {
      id: 'quiz-1',
      settings: {
        title: 'Mathematics Fundamentals Quiz',
        description: 'Test your basic math knowledge',
        category: 'Mathematics',
        difficulty: 'easy',
        time_limit: 30,
        pass_score: 70,
        shuffle_questions: true,
        privacy: 'public'
      },
      questions: [],
      createdBy: 'math-teacher',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      totalAttempts: 245,
      averageScore: 78
    },
    {
      id: 'quiz-2',
      settings: {
        title: 'Science Basic Concepts',
        description: 'Fundamental science principles',
        category: 'Science',
        difficulty: 'medium',
        time_limit: 45,
        pass_score: 75,
        shuffle_questions: false,
        privacy: 'public'
      },
      questions: [],
      createdBy: 'science-teacher',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
      totalAttempts: 189,
      averageScore: 72
    },
    {
      id: 'quiz-3',
      settings: {
        title: 'Programming Logic Test',
        description: 'Test your programming logic skills',
        category: 'Programming',
        difficulty: 'hard',
        time_limit: 60,
        pass_score: 80,
        shuffle_questions: true,
        privacy: 'public'
      },
      questions: [],
      createdBy: 'coding-teacher',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-05T00:00:00Z',
      totalAttempts: 156,
      averageScore: 65
    },
    {
      id: 'quiz-4',
      settings: {
        title: 'Business Knowledge Assessment',
        description: 'Evaluate your business acumen',
        category: 'Business',
        difficulty: 'medium',
        time_limit: 40,
        pass_score: 70,
        shuffle_questions: false,
        privacy: 'public'
      },
      questions: [],
      createdBy: 'business-teacher',
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z',
      totalAttempts: 98,
      averageScore: 74
    },
    {
      id: 'quiz-5',
      settings: {
        title: 'Design Principles Quiz',
        description: 'Test your design knowledge',
        category: 'Design',
        difficulty: 'easy',
        time_limit: 25,
        pass_score: 65,
        shuffle_questions: true,
        privacy: 'public'
      },
      questions: [],
      createdBy: 'design-teacher',
      createdAt: '2024-01-25T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z',
      totalAttempts: 203,
      averageScore: 82
    }
  ];

  // Check URL params for category and type
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    const typeParam = urlParams.get('type');

    if (categoryParam && (
      COURSE_CATEGORIES.includes(categoryParam as any) ||
      QUIZ_CATEGORIES.includes(categoryParam as any)
    )) {
      setSelectedCategory(categoryParam);
    }

    if (typeParam && ['All', 'Courses', 'Quizzes'].includes(typeParam)) {
      setSelectedType(typeParam as 'All' | 'Courses' | 'Quizzes');
    }
  }, [location.search]);

  // ==========================================================================
  // Data
  // ==========================================================================

  const courses = [
    {
      id: '1',
      title: 'React from Basics to Advanced',
      instructor: 'John Doe',
      category: 'Computer Science',
      thumbnail: '',
      rating: 4.8,
      totalRatings: 1234,
      students: 12500,
      level: 'intermediate',
      duration: '12 hours',
      type: 'Specialization',
      
    },
    {
      id: '2',
      title: 'UI/UX Design Fundamentals',
      instructor: 'Jane Smith',
      category: 'Design',
      thumbnail: '',
      rating: 4.9,
      totalRatings: 890,
      students: 8900,
      level: 'beginner',
      duration: '10 hours',
      type: 'Course',
      
    },
    {
      id: '3',
      title: 'Digital Marketing Mastery',
      instructor: 'Mike Johnson',
      category: 'Business',
      thumbnail: '',
      rating: 4.7,
      totalRatings: 2100,
      students: 21000,
      level: 'intermediate',
      duration: '15 hours',
      type: 'Professional Certificate',
      
    },
    {
      id: '4',
      title: 'JavaScript ES6+ Advanced',
      instructor: 'Sarah Williams',
      category: 'Computer Science',
      thumbnail: '',
      rating: 4.9,
      totalRatings: 3200,
      students: 32000,
      level: 'advanced',
      duration: '14 hours',
      type: 'Specialization',
      
    },
    {
      id: '5',
      title: 'Figma Design System',
      instructor: 'Emily Brown',
      category: 'Design',
      thumbnail: '',
      rating: 4.8,
      totalRatings: 1500,
      students: 15000,
      level: 'intermediate',
      duration: '8 hours',
      type: 'Course',
      
    },
    {
      id: '6',
      title: 'SEO Optimization Guide',
      instructor: 'David Lee',
      category: 'Business',
      thumbnail: '',
      rating: 4.6,
      totalRatings: 980,
      students: 9800,
      level: 'beginner',
      duration: '9 hours',
      type: 'Course',
      
    },
    {
      id: '7',
      title: 'Python for Data Science',
      instructor: 'Robert Taylor',
      category: 'Data Science',
      thumbnail: '',
      rating: 4.9,
      totalRatings: 2800,
      students: 28000,
      level: 'advanced',
      duration: '18 hours',
      type: 'Specialization',
      
    },
    {
      id: '8',
      title: 'Adobe Photoshop Mastery',
      instructor: 'Lisa Anderson',
      category: 'Design',
      thumbnail: '',
      rating: 4.7,
      totalRatings: 1750,
      students: 17500,
      level: 'intermediate',
      duration: '11 hours',
      type: 'Course',
      
    },
  ];

  // ==========================================================================
  // Filtered Data
  // ==========================================================================

  // Combined items for filtering
  const allItems = [
    ...courses.map(course => ({ ...course, itemType: 'course' as const })),
    ...quizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.settings.title,
      description: quiz.settings.description,
      category: quiz.settings.category,
      provider: 'Quiz Platform',
      providerLogo: 'Q',
      instructor: quiz.createdBy,
      rating: 4.2 + Math.random() * 0.8,
      students: quiz.totalAttempts,
      level: quiz.settings.difficulty,
      duration: `${quiz.settings.time_limit} min`,
      type: 'Quiz' as const,
      badge: quiz.settings.difficulty === 'easy' ? 'Beginner Friendly' :
             quiz.settings.difficulty === 'medium' ? 'Intermediate' : 'Advanced',
      itemType: 'quiz' as const,
      quizData: quiz
    }))
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item as any).description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'All' ||
                       (selectedType === 'Courses' && item.itemType === 'course') ||
                       (selectedType === 'Quizzes' && item.itemType === 'quiz');

    // Optional: Filter by degree type if on degree page - for now we just show everything or filter by "type" if we had appropriate data
    // Assuming for now user just wants the search context differentiation
    const matchesDegreeType = isDegreePage ? true : true;

    return matchesSearch && matchesCategory && matchesType && matchesDegreeType;
  });

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="w-full bg-white">
      <div className="max-w-8xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isDegreePage ? 'Explore Degrees' : 'Explore Learning'}
          </h1>
          <p className="text-lg text-gray-600">
            {isDegreePage
              ? 'Earn a degree from a top university or company'
              : 'Discover courses and quizzes from top universities and companies'}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-6">
            {/* Type Filter */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as 'All' | 'Courses' | 'Quizzes')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="All">All Types</option>
                <option value="Courses">Courses</option>
                <option value="Quizzes">Quizzes</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="All">All Categories</option>
                {selectedType === 'Quizzes' ?
                  QUIZ_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  )) :
                  COURSE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Found {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            {selectedType !== 'All' && ` (${selectedType})`}
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
          {filteredItems.map((item) => (
            <div key={item.id}>
              <CourseCard
                to={item.itemType === 'course' ? `${ROUTES.COURSE.replace(':id', item.id)}` : `/quiz/${item.id}`}
                title={item.title}
                provider={(item as any).provider ?? item.instructor?.split?.(' ')?.[0]}
                instructor={item.instructor}
                badge={(item as any).badge}
                rating={item.rating}
                students={item.students}
                level={(item as any).level}
                duration={(item as any).duration}
                price={(item as any).price}
                type={item.itemType === 'quiz' ? 'Quiz' : 'Course'}
                gradient={item.itemType === 'quiz' ? 'from-purple-50 to-pink-50' : 'from-blue-50 to-purple-50'}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card className="p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg text-gray-600">
                No {selectedType === 'All' ? 'items' : selectedType.toLowerCase()} found
              </p>
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
