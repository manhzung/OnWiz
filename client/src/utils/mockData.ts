/**
 * Mock data factory for consistent test data
 */

import {
  Course,
  EnrolledCourse,
  PurchasedCourse,
  HomePageCourse,
  MyLearningCourse,
  Transaction,
  COURSE_CATEGORIES,
  QUIZ_CATEGORIES
} from '../types';

// Mock users and providers
const PROVIDERS = [
  { id: 'google', name: 'Google', logo: 'G' },
  { id: 'meta', name: 'Meta', logo: '∞' },
  { id: 'microsoft', name: 'Microsoft', logo: 'M' },
  { id: 'amazon', name: 'Amazon', logo: 'A' },
  { id: 'coursera', name: 'Coursera', logo: 'C' },
];

const INSTRUCTORS = [
  'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson',
  'David Brown', 'Emma Davis', 'Chris Wilson', 'Lisa Garcia'
];

const COURSE_TITLES = [
  'Complete Web Development Bootcamp',
  'React from Basics to Advanced',
  'Python for Beginners',
  'Data Science Fundamentals',
  'Advanced JavaScript Concepts',
  'UI/UX Design Principles',
  'Machine Learning with Python',
  'Cloud Computing with AWS',
  'Mobile App Development',
  'Cybersecurity Essentials'
];

// Factory functions
export const createMockCourse = (overrides: Partial<Course> = {}): Course => {
  const randomProvider = PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)];
  const randomInstructor = INSTRUCTORS[Math.floor(Math.random() * INSTRUCTORS.length)];
  const randomTitle = COURSE_TITLES[Math.floor(Math.random() * COURSE_TITLES.length)];
  const randomCategory = COURSE_CATEGORIES[Math.floor(Math.random() * COURSE_CATEGORIES.length)];

  return {
    id: `course-${Math.random().toString(36).substr(2, 9)}`,
    title: randomTitle,
    description: `${randomTitle} - Learn from industry experts and build real-world projects.`,
    instructor: randomInstructor,
    category: randomCategory,
    thumbnail: '',
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    totalRatings: Math.floor(Math.random() * 5000) + 100,
    students: Math.floor(Math.random() * 50000) + 1000,
    level: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as any,
    duration: `${Math.floor(Math.random() * 40) + 10} hours`,
    price: Math.floor(Math.random() * 200000) + 50000,
    type: ['Course', 'Specialization', 'Professional Certificate'][Math.floor(Math.random() * 3)] as any,
    tags: [randomCategory, randomInstructor.split(' ')[0]],
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
};

export const createMockEnrolledCourse = (overrides: Partial<EnrolledCourse> = {}): EnrolledCourse => {
  const baseCourse = createMockCourse();
  const progress = Math.floor(Math.random() * 101);
  const enrollmentDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);

  return {
    ...baseCourse,
    progress,
    enrollmentDate: enrollmentDate.toISOString(),
    completedLessons: Math.floor((progress / 100) * 20),
    totalLessons: 20,
    lastAccessedAt: progress > 0 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    ...overrides
  };
};

export const createMockPurchasedCourse = (overrides: Partial<PurchasedCourse> = {}): PurchasedCourse => {
  const baseCourse = createMockCourse();
  const purchaseDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);

  return {
    ...baseCourse,
    purchaseDate: purchaseDate.toISOString(),
    progress: Math.floor(Math.random() * 101),
    price: baseCourse.price, // actual paid price
    accessExpiresAt: new Date(purchaseDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    ...overrides
  };
};

export const createMockHomePageCourse = (overrides: Partial<HomePageCourse> = {}): HomePageCourse => {
  const baseCourse = createMockCourse();

  return {
    id: baseCourse.id,
    title: baseCourse.title,
    provider: baseCourse.instructor.split(' ')[0], // Simplified for homepage
    providerLogo: baseCourse.instructor.charAt(0).toUpperCase(),
    type: baseCourse.type,
    thumbnail: baseCourse.thumbnail,
    badge: baseCourse.level === 'beginner' ? 'New' :
           baseCourse.rating > 4.5 ? 'Top Rated' :
           Math.random() > 0.7 ? 'Bestseller' : undefined,
    progress: Math.random() > 0.8 ? Math.floor(Math.random() * 101) : undefined,
    ...overrides
  };
};

export const createMockMyLearningCourse = (overrides: Partial<MyLearningCourse> = {}): MyLearningCourse => {
  const baseCourse = createMockEnrolledCourse();

  return {
    id: baseCourse.id,
    title: baseCourse.title,
    provider: baseCourse.instructor.split(' ')[0],
    providerLogo: baseCourse.instructor.charAt(0).toUpperCase(),
    type: baseCourse.type,
    thumbnail: baseCourse.thumbnail,
    progress: baseCourse.progress,
    lastAccessed: baseCourse.lastAccessedAt,
    totalLessons: baseCourse.totalLessons,
    completedLessons: baseCourse.completedLessons,
    ...overrides
  };
};

export const createMockTransaction = (overrides: Partial<Transaction> = {}): Transaction => {
  const types: Transaction['type'][] = ['deposit', 'purchase', 'refund', 'withdrawal'];
  const statuses: Transaction['status'][] = ['completed', 'pending', 'failed'];

  const type = types[Math.floor(Math.random() * types.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const amount = type === 'deposit' || type === 'refund'
    ? Math.floor(Math.random() * 500000) + 50000
    : -(Math.floor(Math.random() * 200000) + 10000);

  const descriptions = {
    deposit: ['Top up via MoMo', 'Top up via credit card', 'Bank transfer', 'Top up via PayPal'],
    purchase: ['Course purchase', 'Premium subscription', 'Certificate purchase'],
    refund: ['Refund for cancelled course', 'Partial refund', 'Full refund'],
    withdrawal: ['Cash withdrawal', 'Bank transfer withdrawal']
  };

  return {
    id: `txn-${Math.random().toString(36).substr(2, 9)}`,
    type,
    amount,
    description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
    date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status,
    courseId: type === 'purchase' ? `course-${Math.random().toString(36).substr(2, 9)}` : undefined,
    ...overrides
  };
};

// Bulk generators
export const generateMockCourses = (count: number): Course[] => {
  return Array.from({ length: count }, () => createMockCourse());
};

export const generateMockEnrolledCourses = (count: number): EnrolledCourse[] => {
  return Array.from({ length: count }, () => createMockEnrolledCourse());
};

export const generateMockPurchasedCourses = (count: number): PurchasedCourse[] => {
  return Array.from({ length: count }, () => createMockPurchasedCourse());
};

export const generateMockHomePageCourses = (count: number): HomePageCourse[] => {
  return Array.from({ length: count }, () => createMockHomePageCourse());
};

export const generateMockTransactions = (count: number): Transaction[] => {
  return Array.from({ length: count }, () => createMockTransaction());
};

// Pre-generated consistent data for components
export const MOCK_BALANCE = 250000;

export const MOCK_RECENT_COURSES = generateMockPurchasedCourses(2);

export const MOCK_RECENT_TRANSACTIONS = generateMockTransactions(3);

export const MOCK_ALL_COURSES = generateMockPurchasedCourses(5);

export const MOCK_ALL_TRANSACTIONS = generateMockTransactions(10);

export const MOCK_HOME_COURSES = generateMockHomePageCourses(8);

export const MOCK_ENROLLED_COURSES = generateMockEnrolledCourses(6);
