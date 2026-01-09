/**
 * Quiz Result page
 */

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { ROUTES } from '../../../config/routes';
import { cn } from '../../../utils/cn';

// ============================================================================
// Component
// ============================================================================

export const QuizResult = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { questions, selectedAnswers, timeSpent } = location.state || {
    questions: [],
    selectedAnswers: {},
    timeSpent: 0,
  };

  // ==========================================================================
  // Calculations
  // ==========================================================================

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question: any) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const score = calculateScore();
  const isPassed = score.percentage >= 70;

  // ==========================================================================
  // Handlers
  // ==========================================================================

  const handleRetry = () => {
    navigate(`${ROUTES.LEARNING.replace(':courseId', courseId || '1')}/lesson/${lessonId}`);
  };

  const handleContinue = () => {
    // TODO: Navigate to next lesson
    navigate(ROUTES.LEARNING.replace(':courseId', courseId || '1'));
  };

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="w-full">
      <Card className="mb-0 border border-gray-200 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(124,58,237,0.1)] hover:border-primary before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-primary before:scale-x-0 before:transition-transform before:duration-300 before:origin-left hover:before:scale-x-100">
        <div className="text-center mb-12 pb-8 border-b border-gray-200">
          <div className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center text-5xl font-bold mx-auto mb-6',
            isPassed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          )}>
            {isPassed ? '✓' : '✗'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {isPassed ? 'Congratulations! You passed' : 'Sorry! You did not meet the requirements'}
          </h1>
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl font-bold text-[#0056d2]">{score.percentage}%</span>
            <span className="text-gray-600">
              {score.correct} / {score.total} correct
            </span>
          </div>
        </div>

        <div className="flex justify-around mb-8 pb-8 border-b border-gray-200">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 mb-1">Time spent:</span>
            <span className="text-xl font-bold text-gray-900">
              {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 mb-1">Score:</span>
            <span className="text-xl font-bold text-gray-900">{score.percentage}%</span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Answer Details</h3>
          <div className="flex flex-col gap-4">
            {questions.map((question: any, index: number) => {
              const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
              return (
                <div
                  key={question.id}
                  className={cn(
                    'p-6 rounded-xl border-2',
                    isCorrect ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'
                  )}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-[#0056d2]">Question {index + 1}</span>
                    <span className={cn(
                      'px-3 py-1 text-xs font-semibold rounded-full',
                      isCorrect ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    )}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <p className="text-gray-900 mb-4 font-medium">{question.question}</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Your answer:</span>
                      <span className={cn(
                        'text-sm font-semibold',
                        isCorrect ? 'text-green-600' : 'text-red-600'
                      )}>
                        {question.options[selectedAnswers[question.id]]}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Correct answer:</span>
                        <span className="text-sm font-semibold text-green-600">
                          {question.options[question.correctAnswer]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          {isPassed ? (
            <Button variant="primary" size="lg" onClick={handleContinue} fullWidth className="bg-[#0056d2] hover:bg-[#004494]">
              Continue Learning
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={handleRetry} fullWidth className="bg-[#0056d2] hover:bg-[#004494]">
              Retry Quiz
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

