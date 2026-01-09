const httpStatus = require('http-status');
const {
  Question,
  QuestionSingleChoice,
  QuestionMultipleChoice,
  QuestionFillIn,
  LessonQuiz,
  Course,
  Lesson,
} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a question
 * @param {ObjectId} userId - User creating the question
 * @param {Object} questionBody
 * @returns {Promise<Question>}
 */
const createQuestion = async (userId, questionBody) => {
  let resource;

  // Create the appropriate resource based on question type
  if (questionBody.type === 'single_choice') {
    // Validate single choice: exactly one correct answer
    const correctCount = questionBody.options.filter((opt) => opt.is_correct).length;
    if (correctCount !== 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Single choice questions must have exactly one correct answer');
    }
    resource = await QuestionSingleChoice.create({
      options: questionBody.options,
      explanation: questionBody.explanation || '',
    });
  } else if (questionBody.type === 'multiple_choice') {
    // Validate multiple choice: at least one correct answer
    const correctCount = questionBody.options.filter((opt) => opt.is_correct).length;
    if (correctCount < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Multiple choice questions must have at least one correct answer');
    }
    resource = await QuestionMultipleChoice.create({
      options: questionBody.options,
      explanation: questionBody.explanation || '',
    });
  } else if (questionBody.type === 'fill_in') {
    // Validate fill-in: at least one correct answer
    if (!questionBody.correct_answers || questionBody.correct_answers.length < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Fill-in questions must have at least one correct answer');
    }
    resource = await QuestionFillIn.create({
      correct_answers: questionBody.correct_answers,
      explanation: questionBody.explanation || '',
    });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid question type');
  }

  // Create the main question
  const question = await Question.create({
    type: questionBody.type,
    difficulty: questionBody.difficulty || 'easy',
    content: questionBody.content,
    image_url: questionBody.image_url || '',
    resource_id: resource._id,
  });

  return question;
};

/**
 * Create single choice question
 * @param {ObjectId} userId - User creating the question
 * @param {Object} questionBody
 * @returns {Promise<Question>}
 */
const createSingleChoiceQuestion = async (userId, questionBody) => {
  const body = { ...questionBody, type: 'single_choice' };
  return createQuestion(userId, body);
};

/**
 * Create multiple choice question
 * @param {ObjectId} userId - User creating the question
 * @param {Object} questionBody
 * @returns {Promise<Question>}
 */
const createMultipleChoiceQuestion = async (userId, questionBody) => {
  const body = { ...questionBody, type: 'multiple_choice' };
  return createQuestion(userId, body);
};

/**
 * Create fill-in question
 * @param {ObjectId} userId - User creating the question
 * @param {Object} questionBody
 * @returns {Promise<Question>}
 */
const createFillInQuestion = async (userId, questionBody) => {
  const body = { ...questionBody, type: 'fill_in' };
  return createQuestion(userId, body);
};

/**
 * Query for questions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryQuestions = async (filter, options) => {
  const query = {};

  if (filter.type) {
    query.type = filter.type;
  }
  if (filter.difficulty) {
    query.difficulty = filter.difficulty;
  }
  if (filter.content) {
    query.content = { $regex: filter.content, $options: 'i' };
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Question.paginate) {
    return Question.paginate(query, {
      sortBy: sort,
      limit,
      page,
    });
  }

  const questions = await Question.find(query)
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);

  return { results: questions };
};

/**
 * Get question by id
 * @param {ObjectId} questionId
 * @param {ObjectId} userId - User requesting the question
 * @returns {Promise<Object>}
 */
const getQuestionById = async (questionId, userId) => {
  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  // Get the detailed question data
  let detail = null;
  if (question.type === 'single_choice') {
    detail = await QuestionSingleChoice.findById(question.resource_id);
  } else if (question.type === 'multiple_choice') {
    detail = await QuestionMultipleChoice.findById(question.resource_id);
  } else if (question.type === 'fill_in') {
    detail = await QuestionFillIn.findById(question.resource_id);
  }

  return { question, detail };
};

/**
 * Update question by id
 * @param {ObjectId} questionId
 * @param {Object} updateBody
 * @param {ObjectId} userId - User making the update
 * @returns {Promise<Question>}
 */
const updateQuestionById = async (questionId, updateBody, userId) => {
  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  // Update main question fields
  Object.assign(question, updateBody);
  await question.save();

  // Update resource-specific fields
  if (updateBody.resource) {
    if (question.type === 'single_choice') {
      await QuestionSingleChoice.findByIdAndUpdate(question.resource_id, updateBody.resource, { runValidators: true });
    } else if (question.type === 'multiple_choice') {
      await QuestionMultipleChoice.findByIdAndUpdate(question.resource_id, updateBody.resource, { runValidators: true });
    } else if (question.type === 'fill_in') {
      await QuestionFillIn.findByIdAndUpdate(question.resource_id, updateBody.resource, { runValidators: true });
    }
  }

  return question;
};

/**
 * Delete question by id
 * @param {ObjectId} questionId
 * @param {ObjectId} userId - User making the delete request
 * @returns {Promise<Question>}
 */
const deleteQuestionById = async (questionId, userId) => {
  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  // Delete the resource
  if (question.type === 'single_choice') {
    await QuestionSingleChoice.findByIdAndDelete(question.resource_id);
  } else if (question.type === 'multiple_choice') {
    await QuestionMultipleChoice.findByIdAndDelete(question.resource_id);
  } else if (question.type === 'fill_in') {
    await QuestionFillIn.findByIdAndDelete(question.resource_id);
  }

  // Remove question from all quizzes
  await LessonQuiz.updateMany({ question_ids: question._id }, { $pull: { question_ids: question._id } });

  await question.deleteOne();
  return question;
};

