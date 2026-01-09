const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAttempt = {
  body: Joi.object().keys({
    quiz_lesson_id: Joi.string().required().custom(objectId),
  }),
};

const getAttempts = {
  query: Joi.object().keys({
    user_id: Joi.string().custom(objectId), // admin filter
    quiz_lesson_id: Joi.string().custom(objectId),
    is_passed: Joi.boolean(),
    date_from: Joi.string(),
    date_to: Joi.string(),
    score_min: Joi.number().min(0).max(100),
    score_max: Joi.number().min(0).max(100),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAttempt = {
  params: Joi.object().keys({
    attemptId: Joi.string().custom(objectId),
  }),
};

const updateAttempt = {
  params: Joi.object().keys({
    attemptId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      score: Joi.number().min(0).max(100),
      is_passed: Joi.boolean(),
    })
    .min(1),
};

const deleteAttempt = {
  params: Joi.object().keys({
    attemptId: Joi.string().custom(objectId),
  }),
};

const getAttemptsByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAttemptsByQuiz = {
  params: Joi.object().keys({
    quizId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const submitAttempt = {
  params: Joi.object().keys({
    attemptId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    answers: Joi.array()
      .items(
        Joi.object().keys({
          question_id: Joi.string().custom(objectId).required(),
          answer: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string()), Joi.number()).required(),
        })
      )
      .min(1)
      .required(),
  }),
};

const getQuizStatsForUser = {
  params: Joi.object().keys({
    quizId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAttempt,
  getAttempts,
  getAttempt,
  updateAttempt,
  deleteAttempt,
  getAttemptsByUser,
  getAttemptsByQuiz,
  submitAttempt,
  getQuizStatsForUser,
};
