const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createLesson = {
  body: Joi.object().keys({
    module_id: Joi.string().custom(objectId).required(),
    title: Joi.string().required().trim(),
    slug: Joi.string().required().trim(),
    type: Joi.string().valid('video', 'theory', 'quiz').required(),
    is_preview: Joi.boolean().default(false),
    // Video lesson fields
    provider: Joi.string().when('type', {
      is: 'video',
      then: Joi.valid('youtube', 'vimeo').required(),
      otherwise: Joi.forbidden(),
    }),
    url: Joi.string().uri().when('type', {
      is: 'video',
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    duration: Joi.number().integer().min(0).when('type', {
      is: 'video',
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    transcript: Joi.string().allow('').optional(),
    // Theory lesson fields
    content_html: Joi.string().when('type', {
      is: 'theory',
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    attachments: Joi.array().items(Joi.string()).when('type', {
      is: 'theory',
      then: Joi.optional(),
      otherwise: Joi.forbidden(),
    }),
    reading_time_minutes: Joi.number().integer().min(0).when('type', {
      is: 'theory',
      then: Joi.optional(),
      otherwise: Joi.forbidden(),
    }),
    // Quiz lesson fields
    settings: Joi.object()
      .keys({
        time_limit: Joi.number().integer().min(0),
        pass_score: Joi.number().min(0).max(100),
        shuffle_questions: Joi.boolean(),
      })
      .when('type', {
        is: 'quiz',
        then: Joi.optional(),
        otherwise: Joi.forbidden(),
      }),
    question_ids: Joi.array().items(Joi.string().custom(objectId)).when('type', {
      is: 'quiz',
      then: Joi.optional(),
      otherwise: Joi.forbidden(),
    }),
  }),
};

const createVideoLesson = {
  body: Joi.object().keys({
    module_id: Joi.string().custom(objectId).required(),
    title: Joi.string().required().trim(),
    slug: Joi.string().required().trim(),
    is_preview: Joi.boolean().default(false),
    provider: Joi.string().valid('youtube', 'vimeo').required(),
    url: Joi.string().uri().required(),
    duration: Joi.number().integer().min(0).required(),
    transcript: Joi.string().allow('').optional(),
  }),
};

const createTheoryLesson = {
  body: Joi.object().keys({
    module_id: Joi.string().custom(objectId).required(),
    title: Joi.string().required().trim(),
    slug: Joi.string().required().trim(),
    is_preview: Joi.boolean().default(false),
    content_html: Joi.string().required(),
    attachments: Joi.array().items(Joi.string()).optional(),
    reading_time_minutes: Joi.number().integer().min(0).optional(),
  }),
};

const createQuizLesson = {
  body: Joi.object().keys({
    module_id: Joi.string().custom(objectId).required(),
    title: Joi.string().required().trim(),
    slug: Joi.string().required().trim(),
    is_preview: Joi.boolean().default(false),
    settings: Joi.object()
      .keys({
        time_limit: Joi.number().integer().min(0),
        pass_score: Joi.number().min(0).max(100),
        shuffle_questions: Joi.boolean(),
      })
      .optional(),
    question_ids: Joi.array().items(Joi.string().custom(objectId)).optional(),
  }),
};

const getLessons = {
  query: Joi.object().keys({
    module_id: Joi.string().custom(objectId),
    course_id: Joi.string().custom(objectId),
    type: Joi.string().valid('video', 'theory', 'quiz'),
    title: Joi.string(),
    is_preview: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getLesson = {
  params: Joi.object().keys({
    lessonId: Joi.string().custom(objectId),
  }),
};

const updateLesson = {
  params: Joi.object().keys({
    lessonId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().trim(),
      slug: Joi.string().trim(),
      is_preview: Joi.boolean(),
      resource: Joi.object(), // For updating lesson resource content
    })
    .min(1),
};

const deleteLesson = {
  params: Joi.object().keys({
    lessonId: Joi.string().custom(objectId),
  }),
};

const getLessonsByModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getLessonsByCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateLessonPreview = {
  params: Joi.object().keys({
    lessonId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    is_preview: Joi.boolean().required(),
  }),
};

const getLessonContent = {
  params: Joi.object().keys({
    lessonId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createLesson,
  createVideoLesson,
  createTheoryLesson,
  createQuizLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  getLessonsByModule,
  getLessonsByCourse,
  updateLessonPreview,
  getLessonContent,
};
