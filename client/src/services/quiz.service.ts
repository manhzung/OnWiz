/**
 * Quiz Service
 * Handles quiz creation and management API calls
 */

import { apiClient } from '../utils/apiClient';

// Types
interface QuizSettings {
  time_limit: number;
  pass_score: number;
  shuffle_questions: boolean;
}

interface QuestionOption {
  id: number;
  text: string;
  is_correct: boolean;
}

interface CreateQuestionData {
  type: 'single_choice' | 'multiple_choice' | 'fill_in';
  content: string;
  options?: QuestionOption[];
  correct_answers?: string[];
  explanation?: string;
}

interface CreateQuizData {
  title: string;
  description?: string;
  settings: QuizSettings;
  privacy: 'public' | 'private';
  questions: CreateQuestionData[];
}

interface QuizResponse {
  id: string;
  title: string;
  description?: string;
  settings: QuizSettings;
  privacy: 'public' | 'private';
  question_ids: string[];
  created_at: string;
  updated_at: string;
}

class QuizService {
  /**
   * Create a new quiz with questions
   */
  async createQuiz(courseId: string, moduleId: string, quizData: CreateQuizData): Promise<QuizResponse> {
    // First create the lesson with quiz type
    const lessonData = {
      title: quizData.title,
      description: quizData.description,
      type: 'quiz',
      content: {
        settings: quizData.settings
      }
    };

    const lessonResponse = await apiClient.post(`/courses/${courseId}/modules/${moduleId}/lessons`, lessonData);

    if (!lessonResponse.success) {
      throw new Error('Failed to create lesson');
    }

    const lesson = lessonResponse.data;

    // Then add questions to the quiz
    const questionIds: string[] = [];

    for (const question of quizData.questions) {
      const questionResponse = await apiClient.post(`/courses/quizzes/${lesson.quiz_id}/questions`, question);

      if (questionResponse.success) {
        questionIds.push(questionResponse.data.id);
      }
    }

    return {
      ...lesson,
      question_ids: questionIds
    };
  }

  /**
   * Get quiz details with questions
   */
  async getQuiz(quizId: string) {
    const response = await apiClient.get(`/courses/quizzes/${quizId}`);
    return response;
  }

  /**
   * Update quiz settings
   */
  async updateQuiz(quizId: string, updates: Partial<CreateQuizData>) {
    const response = await apiClient.put(`/courses/quizzes/${quizId}`, updates);
    return response;
  }

  /**
   * Delete quiz
   */
  async deleteQuiz(quizId: string) {
    const response = await apiClient.delete(`/courses/quizzes/${quizId}`);
    return response;
  }

  /**
   * Add question to quiz
   */
  async addQuestion(quizId: string, questionData: CreateQuestionData) {
    const response = await apiClient.post(`/courses/quizzes/${quizId}/questions`, questionData);
    return response;
  }

  /**
   * Update question
   */
  async updateQuestion(questionId: string, questionData: Partial<CreateQuestionData>) {
    const response = await apiClient.put(`/questions/${questionId}`, questionData);
    return response;
  }

  /**
   * Delete question
   */
  async deleteQuestion(questionId: string) {
    const response = await apiClient.delete(`/questions/${questionId}`);
    return response;
  }

  /**
   * Get questions for a quiz
   */
  async getQuizQuestions(quizId: string) {
    const response = await apiClient.get(`/courses/quizzes/${quizId}/questions`);
    return response;
  }
}

export const quizService = new QuizService();
