/**
 * Auth page - Coursera style (Login and Register)
 */

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks';
import { ROUTES } from '../../config/routes';
import { isValidEmail, isValidPassword } from '../../utils/validation';
import { cn } from '../../utils/cn';

// ============================================================================
// Types
// ============================================================================

type AuthMode = 'login' | 'register';

// ============================================================================
// Component
// ============================================================================

export const Auth = () => {
  // ==========================================================================
  // Hooks & Router
  // ==========================================================================
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, register } = useAuth();

  // ==========================================================================
  // State Management
  // ==========================================================================
  const initialMode: AuthMode = 
    location.pathname === ROUTES.REGISTER || location.pathname.includes('register')
      ? 'register'
      : 'login';
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ==========================================================================
  // Effects
  // ==========================================================================
  
  // Update mode when URL changes
  useEffect(() => {
    const newMode: AuthMode = 
      location.pathname === ROUTES.REGISTER || location.pathname.includes('register')
        ? 'register'
        : 'login';
    if (newMode !== mode) {
      setMode(newMode);
    }
  }, [location.pathname, mode]);

  // ==========================================================================
  // Handlers
  // ==========================================================================
  
  const switchMode = (newMode: AuthMode) => {
    if (newMode === 'login') {
      navigate(ROUTES.LOGIN);
    } else {
      navigate(ROUTES.REGISTER);
    }
    setErrors({});
    // Clear form data and reset visibility when switching
    setLoginData({ email: '', password: '' });
    setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ==========================================================================
  // Validation
  // ==========================================================================
  
  const validateLogin = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(loginData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!registerData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (registerData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!registerData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(registerData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!registerData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(registerData.password)) {
      newErrors.password =
        'Password must be at least 8 characters, including uppercase, lowercase, and numbers';
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==========================================================================
  // Form Submission
  // ==========================================================================
  
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateLogin()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(loginData);
      toast.success('Login successful!');
      navigate(ROUTES.HOME);
    } catch (error: any) {
      setErrors({
        submit: error.message || 'Login failed. Please try again.',
      });
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateRegister()) {
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: registerData.name.trim(),
        email: registerData.email,
        password: registerData.password,
      });
      toast.success('Registration successful! Please log in.');
      navigate(ROUTES.LOGIN);
      setIsLoading(false);
    } catch (error: any) {
      setErrors({
        submit: error.message || 'Registration failed. Please try again.',
      });
      setIsLoading(false);
    }
  };

  // ==========================================================================
  // Render
  // ==========================================================================
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-[500px] bg-white rounded-xl p-12 shadow-lg border border-gray-200 max-sm:p-8">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            className={cn(
              'flex-1 px-6 py-4 border-none bg-transparent text-gray-600 font-medium text-sm rounded-lg cursor-pointer transition-all duration-250',
              'hover:text-primary',
              mode === 'login' && 'text-primary bg-white shadow-sm font-semibold'
            )}
            onClick={() => switchMode('login')}
          >
            Log In
          </button>
          <button
            type="button"
            className={cn(
              'flex-1 px-6 py-4 border-none bg-transparent text-gray-600 font-medium text-sm rounded-lg cursor-pointer transition-all duration-250',
              'hover:text-primary',
              mode === 'register' && 'text-primary bg-white shadow-sm font-semibold'
            )}
            onClick={() => switchMode('register')}
          >
            Sign Up
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-600">
            {mode === 'login'
              ? 'Log in to continue learning'
              : 'Sign up to start your learning journey'}
          </p>
        </div>

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
            {errors.submit && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {errors.submit}
              </div>
            )}

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="your.email@example.com"
              value={loginData.email}
              onChange={handleLoginChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleLoginChange}
              error={errors.password}
              required
              autoComplete="current-password"
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-transparent border-none cursor-pointer p-0 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              }
            />

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
                <input type="checkbox" className="w-4 h-4 cursor-pointer accent-primary" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-primary hover:text-primary-hover font-medium transition-colors bg-transparent border-none cursor-pointer"
                onClick={() => {
                  // TODO: Implement forgot password
                }}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-6">
            {errors.submit && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {errors.submit}
              </div>
            )}

            <Input
              type="text"
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              value={registerData.name}
              onChange={handleRegisterChange}
              error={errors.name}
              required
              autoComplete="name"
            />

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="your.email@example.com"
              value={registerData.email}
              onChange={handleRegisterChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              label="Password"
              placeholder="Create a strong password"
              value={registerData.password}
              onChange={handleRegisterChange}
              error={errors.password}
              required
              autoComplete="new-password"
              helperText="At least 8 characters, including uppercase, lowercase, and numbers"
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-transparent border-none cursor-pointer p-0 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              }
            />

            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="bg-transparent border-none cursor-pointer p-0 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              }
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
