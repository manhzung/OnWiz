const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required().custom(objectId),
  }),
};

const updateQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      difficulty: Joi.string().valid('easy', 'medium', 'hard'),
      content: Joi.string(),
      image_url: Joi.string().uri().allow('', null),
      // cho single/multiple choice
      options: Joi.array().items(
        Joi.object().keys({
          id: Joi.number().required(),
          text: Joi.string().required(),
          is_correct: Joi.boolean().default(false),
          image_url: Joi.string().uri().allow('', null),
        })
      ),
      // cho fill_in
      correct_answers: Joi.array().items(Joi.string().required()).min(1),
      explanation: Joi.string().allow(''),
    })
    .min(1),
};

const deleteQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getQuestion,
  updateQuestion,
  deleteQuestion,
};



