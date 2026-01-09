/**
 * Quiz Lesson page
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { ROUTES } from '../../../config/routes';
import { cn } from '../../../utils/cn';

// ============================================================================
// Types
// ============================================================================

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// ============================================================================
// Component
// ============================================================================

export const Quiz = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeRemaining] = useState(600); // 10 minutes in seconds

  // ==========================================================================
  // Data (Mock data - sẽ thay bằng API call)
  // ==========================================================================

  const questions: Question[] = [
    {
      id: '1',
      question: 'What is React?',
      options: [
        'A JavaScript framework',
        'A JavaScript library',
        'A programming language',
        'A build tool',
      ],
      correctAnswer: 1,
    },
    {
      id: '2',
      question: 'What is Virtual DOM in React?',
      options: [
        'A copy of the DOM in memory',
        'A part of the real DOM',
        'A new browser technology',
        'An external library',
      ],
      correctAnswer: 0,
    },
    {
      id: '3',
      question: 'What is a Component in React?',
      options: [
        'A regular JavaScript function',
        'An independent, reusable part of the interface',
        'A JavaScript variable',
        'A JavaScript object',
      ],
      correctAnswer: 1,
    },
  ];

  // ==========================================================================
  // Handlers
  // ==========================================================================

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = () => {
    const resultRoute = `${ROUTES.LEARNING.replace(':courseId', courseId || '1')}/lesson/${lessonId}/result`;
    navigate(resultRoute, {
      state: {
        questions,
        selectedAnswers,
        timeSpent: 600 - timeRemaining,
      },
    });
  };

  const isAllAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="w-full">
      <Card className="mb-0 border border-gray-200 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(124,58,237,0.1)] hover:border-primary before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-primary before:scale-x-0 before:transition-transform before:duration-300 before:origin-left hover:before:scale-x-100">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200 flex-wrap gap-4">
          <h1 className="text-[2.25rem] font-extrabold bg-gradient-primary bg-clip-text text-transparent m-0 leading-tight tracking-[-0.02em]">
            Quiz: Basic Knowledge
          </h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-primary/15 hover:to-secondary/15 hover:border-primary hover:scale-105">
            <span className="text-sm text-gray-600">Time remaining:</span>
            <span className="text-lg font-bold text-primary">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8 mb-8">
          {questions.map((question, index) => (
            <div key={question.id} className="px-8 py-6 bg-gradient-to-br from-primary/3 to-secondary/3 border border-gray-200 rounded-xl transition-all duration-300 hover:border-primary hover:shadow-[0_4px_12px_rgba(124,58,237,0.1)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-primary">Question {index + 1}</span>
                <span className="text-sm text-gray-600">/ {questions.length}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">{question.question}</h3>
              <div className="flex flex-col gap-3">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={cn(
                      'flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-250',
                      selectedAnswers[question.id] === optionIndex
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={optionIndex}
                      checked={selectedAnswers[question.id] === optionIndex}
                      onChange={() => handleAnswerSelect(question.id, optionIndex)}
                      className="w-5 h-5 accent-primary cursor-pointer"
                    />
                    <span className="text-gray-900 flex-1">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="mb-4 text-sm text-gray-600 text-center">
            Answered: {Object.keys(selectedAnswers).length} / {questions.length} questions
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={!isAllAnswered}
            fullWidth
            className="bg-[#0056d2] hover:bg-[#004494]"
          >
            Submit Quiz
          </Button>
        </div>
      </Card>
    </div>
  );
};

