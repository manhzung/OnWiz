/**
 * Video Lesson page
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { ROUTES } from '../../../config/routes';

// ============================================================================
// Component
// ============================================================================

export const Video = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // ==========================================================================
  // Data (Mock data - sẽ thay bằng API call)
  // ==========================================================================

  const lesson = {
    id: lessonId || '1',
    title: 'Environment Setup',
    videoUrl: '', // Placeholder for video URL
    description: 'Detailed guide on how to set up the React development environment on your computer.',
    duration: '20:15',
  };

  // ==========================================================================
  // Handlers
  // ==========================================================================

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    // TODO: Mark lesson as completed via API
  };

  const handleNext = () => {
    // TODO: Navigate to next lesson
    navigate(`${ROUTES.LEARNING.replace(':courseId', courseId || '1')}/lesson/3`);
  };

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="w-full">
      <Card className="mb-0 border border-gray-200 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(124,58,237,0.1)] hover:border-primary before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-primary before:scale-x-0 before:transition-transform before:duration-300 before:origin-left hover:before:scale-x-100">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-[2.25rem] font-extrabold bg-gradient-primary bg-clip-text text-transparent m-0 leading-tight tracking-[-0.02em]">
            {lesson.title}
          </h1>
          {isCompleted && (
            <span className="text-sm font-semibold text-green-600 px-3 py-1 bg-green-50 rounded">
              ✓ Completed
            </span>
          )}
        </div>

        <div className="mb-8">
          <div className="w-full mb-8">
            {!isPlaying ? (
              <div
                className="w-full aspect-video bg-gradient-primary rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_25px_80px_rgba(124,58,237,0.4)] relative overflow-hidden shadow-[0_20px_60px_rgba(124,58,237,0.3)] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_70%)] before:rounded-full before:translate-x-[-50%] before:translate-y-[-50%] before:transition-all before:duration-500 hover:before:w-[400px] hover:before:h-[400px]"
                onClick={handlePlay}
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl mb-4 backdrop-blur-sm relative z-[1]">
                  ▶
                </div>
                <p className="text-white/90 relative z-[1]">Click to play video</p>
              </div>
            ) : (
              <div className="w-full aspect-video bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-white">
                <p className="mb-2">Video player will be integrated here</p>
                <p className="text-sm text-white/80">Duration: {lesson.duration}</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Lesson Description</h3>
            <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          {!isCompleted ? (
            <Button variant="primary" size="lg" onClick={handleComplete} fullWidth className="bg-[#0056d2] hover:bg-[#004494]">
              Mark as Completed
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={handleNext} fullWidth className="bg-[#0056d2] hover:bg-[#004494]">
              Continue to Next Lesson
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

