/**
 * Quiz Builder page - Create quiz with questions
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ROUTES } from '../../config/routes';

// ============================================================================
// Types
// ============================================================================

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// ============================================================================
// Component
// ============================================================================

export const QuizBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState<'settings' | 'questions'>('settings');

  useEffect(() => {
    // Get data from navigation state
    if (location.state) {
      setQuizTitle(location.state.title || '');
      setQuizDescription(location.state.description || '');
    }
  }, [location.state]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handlePublish = () => {
    // Mock publish - in real app this would save to backend
    alert('Quiz created successfully! Share link: onwiz.com/quiz/demo123');

    // Navigate back to creator page
    navigate(ROUTES.CREATOR);
  };

  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(ROUTES.CREATOR)}
              className="text-gray-400 hover:text-gray-600"
            >
              ← Go Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Quiz</h1>
              <p className="text-gray-600">Build a set of multiple choice questions</p>
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

            <div className="space-y-4">
              <Input
                label="Quiz Name"
                placeholder="Example: Math Quiz - Algebra Basics"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of the quiz..."
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Time Limit (minutes)"
                  type="number"
                  placeholder="Unlimited"
                  defaultValue=""
                />

                <Input
                  label="Passing Score (%)"
                  type="number"
                  placeholder="70"
                  defaultValue="70"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="public">Public - Everyone can see</option>
                    <option value="private">Private - Only me</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="primary"
                onClick={() => setCurrentStep('questions')}
                disabled={!quizTitle.trim()}
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
              <Button variant="primary" onClick={addQuestion}>
                + Add Question
              </Button>
            </div>

            {questions.length === 0 ? (
              <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">?</span>
              </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-600 mb-4">Add your first question to start building the quiz</p>
                <Button variant="primary" onClick={addQuestion}>
                  Add First Question
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <Card key={question.id} className="border-l-4 border-l-primary">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Question {index + 1}</h3>
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Question"
                        placeholder="Enter question..."
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Answer Options
                        </label>
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-3 mb-2">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              checked={question.correctAnswer === optIndex}
                              onChange={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                              className="w-4 h-4 text-primary"
                            />
                            <Input
                              placeholder={`Option ${optIndex + 1}`}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[optIndex] = e.target.value;
                                updateQuestion(question.id, 'options', newOptions);
                              }}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </div>

                      <Input
                        label="Answer Explanation (optional)"
                        placeholder="Explain why this answer is correct..."
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
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
                    <Button variant="outline" onClick={addQuestion}>
                      + Add Question
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handlePublish}
                      disabled={questions.length === 0 || questions.some(q => !q.question.trim())}
                    >
                      Publish Quiz
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
