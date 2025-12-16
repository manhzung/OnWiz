const httpStatus = require('http-status');
const { Attempt } = require('../models');
const ApiError = require('../utils/ApiError');

const createAttempt = async (userId, body) => {
  const attempt = await Attempt.create({
    user_id: userId,
    quiz_lesson_id: body.quiz_lesson_id,
    score: body.score,
    is_passed: body.is_passed,
    answers: body.answers,
    started_at: body.started_at,
    submitted_at: body.submitted_at,
  });
  return attempt;
};

const queryAttempts = async (filter, options, currentUser) => {
  const query = {};
  if (currentUser.role !== 'admin') {
    query.user_id = currentUser.id;
  } else if (filter.user_id) {
    query.user_id = filter.user_id;
  }
  if (filter.quiz_lesson_id) {
    query.quiz_lesson_id = filter.quiz_lesson_id;
  }
  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Attempt.paginate) {
    return Attempt.paginate(query, { sortBy: sort, limit, page });
  }
  const attempts = await Attempt.find(query)
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);
  return { results: attempts };
};

const getAttemptById = async (attemptId, currentUser) => {
  const attempt = await Attempt.findById(attemptId);
  if (!attempt) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Attempt not found');
  }
  if (currentUser.role !== 'admin' && String(attempt.user_id) !== String(currentUser.id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return attempt;
};

const deleteAttemptById = async (attemptId, currentUser) => {
  const attempt = await getAttemptById(attemptId, currentUser);
  await attempt.deleteOne();
  return attempt;
};

module.exports = {
  createAttempt,
  queryAttempts,
  getAttemptById,
  deleteAttemptById,
};


