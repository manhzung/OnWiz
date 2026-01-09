const httpStatus = require('http-status');
const { Attempt, Lesson, LessonQuiz, Enrollment, Course } = require('../models');
const ApiError = require('../utils/ApiError');
const { questionService } = require('./question.service');

/**
 * Create an attempt
 * @param {ObjectId} userId - User starting the attempt
 * @param {Object} attemptBody
 * @returns {Promise<Attempt>}
 */
const createAttempt = async (userId, attemptBody) => {
  // Verify quiz lesson exists and is a quiz
  const lesson = await Lesson.findById(attemptBody.quiz_lesson_id).populate('course_id');

  if (!lesson) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Quiz lesson not found');
  }

  if (lesson.type !== 'quiz') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Lesson is not a quiz');
  }

  // Check if user is enrolled in the course
  const enrollment = await Enrollment.findOne({
    user_id: userId,
    course_id: lesson.course_id._id,
  });

  if (!enrollment) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User is not enrolled in this course');
  }

  // Check if there's already an unsubmitted attempt for this quiz
  const existingAttempt = await Attempt.findOne({
    user_id: userId,
    quiz_lesson_id: attemptBody.quiz_lesson_id,
    submitted_at: { $exists: false },
  });

  if (existingAttempt) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'An unsubmitted attempt already exists for this quiz');
  }

  const attempt = await Attempt.create({
    user_id: userId,
    quiz_lesson_id: attemptBody.quiz_lesson_id,
    score: 0, // Will be calculated on submission
    is_passed: false, // Will be calculated on submission
    answers: [],
    started_at: new Date(),
  });

  return attempt;
};

/**
 * Query for attempts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {Object} currentUser - User making the request
 * @returns {Promise<QueryResult>}
 */
const queryAttempts = async (filter, options, currentUser) => {
  const query = {};

  // Apply role-based filtering
  if (currentUser.role !== 'admin') {
    query.user_id = currentUser._id;
  } else if (filter.user_id) {
    query.user_id = filter.user_id;
  }

  if (filter.quiz_lesson_id) {
    query.quiz_lesson_id = filter.quiz_lesson_id;
  }
  if (filter.is_passed !== undefined) {
    query.is_passed = filter.is_passed;
  }
  if (filter.date_from) {
    query.started_at = { ...query.started_at, $gte: new Date(filter.date_from) };
  }
  if (filter.date_to) {
    query.started_at = { ...query.started_at, $lte: new Date(filter.date_to) };
  }
  if (filter.score_min !== undefined) {
    query.score = { ...query.score, $gte: filter.score_min };
  }
  if (filter.score_max !== undefined) {
    query.score = { ...query.score, $lte: filter.score_max };
  }

  const sort = options.sortBy || 'started_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Attempt.paginate) {
    return Attempt.paginate(query, {
      sortBy: sort,
      limit,
      page,
      populate: [
        { path: 'user_id', select: 'name email' },
        { path: 'quiz_lesson_id', select: 'title' },
      ],
    });
  }

  const attempts = await Attempt.find(query)
    .populate('user_id', 'name email')
    .populate('quiz_lesson_id', 'title')
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);

  return { results: attempts };
};

/**
 * Get attempt by id
 * @param {ObjectId} attemptId
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Attempt>}
 */
const getAttemptById = async (attemptId, currentUser) => {
  const attempt = await Attempt.findById(attemptId)
    .populate('user_id', 'name email')
    .populate('quiz_lesson_id', 'title')
    .populate('answers.question_id', 'content type');

  if (!attempt) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Attempt not found');
  }

  // Check authorization
  if (currentUser.role !== 'admin' && String(attempt.user_id._id) !== String(currentUser._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this attempt');
  }

  return attempt;
};

/**
 * Update attempt by id (Admin only)
 * @param {ObjectId} attemptId
 * @param {Object} updateBody
 * @param {Object} currentUser - User making the update
 * @returns {Promise<Attempt>}
 */
const updateAttemptById = async (attemptId, updateBody, currentUser) => {
  const attempt = await Attempt.findById(attemptId);
  if (!attempt) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Attempt not found');
  }

  // Only admin can update attempts
  if (currentUser.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update attempts');
  }

  Object.assign(attempt, updateBody);
  await attempt.save();
  return attempt;
};

/**
 * Delete attempt by id (Admin only)
 * @param {ObjectId} attemptId
 * @param {Object} currentUser - User making the delete request
 * @returns {Promise<Attempt>}
 */
const deleteAttemptById = async (attemptId, currentUser) => {
  const attempt = await Attempt.findById(attemptId);
  if (!attempt) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Attempt not found');
  }

  // Only admin can delete attempts
  if (currentUser.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete attempts');
  }

  await attempt.deleteOne();
  return attempt;
};

