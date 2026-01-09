const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createQuestion = {
  body: Joi.object().keys({
    type: Joi.string().valid('single_choice', 'multiple_choice', 'fill_in').required(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('easy'),
    content: Joi.string().required(),
    image_url: Joi.string().uri().allow('', null),
    // Single choice validation
    options: Joi.when('type', {
      is: 'single_choice',
      then: Joi.array()
        .items(
          Joi.object().keys({
            id: Joi.number().required(),
            text: Joi.string().required(),
            is_correct: Joi.boolean().default(false),
            image_url: Joi.string().uri().allow('', null),
          })
        )
        .min(2)
        .required(),
      otherwise: Joi.when('type', {
        is: 'multiple_choice',
        then: Joi.array()
          .items(
            Joi.object().keys({
              id: Joi.number().required(),
              text: Joi.string().required(),
              is_correct: Joi.boolean().default(false),
              image_url: Joi.string().uri().allow('', null),
            })
          )
          .min(2)
          .required(),
        otherwise: Joi.forbidden(),
      }),
    }),
    // Fill-in validation
    correct_answers: Joi.when('type', {
      is: 'fill_in',
      then: Joi.array().items(Joi.string().required()).min(1).required(),
      otherwise: Joi.forbidden(),
    }),
    explanation: Joi.string().allow(''),
  }),
};

const createSingleChoiceQuestion = {
  body: Joi.object().keys({
    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('easy'),
    content: Joi.string().required(),
    image_url: Joi.string().uri().allow('', null),
    options: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.number().required(),
          text: Joi.string().required(),
          is_correct: Joi.boolean().default(false),
          image_url: Joi.string().uri().allow('', null),
        })
      )
      .min(2)
      .required(),
    explanation: Joi.string().allow(''),
  }),
};

const createMultipleChoiceQuestion = {
  body: Joi.object().keys({
    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('easy'),
    content: Joi.string().required(),
    image_url: Joi.string().uri().allow('', null),
    options: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.number().required(),
          text: Joi.string().required(),
          is_correct: Joi.boolean().default(false),
          image_url: Joi.string().uri().allow('', null),
        })
      )
      .min(2)
      .required(),
    explanation: Joi.string().allow(''),
  }),
};

const createFillInQuestion = {
  body: Joi.object().keys({
    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('easy'),
    content: Joi.string().required(),
    image_url: Joi.string().uri().allow('', null),
    correct_answers: Joi.array().items(Joi.string().required()).min(1).required(),
    explanation: Joi.string().allow(''),
  }),
};

const getQuestions = {
  query: Joi.object().keys({
    type: Joi.string().valid('single_choice', 'multiple_choice', 'fill_in'),
    difficulty: Joi.string().valid('easy', 'medium', 'hard'),
    content: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().custom(objectId),
  }),
};

const updateQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      difficulty: Joi.string().valid('easy', 'medium', 'hard'),
      content: Joi.string(),
      image_url: Joi.string().uri().allow('', null),
      resource: Joi.object(), // For updating question-specific data
    })
    .min(1),
};

const deleteQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().custom(objectId),
  }),
};

const getQuestionsByDifficulty = {
  params: Joi.object().keys({
    difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getQuestionsByType = {
  params: Joi.object().keys({
    type: Joi.string().valid('single_choice', 'multiple_choice', 'fill_in').required(),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getQuestionsByCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const searchQuestions = {
  query: Joi.object().keys({
    q: Joi.string(),
    type: Joi.string().valid('single_choice', 'multiple_choice', 'fill_in'),
    difficulty: Joi.string().valid('easy', 'medium', 'hard'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const bulkCreateQuestions = {
  body: Joi.object().keys({
    questions: Joi.array()
      .items(
        Joi.object().keys({
          type: Joi.string().valid('single_choice', 'multiple_choice', 'fill_in').required(),
          difficulty: Joi.string().valid('easy', 'medium', 'hard').default('easy'),
          content: Joi.string().required(),
          image_url: Joi.string().uri().allow('', null),
          options: Joi.when('type', {
            is: Joi.valid('single_choice', 'multiple_choice'),
            then: Joi.array()
              .items(
                Joi.object().keys({
                  id: Joi.number().required(),
                  text: Joi.string().required(),
                  is_correct: Joi.boolean().default(false),
                  image_url: Joi.string().uri().allow('', null),
                })
              )
              .min(2)
              .required(),
            otherwise: Joi.forbidden(),
          }),
          correct_answers: Joi.when('type', {
            is: 'fill_in',
            then: Joi.array().items(Joi.string().required()).min(1).required(),
            otherwise: Joi.forbidden(),
          }),
          explanation: Joi.string().allow(''),
        })
      )
      .min(1)
      .required(),
  }),
};

const validateAnswer = {
  params: Joi.object().keys({
    questionId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    answer: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string()), Joi.number()).required(),
  }),
};

module.exports = {
  createQuestion,
  createSingleChoiceQuestion,
  createMultipleChoiceQuestion,
  createFillInQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByDifficulty,
  getQuestionsByType,
  getQuestionsByCourse,
  searchQuestions,
  bulkCreateQuestions,
  validateAnswer,
};
