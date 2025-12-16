const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAttempt = {
  body: Joi.object().keys({
    quiz_lesson_id: Joi.string().required().custom(objectId),
    score: Joi.number().required(),
    is_passed: Joi.boolean().required(),
    answers: Joi.array()
      .items(
        Joi.object().keys({
          question_id: Joi.string().required().custom(objectId),
          is_correct: Joi.boolean().required(),
        })
      )
      .required(),
    started_at: Joi.date().required(),
    submitted_at: Joi.date().optional(),
  }),
};

const getAttempts = {
  query: Joi.object().keys({
    user_id: Joi.string().custom(objectId), // admin filter
    quiz_lesson_id: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAttempt = {
  params: Joi.object().keys({
    attemptId: Joi.string().required().custom(objectId),
  }),
};

const deleteAttempt = {
  params: Joi.object().keys({
    attemptId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createAttempt,
  getAttempts,
  getAttempt,
  deleteAttempt,
};