/**
 * Get attempts by user
 * @param {ObjectId} userId
 * @param {Object} currentUser - User making the request
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getAttemptsByUser = async (userId, currentUser, options = {}) => {
  // Check authorization
  const isSelf = String(userId) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isSelf && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to view attempts for this user');
  }

  const filter = { user_id: userId };
  const queryOptions = {
    sortBy: options.sortBy || 'started_at:desc',
    limit: options.limit || 20,
    page: options.page || 1,
  };

  return queryAttempts(filter, queryOptions, currentUser);
};

/**
 * Get attempts by quiz
 * @param {ObjectId} quizId
 * @param {Object} currentUser - User making the request
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getAttemptsByQuiz = async (quizId, currentUser, options = {}) => {
  const lesson = await Lesson.findById(quizId).populate('course_id');
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
  }

  // Check if user is instructor of the course or enrolled student
  const isInstructor = String(lesson.course_id.instructor_id) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isInstructor && !isAdmin) {
    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user_id: currentUser._id,
      course_id: lesson.course_id._id,
    });

    if (!enrollment) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to view attempts for this quiz');
    }
  }

  const filter = { quiz_lesson_id: quizId };
  const queryOptions = {
    sortBy: options.sortBy || 'started_at:desc',
    limit: options.limit || 50,
    page: options.page || 1,
  };

  return queryAttempts(filter, queryOptions, currentUser);
};

/**
 * Submit attempt with answers and calculate score
 * @param {ObjectId} attemptId
 * @param {Object} submissionData - { answers: [{ question_id, answer }] }
 * @param {ObjectId} userId - User submitting the attempt
 * @returns {Promise<Attempt>}
 */
const submitAttempt = async (attemptId, submissionData, userId) => {
  const attempt = await Attempt.findById(attemptId).populate('quiz_lesson_id');

  if (!attempt) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Attempt not found');
  }

  // Check authorization
  if (String(attempt.user_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to submit this attempt');
  }

  // Check if already submitted
  if (attempt.submitted_at) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Attempt has already been submitted');
  }

  // Get quiz questions
  const quizLesson = attempt.quiz_lesson_id;
  if (!quizLesson || !quizLesson.resource_id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Quiz lesson data is invalid');
  }

  const quiz = await LessonQuiz.findById(quizLesson.resource_id).populate('question_ids');
  if (!quiz) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Quiz not found');
  }

  const questions = quiz.question_ids;
  let correctAnswers = 0;
  const answers = [];

  // Validate and score answers
  for (const submission of submissionData.answers) {
    const question = questions.find((q) => String(q._id) === String(submission.question_id));
    if (!question) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Question ${submission.question_id} not found in quiz`);
    }

    // Validate answer using question service
    const validation = await questionService.validateAnswer(question._id, submission.answer, userId);

    answers.push({
      question_id: question._id,
      is_correct: validation.isCorrect,
    });

    if (validation.isCorrect) {
      correctAnswers++;
    }
  }

  // Calculate score and pass status
  const score = questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;
  const isPassed = score >= (quiz.settings?.pass_score || 70);

  // Update attempt
  attempt.score = Math.round(score * 100) / 100; // Round to 2 decimal places
  attempt.is_passed = isPassed;
  attempt.answers = answers;
  attempt.submitted_at = new Date();

  await attempt.save();
  return attempt;
};

/**
 * Get attempt statistics
 * @returns {Promise<Object>}
 */
const getAttemptStats = async () => {
  const totalAttempts = await Attempt.countDocuments();

  const attemptsByStatus = await Attempt.aggregate([
    {
      $group: {
        _id: '$is_passed',
        count: { $sum: 1 },
        avgScore: { $avg: '$score' },
      },
    },
  ]);

  const averageScore = await Attempt.aggregate([
    { $match: { submitted_at: { $exists: true } } },
    { $group: { _id: null, avgScore: { $avg: '$score' } } },
  ]);

  const attemptsByQuiz = await Attempt.aggregate([
    {
      $group: {
        _id: '$quiz_lesson_id',
        count: { $sum: 1 },
        avgScore: { $avg: '$score' },
        passRate: {
          $avg: { $cond: [{ $eq: ['$is_passed', true] }, 1, 0] },
        },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const attemptsByMonth = await Attempt.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$started_at' },
          month: { $month: '$started_at' },
        },
        count: { $sum: 1 },
        avgScore: { $avg: '$score' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  return {
    totalAttempts,
    attemptsByStatus,
    averageScore: averageScore[0]?.avgScore || 0,
    attemptsByQuiz,
    attemptsByMonth,
  };
};

/**
 * Get quiz statistics for a specific user
 * @param {ObjectId} quizId
 * @param {ObjectId} userId
 * @returns {Promise<Object>}
 */
const getQuizStatsForUser = async (quizId, userId) => {
  const attempts = await Attempt.find({
    user_id: userId,
    quiz_lesson_id: quizId,
    submitted_at: { $exists: true },
  }).sort('started_at:desc');

  if (attempts.length === 0) {
    return {
      quiz_id: quizId,
      user_id: userId,
      total_attempts: 0,
      best_score: 0,
      average_score: 0,
      is_passed: false,
      attempts: [],
    };
  }

  const scores = attempts.map((a) => a.score);
  const bestScore = Math.max(...scores);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const latestAttempt = attempts[0];

  return {
    quiz_id: quizId,
    user_id: userId,
    total_attempts: attempts.length,
    best_score: Math.round(bestScore * 100) / 100,
    average_score: Math.round(averageScore * 100) / 100,
    is_passed: latestAttempt.is_passed,
    attempts: attempts.map((a) => ({
      attempt_id: a._id,
      score: a.score,
      is_passed: a.is_passed,
      started_at: a.started_at,
      submitted_at: a.submitted_at,
    })),
  };
};

module.exports = {
  createAttempt,
  queryAttempts,
  getAttemptById,
  updateAttemptById,
  deleteAttemptById,
  getAttemptsByUser,
  getAttemptsByQuiz,
  submitAttempt,
  getAttemptStats,
  getQuizStatsForUser,
};
