/**
 * Theory Lesson page - Coursera style
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { ROUTES } from '../../../config/routes';

// ============================================================================
// Component
// ============================================================================

export const Theory = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);

  // ==========================================================================
  // Data (Mock data - sẽ thay bằng API call)
  // ==========================================================================

  const lesson = {
    id: lessonId || '1',
    title: 'What is React?',
    content: `
# What is React?

React is an open-source JavaScript library developed by Facebook for building user interfaces, especially for web applications.

## Key Features of React

### 1. Component-Based
React uses a component model, allowing you to create reusable components. Each component is an independent part of the user interface.

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
\`\`\`

### 2. Virtual DOM
React uses Virtual DOM to optimize interface updates. Instead of directly updating the real DOM, React creates a copy in memory and only updates the parts that have changed.

### 3. One-Way Data Binding
React uses one-way data flow, making code more predictable and easier to debug.

## Why Learn React?

- **Popular**: Used by many large companies like Facebook, Netflix, Airbnb
- **Large Community**: Many resources and support from the community
- **Job Opportunities**: High demand for React developers
- **Rich Ecosystem**: Many libraries and supporting tools

## Conclusion

React is a powerful tool for building modern web applications. With its component-based architecture and Virtual DOM, React helps you create fast and maintainable applications.
    `,
  };

  // ==========================================================================
  // Handlers
  // ==========================================================================

  const handleComplete = () => {
    setIsCompleted(true);
    // TODO: Mark lesson as completed via API
  };

  const handleNext = () => {
    // TODO: Navigate to next lesson
    navigate(`${ROUTES.LEARNING.replace(':courseId', courseId || '1')}/lesson/2`);
  };

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="w-full">
      <Card className="mb-0 border border-gray-200">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 m-0 leading-tight">
            {lesson.title}
          </h1>
          {isCompleted && (
            <span className="text-sm font-semibold text-green-600 px-3 py-1 bg-green-50 rounded">
              ✓ Completed
            </span>
          )}
        </div>

        <div className="mb-8">
          <div className="leading-[1.8] text-gray-900 prose prose-lg max-w-none">
            {lesson.content.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return <h1 key={index} className="text-4xl font-bold text-gray-900 mt-8 mb-6 leading-[1.3]">{line.substring(2)}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-semibold text-gray-900 mt-6 mb-4 leading-[1.4]">{line.substring(3)}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-semibold text-gray-900 mt-4 mb-2 leading-[1.4]">{line.substring(4)}</h3>;
              }
              if (line.startsWith('```')) {
                return null; // Skip code block markers for now
              }
              if (line.trim() === '') {
                return <br key={index} />;
              }
              return <p key={index} className="text-base text-gray-700 mb-4 leading-[1.8]">{line}</p>;
            })}
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
