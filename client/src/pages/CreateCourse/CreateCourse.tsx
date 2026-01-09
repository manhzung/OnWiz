/**
 * Create Course page - Create course with modules and lessons
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ROUTES } from '../../config/routes';
import { COURSE_CATEGORIES, CourseCategory } from '../../types';
import { showToast } from '../../utils';

// ============================================================================
// Types
// ============================================================================

interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'theory' | 'quiz';
  content?: string;
  duration?: number;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

interface CourseSettings {
  title: string;
  description?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  thumbnail?: string;
  isPublished: boolean;
}

// ============================================================================
// Component
// ============================================================================

export const CreateCourse = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'settings' | 'modules'>('settings');
  const [courseSettings, setCourseSettings] = useState<CourseSettings>({
    title: '',
    description: '',
    category: COURSE_CATEGORIES[0] as CourseCategory,
    level: 'beginner',
    price: 0,
    isPublished: false,
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('CreateCourse component rendered at', new Date().toISOString());

  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: '',
      description: '',
      lessons: [],
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules(modules.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: '',
      description: '',
      type: 'video',
      duration: 0,
    };

    setModules(modules.map(m =>
      m.id === moduleId
        ? { ...m, lessons: [...m.lessons, newLesson] }
        : m
    ));
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setModules(modules.map(m =>
      m.id === moduleId
        ? {
            ...m,
            lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
          }
        : m
    ));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m =>
      m.id === moduleId
        ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
        : m
    ));
  };

  const handleCreateCourse = async () => {
    if (!courseSettings.title.trim()) {
      showToast.error('Please enter course title!');
      return;
    }

    if (!courseSettings.category.trim()) {
      showToast.error('Please enter course category!');
      return;
    }

    if (modules.length === 0) {
      showToast.error('Please add at least one module!');
      return;
    }

    // Validate modules
    for (const module of modules) {
      if (!module.title.trim()) {
        showToast.error('All modules must have a title!');
        return;
      }
      if (module.lessons.length === 0) {
        showToast.error(`Module "${module.title}" must have at least one lesson!`);
        return;
      }

      // Validate lessons
      for (const lesson of module.lessons) {
        if (!lesson.title.trim()) {
          showToast.error('All lessons must have a title!');
          return;
        }
        if (lesson.type === 'video' && (!lesson.duration || lesson.duration <= 0)) {
          showToast.error(`Lesson "${lesson.title}" must have a valid duration!`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare course data for API
      const courseData = {
        ...courseSettings,
        modules: modules.map(m => ({
          title: m.title,
          description: m.description || '',
          lessons: m.lessons.map(l => ({
            title: l.title,
            description: l.description || '',
            type: l.type,
            content: l.content || '',
            duration: l.duration || 0,
          }))
        }))
      };

      // For demo purposes, show success message
      // In real implementation, you would call courseService.createCourse()
      console.log('Course data to be sent to API:', courseData);
      showToast.success(`Course "${courseSettings.title}" created successfully with ${modules.length} modules and ${modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons!`);
      navigate(ROUTES.CREATOR);
    } catch (error) {
      console.error('Failed to create course:', error);
      showToast.error('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    console.log('Navigating back to creator');
    navigate(ROUTES.CREATOR);
  };

  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleGoBack}
              className="text-gray-400 hover:text-gray-600"
            >
              ← Go Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600">Build a comprehensive course with modules and lessons</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-8 mb-8">
          <div className={`flex items-center gap-2 ${currentStep === 'settings' ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'settings' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <span className="font-medium">Settings</span>
          </div>
          <div className="w-16 h-px bg-gray-200"></div>
          <div className={`flex items-center gap-2 ${currentStep === 'modules' ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'modules' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <span className="font-medium">Modules & Lessons</span>
          </div>
        </div>

        {/* Step 1: Course Settings */}
        {currentStep === 'settings' && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Settings</h2>

            <div className="space-y-6">
              <Input
                label="Course Title"
                placeholder="Example: Complete Web Development Bootcamp"
                value={courseSettings.title}
                onChange={(e) => setCourseSettings({ ...courseSettings, title: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Detailed description of what students will learn..."
                  value={courseSettings.description}
                  onChange={(e) => setCourseSettings({ ...courseSettings, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={courseSettings.category}
                    onChange={(e) => setCourseSettings({ ...courseSettings, category: e.target.value as CourseCategory })}
                  >
                    {COURSE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={courseSettings.level}
                    onChange={(e) => setCourseSettings({ ...courseSettings, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Price (VND)"
                  type="number"
                  min="0"
                  placeholder="50000"
                  value={courseSettings.price}
                  onChange={(e) => setCourseSettings({ ...courseSettings, price: parseInt(e.target.value) || 0 })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publication Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={courseSettings.isPublished ? 'published' : 'draft'}
                    onChange={(e) => setCourseSettings({ ...courseSettings, isPublished: e.target.value === 'published' })}
                  >
                    <option value="draft">Draft - Private</option>
                    <option value="published">Published - Public</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="primary"
                onClick={() => setCurrentStep('modules')}
                disabled={!courseSettings.title.trim() || !courseSettings.category.trim()}
              >
                Next: Create Modules
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Modules & Lessons */}
        {currentStep === 'modules' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Modules ({modules.length})</h2>
              <Button variant="primary" onClick={addModule}>
                + Add Module
              </Button>
            </div>

            {modules.length === 0 ? (
              <Card className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📚</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
                <p className="text-gray-600 mb-4">Add your first module to start building the course</p>
                <Button variant="primary" onClick={addModule}>
                  Add First Module
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {modules.map((module, moduleIndex) => (
                  <Card key={module.id} className="border-l-4 border-l-green-500">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-gray-900">Module {moduleIndex + 1}</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {module.lessons.length} lessons
                        </span>
                      </div>
                      <button
                        onClick={() => removeModule(module.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>

                    <div className="space-y-4 mb-6">
                      <Input
                        label="Module Title"
                        placeholder="Example: Introduction to HTML & CSS"
                        value={module.title}
                        onChange={(e) => updateModule(module.id, { title: e.target.value })}
                      />

                      <Input
                        label="Module Description (optional)"
                        placeholder="Brief description of this module..."
                        value={module.description || ''}
                        onChange={(e) => updateModule(module.id, { description: e.target.value })}
                      />
                    </div>

                    {/* Lessons */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-900">Lessons</h4>
                        <Button variant="outline" size="sm" onClick={() => addLesson(module.id)}>
                          + Add Lesson
                        </Button>
                      </div>

                      {module.lessons.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No lessons in this module yet
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-600 w-6">{lessonIndex + 1}.</span>

                              <Input
                                placeholder="Lesson title..."
                                value={lesson.title}
                                onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                                className="flex-1"
                              />

                              <select
                                value={lesson.type}
                                onChange={(e) => updateLesson(module.id, lesson.id, { type: e.target.value as Lesson['type'] })}
                                className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="video">Video</option>
                                <option value="theory">Theory</option>
                                <option value="quiz">Quiz</option>
                              </select>

                              {lesson.type === 'video' && (
                                <Input
                                  type="number"
                                  placeholder="Duration (min)"
                                  value={lesson.duration || ''}
                                  onChange={(e) => updateLesson(module.id, lesson.id, { duration: parseInt(e.target.value) || 0 })}
                                  className="w-24"
                                />
                              )}

                              <button
                                onClick={() => removeLesson(module.id, lesson.id)}
                                className="text-red-400 hover:text-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6">
                  <Button variant="outline" onClick={() => setCurrentStep('settings')}>
                    ← Go Back to Settings
                  </Button>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={addModule}>
                      + Add Module
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleCreateCourse}
                      disabled={modules.length === 0 || modules.some(m => !m.title.trim() || m.lessons.length === 0) || isSubmitting}
                    >
                      {isSubmitting ? 'Creating Course...' : 'Create Course'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
