/**
 * Create Quiz page - Create quiz with questions and settings
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ROUTES } from '../../config/routes';
import { showToast } from '../../utils';
import { QuizQuestion, QuizSettings, QUIZ_CATEGORIES, QuizCategory, QuizDifficulty } from '../../types';

// Use types from common types
type Question = QuizQuestion;

// ============================================================================
// Component
// ============================================================================

export const CreateQuiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'settings' | 'questions'>('settings');
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    title: '',
    description: '',
    category: 'General Knowledge' as QuizCategory,
    difficulty: 'medium' as QuizDifficulty,
    time_limit: 30,
    pass_score: 70,
    shuffle_questions: true,
    privacy: 'private',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('CreateQuiz component rendered at', new Date().toISOString());

  const addQuestion = (type: Question['type'] = 'single_choice') => {
    let options = undefined;
    let correct_answers = undefined;

    if (type === 'single_choice' || type === 'multiple_choice') {
      options = [
        { id: 1, text: '', is_correct: false },
        { id: 2, text: '', is_correct: false },
        { id: 3, text: '', is_correct: false },
        { id: 4, text: '', is_correct: false },
      ];
      if (type === 'single_choice') {
        options[0].is_correct = true; // Default first option as correct for single choice
      }
    } else if (type === 'fill_in') {
      correct_answers = [''];
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      content: '',
      options,
      correct_answers,
      explanation: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestionOption = (questionId: string, optionId: number, updates: Partial<{ text: string; is_correct: boolean }>) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        const updatedOptions = q.options.map(opt =>
          opt.id === optionId ? { ...opt, ...updates } : opt
        );
        return { ...q, options: updatedOptions };
      }
      return q;
    }));
  };

  const handleCreateQuiz = async () => {
    if (!quizSettings.title.trim()) {
      showToast.error('Please enter quiz title!');
      return;
    }

    if (!quizSettings.category || quizSettings.category === 'General Knowledge') {
      showToast.error('Please select a quiz category!');
      return;
    }

    if (questions.length === 0) {
      showToast.error('Please add at least one question!');
      return;
    }

    // Validate questions
    for (const question of questions) {
      if (!question.content.trim()) {
        showToast.error('All questions must have content!');
        return;
      }

      if (question.type === 'single_choice' || question.type === 'multiple_choice') {
        if (!question.options?.some(opt => opt.is_correct)) {
          showToast.error('Each question must have at least one correct answer!');
          return;
        }
        if (question.options.some(opt => !opt.text.trim())) {
          showToast.error('All options must have text!');
          return;
        }
      } else if (question.type === 'fill_in') {
        if (!question.correct_answers?.some(ans => ans.trim())) {
          showToast.error('Fill-in questions must have at least one correct answer!');
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare quiz data for API
      const quizData = {
        title: quizSettings.title,
        description: quizSettings.description || '',
        settings: {
          time_limit: quizSettings.time_limit,
          pass_score: quizSettings.pass_score,
          shuffle_questions: quizSettings.shuffle_questions,
        },
        privacy: quizSettings.privacy,
        questions: questions.map(q => ({
          type: q.type,
          content: q.content,
          options: q.options,
          correct_answers: q.correct_answers,
          explanation: q.explanation || '',
        }))
      };

      // For demo purposes, we'll use mock course/module IDs
      // In real implementation, you would select course and module first
      const mockCourseId = 'demo-course-id';
      const mockModuleId = 'demo-module-id';

      // Uncomment this when you have proper course/module selection
      // const result = await quizService.createQuiz(mockCourseId, mockModuleId, quizData);

      // For now, show success message
      console.log('Quiz data to be sent to API:', quizData);
      showToast.success(`Quiz "${quizSettings.title}" created successfully with ${questions.length} questions!\n\nNote: API integration requires course and module selection.`);
      navigate(ROUTES.CREATOR);
    } catch (error) {
      console.error('Failed to create quiz:', error);
      showToast.error('Failed to create quiz. Please try again.');
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
              <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
              <p className="text-gray-600">Build a comprehensive quiz with multiple question types</p>
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
          <div className={`flex items-center gap-2 ${currentStep === 'questions' ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'questions' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <span className="font-medium">Questions</span>
          </div>
        </div>

        {/* Step 1: Quiz Settings */}
        {currentStep === 'settings' && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quiz Settings</h2>

            <div className="space-y-6">
              <Input
                label="Quiz Title"
                placeholder="Example: Mathematics Quiz - Algebra Fundamentals"
                value={quizSettings.title}
                onChange={(e) => setQuizSettings({ ...quizSettings, title: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Brief description of the quiz content and objectives..."
                  value={quizSettings.description}
                  onChange={(e) => setQuizSettings({ ...quizSettings, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Time Limit (minutes)"
                  type="number"
                  min="1"
                  max="300"
                  placeholder="30"
                  value={quizSettings.time_limit}
                  onChange={(e) => setQuizSettings({ ...quizSettings, time_limit: parseInt(e.target.value) || 30 })}
                />

                <Input
                  label="Passing Score (%)"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="70"
                  value={quizSettings.pass_score}
                  onChange={(e) => setQuizSettings({ ...quizSettings, pass_score: parseInt(e.target.value) || 70 })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={quizSettings.category}
                    onChange={(e) => setQuizSettings({ ...quizSettings, category: e.target.value as QuizCategory })}
                  >
                    {QUIZ_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={quizSettings.difficulty}
                    onChange={(e) => setQuizSettings({ ...quizSettings, difficulty: e.target.value as QuizDifficulty })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Additional Settings
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="shuffle_questions"
                      checked={quizSettings.shuffle_questions}
                      onChange={(e) => setQuizSettings({ ...quizSettings, shuffle_questions: e.target.checked })}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <label htmlFor="shuffle_questions" className="text-sm text-gray-700">
                      Shuffle questions for each attempt
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={quizSettings.privacy}
                    onChange={(e) => setQuizSettings({ ...quizSettings, privacy: e.target.value as 'public' | 'private' })}
                  >
                    <option value="public">Public - Anyone can access</option>
                    <option value="private">Private - Only you can access</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="primary"
                onClick={() => setCurrentStep('questions')}
                disabled={!quizSettings.title.trim()}
              >
                Next: Create Questions
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Questions */}
        {currentStep === 'questions' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Questions ({questions.length})</h2>
              <div className="flex gap-3">
                <select
                  onChange={(e) => addQuestion(e.target.value as Question['type'])}
                  defaultValue=""
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="" disabled>Add Question Type</option>
                  <option value="single_choice">Single Choice</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="fill_in">Fill in the Blank</option>
                </select>
                <Button variant="primary" onClick={() => addQuestion()}>
                  + Add Question
                </Button>
              </div>
            </div>

            {questions.length === 0 ? (
              <Card className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">?</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-600 mb-4">Add your first question to start building the quiz</p>
                <Button variant="primary" onClick={() => addQuestion()}>
                  Add First Question
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <Card key={question.id} className="border-l-4 border-l-primary">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-gray-900">Question {index + 1}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          question.type === 'single_choice' ? 'bg-blue-100 text-blue-700' :
                          question.type === 'multiple_choice' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {question.type === 'single_choice' ? 'Single Choice' :
                           question.type === 'multiple_choice' ? 'Multiple Choice' :
                           'Fill in Blank'}
                        </span>
                      </div>
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Question Content"
                        placeholder="Enter the question..."
                        value={question.content}
                        onChange={(e) => updateQuestion(question.id, { content: e.target.value })}
                      />

                      {/* Options for Single/Multiple Choice */}
                      {(question.type === 'single_choice' || question.type === 'multiple_choice') && question.options && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Answer Options {question.type === 'multiple_choice' && '(Select all correct)'}
                          </label>
                          {question.options.map((option) => (
                            <div key={option.id} className="flex items-center gap-3 mb-2">
                              <input
                                type={question.type === 'single_choice' ? 'radio' : 'checkbox'}
                                name={`question-${question.id}`}
                                checked={option.is_correct}
                                onChange={(e) => updateQuestionOption(question.id, option.id, { is_correct: e.target.checked })}
                                className="w-4 h-4 text-primary focus:ring-primary"
                              />
                              <Input
                                placeholder={`Option ${option.id}`}
                                value={option.text}
                                onChange={(e) => updateQuestionOption(question.id, option.id, { text: e.target.value })}
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Correct Answers for Fill-in */}
                      {question.type === 'fill_in' && question.correct_answers && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Correct Answers (one per line)
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            rows={3}
                            placeholder="Enter correct answers (one per line)"
                            value={question.correct_answers.join('\n')}
                            onChange={(e) => updateQuestion(question.id, {
                              correct_answers: e.target.value.split('\n').filter(ans => ans.trim())
                            })}
                          />
                        </div>
                      )}

                      <Input
                        label="Explanation (optional)"
                        placeholder="Explain why this answer is correct..."
                        value={question.explanation || ''}
                        onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                      />
                    </div>
                  </Card>
                ))}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6">
                  <Button variant="outline" onClick={() => setCurrentStep('settings')}>
                    ← Go Back to Settings
                  </Button>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => addQuestion()}>
                      + Add Question
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleCreateQuiz}
                      disabled={questions.length === 0 || questions.some(q => !q.content.trim()) || isSubmitting}
                    >
                      {isSubmitting ? 'Creating Quiz...' : 'Create Quiz'}
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
