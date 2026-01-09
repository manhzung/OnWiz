/**
 * Main App component
 * Sets up routing and global providers
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SearchProvider } from './contexts/SearchContext';
import { AuthProvider } from './contexts/AuthContext';

import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ErrorBoundary } from './components/common';
import {
  Home,
  About,
  Auth,
  Profile,
  Course,
  Courses,
  Learning,
  QuizResult,
  MyLearning,
  Classroom,
  ClassroomDetail,
  Wallet,
  WalletDetails,
  WalletCourses,
  WalletTransactions,
  Deposit,
  PaymentSuccess,
  PaymentCancel,
  Creator,
  CreateQuiz,
  CreateCourse,
  QuizBuilder,
  Notifications,
} from './pages';
import { Dashboard, Users, Groups, Payments } from './pages/admin';
import { ROUTES } from './config/routes';

function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <SearchProvider>
        <AuthProvider>
          <Routes>
        {/* Public routes with layout */}
        <Route
          path={ROUTES.HOME}
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.ABOUT}
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.COURSES}
          element={
            <MainLayout>
              <Courses />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.DEGREES}
          element={
            <MainLayout>
              <Courses />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.COURSE}
          element={
            <MainLayout>
              <Course />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.LEARNING}
          element={
            <MainLayout>
              <Learning />
            </MainLayout>
          }
        />
        <Route
          path={`${ROUTES.LEARNING}/lesson/:lessonId`}
          element={
            <MainLayout>
              <Learning />
            </MainLayout>
          }
        />
        <Route
          path={`${ROUTES.LEARNING}/lesson/:lessonId/result`}
          element={
            <MainLayout>
              <QuizResult />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.MY_LEARNING}
          element={
            <MainLayout>
              <MyLearning />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.CLASSROOM}
          element={
            <MainLayout>
              <Classroom />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.CLASSROOM_DETAIL}
          element={
            <MainLayout>
              <ClassroomDetail />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.WALLET}
          element={
            <MainLayout>
              <Wallet />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.WALLET_DETAILS}
          element={
            <MainLayout>
              <WalletDetails />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.WALLET_COURSES}
          element={
            <MainLayout>
              <WalletCourses />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.WALLET_TRANSACTIONS}
          element={
            <MainLayout>
              <WalletTransactions />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.DEPOSIT}
          element={
            <MainLayout>
              <Deposit />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.PAYMENT_SUCCESS}
          element={
            <MainLayout>
              <PaymentSuccess />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.PAYMENT_CANCEL}
          element={
            <MainLayout>
              <PaymentCancel />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.CREATOR}
          element={
            <MainLayout>
              <Creator />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.CREATE_QUIZ}
          element={
            <MainLayout>
              <CreateQuiz />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.CREATE_COURSE}
          element={
            <MainLayout>
              <CreateCourse />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.QUIZ_BUILDER}
          element={
            <MainLayout>
              <QuizBuilder />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.NOTIFICATIONS}
          element={
            <MainLayout>
              <Notifications />
            </MainLayout>
          }
        />
        {/* Auth routes without layout */}
        <Route path={ROUTES.LOGIN} element={<Auth />} />
        <Route path={ROUTES.REGISTER} element={<Auth />} />
        {/* Admin routes */}
        <Route
          path={ROUTES.ADMIN}
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_USERS}
          element={
            <AdminLayout>
              <Users />
            </AdminLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_GROUPS}
          element={
            <AdminLayout>
              <Groups />
            </AdminLayout>
          }
        />
        <Route
          path={ROUTES.ADMIN_PAYMENTS}
          element={
            <AdminLayout>
              <Payments />
            </AdminLayout>
          }
        />
          </Routes>
        </AuthProvider>
      </SearchProvider>
        <Toaster />
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