/**
 * Get questions by difficulty
 * @param {string} difficulty
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getQuestionsByDifficulty = async (difficulty, options = {}) => {
  const filter = { difficulty };
  return queryQuestions(filter, options);
};

/**
 * Get questions by type
 * @param {string} type
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getQuestionsByType = async (type, options = {}) => {
  const filter = { type };
  return queryQuestions(filter, options);
};

/**
 * Get questions by course (questions used in course quizzes)
 * @param {ObjectId} courseId
 * @param {ObjectId} userId - User requesting questions
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getQuestionsByCourse = async (courseId, userId, options = {}) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check authorization
  if (String(course.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access questions for this course');
  }

  // Find all quiz lessons in this course and get their question IDs
  const quizLessons = await Lesson.find({
    course_id: courseId,
    type: 'quiz',
  }).populate('resource_id');

  const questionIds = [];
  quizLessons.forEach((lesson) => {
    if (lesson.resource_id && lesson.resource_id.question_ids) {
      questionIds.push(...lesson.resource_id.question_ids);
    }
  });

  const uniqueQuestionIds = [...new Set(questionIds)];

  const filter = { _id: { $in: uniqueQuestionIds } };
  return queryQuestions(filter, options);
};

/**
 * Search questions
 * @param {Object} query - Search query
 * @returns {Promise<QueryResult>}
 */
const searchQuestions = async (query) => {
  const filter = {};

  if (query.q) {
    filter.$or = [{ content: { $regex: query.q, $options: 'i' } }];
  }

  if (query.type) filter.type = query.type;
  if (query.difficulty) filter.difficulty = query.difficulty;

  const options = {
    sortBy: query.sortBy || 'created_at:desc',
    limit: query.limit || 20,
    page: query.page || 1,
  };

  return queryQuestions(filter, options);
};

/**
 * Bulk create questions
 * @param {ObjectId} userId - User creating questions
 * @param {Array} questionsData - Array of question data
 * @returns {Promise<Question[]>}
 */
const bulkCreateQuestions = async (userId, questionsData) => {
  const createdQuestions = [];

  for (const questionData of questionsData) {
    try {
      const question = await createQuestion(userId, questionData);
      createdQuestions.push(question);
    } catch (error) {
      // Log error but continue with other questions
      console.error(`Failed to create question: ${error.message}`);
    }
  }

  return createdQuestions;
};

/**
 * Validate question answer
 * @param {ObjectId} questionId
 * @param {*} answer - User's answer
 * @param {ObjectId} userId - User submitting answer
 * @returns {Promise<Object>}
 */
const validateAnswer = async (questionId, answer, userId) => {
  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  let isCorrect = false;
  let correctAnswer = null;
  let explanation = '';

  if (question.type === 'single_choice') {
    const detail = await QuestionSingleChoice.findById(question.resource_id);
    const correctOption = detail.options.find((opt) => opt.is_correct);
    correctAnswer = correctOption ? correctOption.id : null;
    isCorrect = answer === correctAnswer;
    explanation = detail.explanation;
  } else if (question.type === 'multiple_choice') {
    const detail = await QuestionMultipleChoice.findById(question.resource_id);
    const correctOptions = detail.options.filter((opt) => opt.is_correct).map((opt) => opt.id);
    correctAnswer = correctOptions;
    isCorrect =
      Array.isArray(answer) &&
      answer.length === correctOptions.length &&
      answer.every((ans) => correctOptions.includes(ans));
    explanation = detail.explanation;
  } else if (question.type === 'fill_in') {
    const detail = await QuestionFillIn.findById(question.resource_id);
    correctAnswer = detail.correct_answers;
    isCorrect = detail.correct_answers.some((correct) => correct.toLowerCase().trim() === answer.toLowerCase().trim());
    explanation = detail.explanation;
  }

  return {
    questionId,
    isCorrect,
    correctAnswer,
    explanation,
    userAnswer: answer,
  };
};

/**
 * Get question statistics
 * @returns {Promise<Object>}
 */
const getQuestionStats = async () => {
  const totalQuestions = await Question.countDocuments();

  const questionsByType = await Question.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);

  const questionsByDifficulty = await Question.aggregate([{ $group: { _id: '$difficulty', count: { $sum: 1 } } }]);

  const questionsInQuizzes = await LessonQuiz.aggregate([
    { $unwind: '$question_ids' },
    { $group: { _id: null, total: { $sum: 1 } } },
  ]);

  return {
    totalQuestions,
    questionsByType,
    questionsByDifficulty,
    questionsInQuizzes: questionsInQuizzes[0]?.total || 0,
  };
};

module.exports = {
  createQuestion,
  createSingleChoiceQuestion,
  createMultipleChoiceQuestion,
  createFillInQuestion,
  queryQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
  getQuestionsByDifficulty,
  getQuestionsByType,
  getQuestionsByCourse,
  searchQuestions,
  bulkCreateQuestions,
  validateAnswer,
  getQuestionStats,
  // Keep legacy functions for backward compatibility
  getQuestionDetail: getQuestionById,
  updateQuestion: updateQuestionById,
  deleteQuestion: deleteQuestionById,
};
