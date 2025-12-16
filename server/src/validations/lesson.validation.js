const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getLesson = {
  params: Joi.object().keys({
    lessonId: Joi.string().required().custom(objectId),
  }),
};

const updateLesson = {
  params: Joi.object().keys({
    lessonId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      slug: Joi.string(),
      is_preview: Joi.boolean(),
    })
    .min(1),
};

const deleteLesson = {
  params: Joi.object().keys({
    lessonId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getLesson,
  updateLesson,
  deleteLesson,
};



