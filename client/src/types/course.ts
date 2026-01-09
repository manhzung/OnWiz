/**
 * Course related TypeScript interfaces and types
 */

export type CourseType = 'Course' | 'Specialization' | 'Professional Certificate';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type LessonType = 'video' | 'theory' | 'quiz';

// Quiz types
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export type QuizType = 'multiple_choice' | 'single_choice' | 'fill_in';

// Categories for courses and quizzes
export const COURSE_CATEGORIES = [
  'Web Development',
  'Data Science',
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Cloud Computing',
  'Cybersecurity',
  'Mobile Development',
  'AI & Machine Learning',
  'DevOps',
  'Database',
  'Game Development',
  'Blockchain',
  'Other'
] as const;

export const QUIZ_CATEGORIES = [
  'Mathematics',
  'Science',
  'History',
  'Geography',
  'Literature',
  'Languages',
  'Programming',
  'Business',
  'General Knowledge',
  'Custom'
] as const;

export type CourseCategory = typeof COURSE_CATEGORIES[number];
export type QuizCategory = typeof QUIZ_CATEGORIES[number];

// Base Course interface
export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  category: string;
  thumbnail: string;
  rating: number;
  totalRatings: number;
  students: number;
  level: DifficultyLevel;
  duration: string;
  price: number;
  type: CourseType;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Course with enrollment information
export interface EnrolledCourse extends Course {
  progress: number; // 0-100
  enrollmentDate: string;
  completedLessons: number;
  totalLessons: number;
  certificateUrl?: string;
  lastAccessedAt?: string;
}

// Course with purchase information
export interface PurchasedCourse extends Course {
  purchaseDate: string;
  price: number; // actual paid price (may include discounts)
  progress: number; // 0-100
  accessExpiresAt?: string;
}

// Course in cart/wishlist
export interface CartCourse extends Course {
  addedAt: string;
  discount?: number;
}

// Course module structure
export interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: LessonType;
  duration: string; // "10:30" or "30 min"
  content?: string;
  videoUrl?: string;
  quizId?: string;
  isCompleted: boolean;
  isLocked: boolean;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
  isCompleted: boolean;
}

// Full course with modules
export interface CourseWithModules extends Course {
  modules: Module[];
  totalLessons: number;
  totalDuration: string;
  prerequisites?: string[];
  whatYouWillLearn?: string[];
}

// Course creation/update data
export interface CreateCourseData {
  title: string;
  description?: string;
  category: string;
  level: DifficultyLevel;
  price: number;
  thumbnail?: string;
  type: CourseType;
  tags?: string[];
  modules?: CreateModuleData[];
}

export interface CreateModuleData {
  title: string;
  description?: string;
  lessons?: CreateLessonData[];
}

export interface CreateLessonData {
  title: string;
  description?: string;
  type: LessonType;
  content?: string;
  duration?: string;
  videoUrl?: string;
  quizId?: string;
}

// Course filters and search
export interface CourseFilters {
  category?: string;
  level?: DifficultyLevel;
  type?: CourseType;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  duration?: string;
  instructor?: string;
}

export interface CourseSearchParams extends CourseFilters {
  query?: string;
  sortBy?: 'rating' | 'students' | 'price' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Course statistics
export interface CourseStats {
  totalStudents: number;
  averageRating: number;
  totalRevenue: number;
  completionRate: number;
  averageProgress: number;
}

// Instructor/course creator stats
export interface CourseCreatorStats extends CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  averageRating: number;
}

// Course review/rating
export interface CourseReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  helpful: number; // number of helpful votes
}

// Course discussion/forum
export interface CourseDiscussion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  repliesCount: number;
  isAnswered: boolean;
  tags?: string[];
  lessonId?: string;
  moduleId?: string;
}

// Quiz interfaces
export interface QuizQuestion {
  id: string;
  type: QuizType;
  content: string;
  options?: Array<{ id: number; text: string; is_correct: boolean }>;
  correct_answers?: string[];
  explanation?: string;
}

export interface QuizSettings {
  title: string;
  description?: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  time_limit: number; // minutes
  pass_score: number; // percentage
  shuffle_questions: boolean;
  privacy: 'public' | 'private';
}

export interface Quiz {
  id: string;
  settings: QuizSettings;
  questions: QuizQuestion[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  totalAttempts: number;
  averageScore: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, any>; // questionId -> answer
  score: number;
  timeSpent: number; // seconds
  completedAt: string;
  isPassed: boolean;
}

export interface CreateQuizData {
  title: string;
  description?: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  time_limit: number;
  pass_score: number;
  shuffle_questions: boolean;
  privacy: 'public' | 'private';
  questions: QuizQuestion[];
}

// Homepage display course (simplified)
export interface HomePageCourse {
  id: string;
  title: string;
  provider: string;
  providerLogo: string;
  type: CourseType;
  thumbnail: string;
  badge?: string;
  progress?: number;
  category?: string;
  rating?: number;
  students?: number;
  level?: DifficultyLevel;
  duration?: string;
  price?: number;
}

// My Learning course (enrolled)
export interface MyLearningCourse {
  id: string;
  title: string;
  provider: string;
  providerLogo: string;
  type: CourseType;
  thumbnail: string;
  progress: number;
  lastAccessed?: string;
}
