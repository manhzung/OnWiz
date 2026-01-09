/**
 * Learning Page - Main course learning interface
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Card } from '../../components/common/Card';
import { Theory } from './Theory/Theory';
import { Quiz } from './Quiz/Quiz';
import { Video } from './Video/Video';
import { ROUTES } from '../../config/routes';

// ============================================================================
// Types
// ============================================================================

interface Lesson {
  id: string;
  title: string;
  type: 'theory' | 'quiz' | 'video';
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

// ============================================================================
// Component
// ============================================================================

export const Learning = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(lessonId || null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  // ==========================================================================
  // Data (Mock data - sẽ thay bằng API call)
  // ==========================================================================

  const course = {
    id: courseId || '1',
    title: 'React from Basics to Advanced',
    progress: 35,
  };

  const modules: Module[] = [
    {
      id: '1',
      title: 'Introduction to React',
      lessons: [
        { id: '1', title: 'What is React?', type: 'theory', duration: '15:30', isCompleted: true, isLocked: false },
        { id: '2', title: 'Environment Setup', type: 'video', duration: '20:15', isCompleted: true, isLocked: false },
        { id: '3', title: 'Quiz: Basic Knowledge', type: 'quiz', duration: '10:00', isCompleted: false, isLocked: false },
      ],
    },
    {
      id: '2',
      title: 'Components and Props',
      lessons: [
        { id: '4', title: 'Functional Components', type: 'theory', duration: '18:20', isCompleted: false, isLocked: false },
        { id: '5', title: 'Props and State', type: 'video', duration: '22:10', isCompleted: false, isLocked: true },
        { id: '6', title: 'Quiz: Components', type: 'quiz', duration: '15:00', isCompleted: false, isLocked: true },
      ],
    },
    {
      id: '3',
      title: 'Hooks and State Management',
      lessons: [
        { id: '7', title: 'useState Hook', type: 'theory', duration: '24:15', isCompleted: false, isLocked: true },
        { id: '8', title: 'useEffect Hook', type: 'video', duration: '28:40', isCompleted: false, isLocked: true },
        { id: '9', title: 'Quiz: Hooks', type: 'quiz', duration: '20:00', isCompleted: false, isLocked: true },
      ],
    },
  ];

  // ==========================================================================
  // Effects
  // ==========================================================================

  useEffect(() => {
    // Find current lesson from URL
    if (lessonId) {
      const lesson = modules
        .flatMap((m) => m.lessons)
        .find((l) => l.id === lessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        setCurrentLessonId(lesson.id);
        // Find and select the module containing this lesson
        const module = modules.find((m) => m.lessons.some((l) => l.id === lessonId));
        if (module) {
          setSelectedModule(module.id);
        }
      }
    } else {
      // Auto-select first module and first unlocked lesson
      if (modules.length > 0 && !selectedModule) {
        const firstModule = modules[0];
        setSelectedModule(firstModule.id);
        const firstUnlockedLesson = firstModule.lessons.find((lesson) => !lesson.isLocked);
        if (firstUnlockedLesson) {
          setCurrentLesson(firstUnlockedLesson);
          setCurrentLessonId(firstUnlockedLesson.id);
          navigateToLesson(firstUnlockedLesson.id);
        }
      }
    }
  }, [lessonId]);

  // ==========================================================================
  // Handlers
  // ==========================================================================

  const navigateToLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    const lessonRoute = `${ROUTES.LEARNING.replace(':courseId', course.id)}/lesson/${lessonId}`;
    navigate(lessonRoute);
  };

  const toggleModule = (moduleId: string) => {
    setSelectedModule(selectedModule === moduleId ? null : moduleId);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'theory':
        return 'T';
      case 'quiz':
        return 'Q';
      case 'video':
        return 'V';
      default:
        return '•';
    }
  };

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-200px)]">
      <div className="bg-gradient-primary text-white py-8 px-6 relative overflow-hidden before:content-[''] before:absolute before:-top-1/2 before:-right-[20%] before:w-[600px] before:h-[600px] before:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] before:rounded-full before:pointer-events-none after:content-[''] after:absolute after:-bottom-[30%] after:-left-[10%] after:w-[400px] after:h-[400px] after:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] after:rounded-full after:pointer-events-none">
        <div className="max-w-8xl mx-auto flex flex-col gap-4 relative z-[1]">
          <h1 className="text-[1.75rem] font-bold m-0 leading-tight">{course.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-250"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold whitespace-nowrap">{course.progress}% complete</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-8 max-w-8xl mx-auto px-6 py-8 w-full max-lg:grid-cols-1">
        {/* Sidebar */}
        <div className="sticky top-8 h-fit max-lg:sticky max-lg:top-0 max-lg:z-10">
          <Card title="Course Content">
            <div className="flex flex-col gap-2">
              {modules.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-primary">
                        {selectedModule === module.id ? '▼' : '▶'}
                      </span>
                      <h3 className="text-base font-semibold text-gray-900 m-0">{module.title}</h3>
                    </div>
                    <span className="text-sm text-gray-600">
                      {module.lessons.length} lessons
                    </span>
                  </div>
                  {selectedModule === module.id && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`flex justify-between items-center p-3 border-b border-gray-200 last:border-b-0 cursor-pointer transition-colors ${
                            currentLessonId === lesson.id
                              ? 'bg-primary/10 border-l-4 border-l-primary'
                              : 'hover:bg-gray-100'
                          } ${lesson.isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                          onClick={() => !lesson.isLocked && navigateToLesson(lesson.id)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-lg flex-shrink-0">{getLessonIcon(lesson.type)}</span>
                            <span className="text-sm text-gray-900 truncate">{lesson.title}</span>
                            {lesson.isCompleted && (
                              <span className="text-success text-sm flex-shrink-0">✓</span>
                            )}
                            {lesson.isLocked && (
                              <span className="text-gray-400 text-sm flex-shrink-0">🔒</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-600 flex-shrink-0 ml-2">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="min-w-0">
          {currentLesson ? (
            <>
              {currentLesson.type === 'theory' && <Theory />}
              {currentLesson.type === 'quiz' && <Quiz />}
              {currentLesson.type === 'video' && <Video />}
            </>
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-600 m-0">Select a lesson from the sidebar to begin</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

