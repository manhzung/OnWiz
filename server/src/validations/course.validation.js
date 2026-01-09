const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCourse = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    imageURL: Joi.string().uri().allow('', null),
    pricing: Joi.object()
      .keys({
        price: Joi.number().min(0),
        sale_price: Joi.number().min(0),
        currency: Joi.string(),
        is_free: Joi.boolean(),
      })
      .optional(),
  }),
};

const updateCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      slug: Joi.string(),
      imageURL: Joi.string().uri().allow('', null),
      pricing: Joi.object().keys({
        price: Joi.number().min(0),
        sale_price: Joi.number().min(0),
        currency: Joi.string(),
        is_free: Joi.boolean(),
      }),
      is_published: Joi.boolean(),
    })
    .min(1),
};

const deleteCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().required().custom(objectId),
  }),
};

const getCourses = {
  query: Joi.object().keys({
    instructor_id: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().required().custom(objectId),
  }),
};

const getModules = {
  params: Joi.object().keys({
    courseId: Joi.string().required().custom(objectId),
  }),
};

const getLessonsByModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().required().custom(objectId),
  }),
};

const getLessonDetail = {
  params: Joi.object().keys({
    lessonId: Joi.string().required().custom(objectId),
  }),
};

const getQuizQuestions = {
  params: Joi.object().keys({
    quizId: Joi.string().required().custom(objectId),
  }),
};

const createModule = {
  params: Joi.object().keys({
    courseId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
  }),
};

const createLesson = {
  params: Joi.object().keys({
    moduleId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    course_id: Joi.string().required().custom(objectId),
    title: Joi.string().required(),
    slug: Joi.string().required(),
    type: Joi.string().valid('video', 'theory', 'quiz').required(),
    is_preview: Joi.boolean(),
    // video
    provider: Joi.string().when('type', {
      is: 'video',
      then: Joi.required(),
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
    // theory
    content_html: Joi.string().when('type', {
      is: 'theory',
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
    // quiz
    settings: Joi.object()
      .keys({
        time_limit: Joi.number().integer().min(0).required(),
        pass_score: Joi.number().min(0).required(),
        shuffle_questions: Joi.boolean(),
      })
      .when('type', {
        is: 'quiz',
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
  }),
};

const createQuestionForQuiz = {
  params: Joi.object().keys({
    quizId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    type: Joi.string().valid('single_choice', 'multiple_choice', 'fill_in').required(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('easy'),
    content: Joi.string().required(),
    image_url: Joi.string().uri().allow('', null),
    // options cho single/multiple choice
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
    // correct_answers cho fill_in
    correct_answers: Joi.when('type', {
      is: 'fill_in',
      then: Joi.array().items(Joi.string().required()).min(1).required(),
      otherwise: Joi.forbidden(),
    }),
    explanation: Joi.string().allow('').optional(),
  }),
};

const getCoursesByInstructor = {
  params: Joi.object().keys({
    instructorId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCoursesByCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCourseBySlug = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

const publishCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
};

const unpublishCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
};

const updateCourseRating = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    rating: Joi.number().min(1).max(5).required(),
  }),
};

const searchCourses = {
  query: Joi.object().keys({
    q: Joi.string(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
    category_id: Joi.string().custom(objectId),
    min_price: Joi.number().min(0),
    max_price: Joi.number().min(0),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCourseModules = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
};

const getCourseOverview = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  getCoursesByInstructor,
  getCoursesByCategory,
  publishCourse,
  unpublishCourse,
  updateCourseRating,
  searchCourses,
  getCourseModules,
  getCourseOverview,
  // Keep existing validations for backward compatibility
  createModule,
  createLesson,
  createQuestionForQuiz,
  getModules,
  getLessonsByModule,
  getLessonDetail,
  getQuizQuestions,
};
