const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createModule = {
  body: Joi.object().keys({
    course_id: Joi.string().custom(objectId).required(),
    title: Joi.string().required().trim(),
  }),
};

const getModules = {
  query: Joi.object().keys({
    course_id: Joi.string().custom(objectId),
    title: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
  }),
};

const updateModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().trim(),
    })
    .min(1),
};

const deleteModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
  }),
};

const getModulesByCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const addLessonToModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    lessonId: Joi.string().custom(objectId).required(),
  }),
};

const removeLessonFromModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
    lessonId: Joi.string().custom(objectId),
  }),
};

const reorderLessons = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    lessonIds: Joi.array().items(Joi.string().custom(objectId)).required(),
  }),
};

module.exports = {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
  getModulesByCourse,
  addLessonToModule,
  removeLessonFromModule,
  reorderLessons,
};
