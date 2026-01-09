/**
 * Application routes configuration
 */

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  DEGREES: "/degrees",
  COURSE: "/course/:id",
  LEARNING: "/learn/:courseId",
  LEARNING_LESSON: "/learn/:courseId/lesson/:lessonId",
  LEARNING_RESULT: "/learn/:courseId/lesson/:lessonId/result",
  MY_LEARNING: "/my-learning",
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_GROUPS: "/admin/groups",
  ADMIN_PAYMENTS: "/admin/payments",
  CLASSROOM: "/classroom",
  CLASSROOM_DETAIL: '/classroom/:id',
  // Payment & Wallet routes
  WALLET: "/wallet",
  DEPOSIT: "/wallet/deposit",
  PAYMENT_SUCCESS: "/payment/success",
  PAYMENT_CANCEL: "/payment/cancel",
  CREATOR: "/creator",
  CREATE_QUIZ: "/creator/create-quiz",
  CREATE_COURSE: "/creator/create-course",
  QUIZ_BUILDER: "/creator/quiz-builder",
  WALLET_DETAILS: "/wallet/details",
  WALLET_COURSES: "/wallet/courses",
  WALLET_TRANSACTIONS: "/wallet/transactions",
  NOTIFICATIONS: "/notifications",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
