const httpStatus = require('http-status');
const { Course, Module, Lesson, LessonVideo, LessonTheory, LessonQuiz, Question, QuestionSingleChoice, QuestionMultipleChoice, QuestionFillIn } = require('../models');
const ApiError = require('../utils/ApiError');
const { deleteLessonById } = require('./lesson.service');

const createCourse = async (instructorId, body) => {
  const course = await Course.create({
    title: body.title,
    slug: body.slug,
    instructor_id: instructorId,
    thumbnail_url: body.thumbnail_url || '',
    pricing: body.pricing || {},
  });
  return course;
};

const updateCourseById = async (courseId, body) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  if (body.title !== undefined) course.title = body.title;
  if (body.slug !== undefined) course.slug = body.slug;
  if (body.thumbnail_url !== undefined) course.thumbnail_url = body.thumbnail_url;
  if (body.pricing !== undefined) course.pricing = body.pricing;
  if (body.is_published !== undefined) course.is_published = body.is_published;
  await course.save();
  return course;
};

const deleteCourseById = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Xoá toàn bộ module & lesson (kèm resource)
  const modules = await Module.find({ course_id: courseId });
  // eslint-disable-next-line no-restricted-syntax
  for (const mod of modules) {
    const lessons = await Lesson.find({ module_id: mod._id });
    // eslint-disable-next-line no-restricted-syntax
    for (const lesson of lessons) {
      // eslint-disable-next-line no-await-in-loop
      await deleteLessonById(lesson._id, false);
    }
    // eslint-disable-next-line no-await-in-loop
    await mod.deleteOne();
  }

  await course.deleteOne();
  return course;
};

const createModule = async (courseId, body) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  const moduleDoc = await Module.create({
    course_id: courseId,
    title: body.title,
    lesson_ids: [],
  });
  course.module_ids.push(moduleDoc._id);
  course.total_modules += 1;
  await course.save();
  return moduleDoc;
};

const createLesson = async (moduleId, body) => {
  const moduleDoc = await Module.findById(moduleId);
  if (!moduleDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  // đảm bảo course_id trong body khớp với module
  if (String(moduleDoc.course_id) !== String(body.course_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'course_id does not match module.course_id');
  }

  let resource;
  if (body.type === 'video') {
    resource = await LessonVideo.create({
      provider: body.provider,
      url: body.url,
      duration: body.duration,
      transcript: body.transcript || '',
    });
  } else if (body.type === 'theory') {
    resource = await LessonTheory.create({
      content_html: body.content_html,
      attachments: [],
      reading_time_minutes: 0,
    });
  } else if (body.type === 'quiz') {
    resource = await LessonQuiz.create({
      settings: {
        time_limit: body.settings.time_limit,
        pass_score: body.settings.pass_score,
        shuffle_questions: body.settings.shuffle_questions ?? true,
      },
      question_ids: [],
    });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid lesson type');
  }

  const lesson = await Lesson.create({
    module_id: moduleId,
    course_id: body.course_id,
    title: body.title,
    slug: body.slug,
    type: body.type,
    resource_id: resource._id,
    is_preview: body.is_preview ?? false,
  });

  moduleDoc.lesson_ids.push(lesson._id);
  await moduleDoc.save();

  return lesson;
};

const createQuestionForQuiz = async (quizId, body) => {
  const quiz = await LessonQuiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
  }

  let detail;
  if (body.type === 'single_choice') {
    detail = await QuestionSingleChoice.create({
      options: body.options,
      explanation: body.explanation || '',
    });
  } else if (body.type === 'multiple_choice') {
    detail = await QuestionMultipleChoice.create({
      options: body.options,
      explanation: body.explanation || '',
    });
  } else if (body.type === 'fill_in') {
    detail = await QuestionFillIn.create({
      correct_answers: body.correct_answers,
      explanation: body.explanation || '',
    });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid question type');
  }

  const question = await Question.create({
    type: body.type,
    difficulty: body.difficulty || 'easy',
    content: body.content,
    image_url: body.image_url || '',
    resource_id: detail._id,
  });

  quiz.question_ids.push(question._id);
  await quiz.save();

  return question;
};

const listCourses = async (filter, options) => {
  const query = {};
  if (filter.instructor_id) {
    query.instructor_id = filter.instructor_id;
  }
  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  // Dùng paginate plugin nếu có, hoặc fallback find
  if (Course.paginate) {
    return Course.paginate(query, { sortBy: sort, limit, page });
  }
  const courses = await Course.find(query)
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);
  return { results: courses };
};

const getCourseWithModules = async (courseId) => {
  const course = await Course.findById(courseId).lean();
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  const modules = await Module.find({ course_id: courseId }).lean();
  return { ...course, modules };
};

const getModulesByCourse = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  const modules = await Module.find({ course_id: courseId });
  return modules;
};

const getLessonsByModule = async (moduleId) => {
  const moduleDoc = await Module.findById(moduleId);
  if (!moduleDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  const lessons = await Lesson.find({ module_id: moduleId });
  return lessons;
};

const getLessonDetail = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  let resource = null;
  if (lesson.type === 'video') {
    resource = await LessonVideo.findById(lesson.resource_id).lean();
  } else if (lesson.type === 'theory') {
    resource = await LessonTheory.findById(lesson.resource_id).lean();
  } else if (lesson.type === 'quiz') {
    const quiz = await LessonQuiz.findById(lesson.resource_id).lean();
    if (!quiz) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
    }
    const questions = await Question.find({ _id: { $in: quiz.question_ids } }).lean();
    resource = { ...quiz, questions };
  }

  return { lesson, resource };
};

const getQuizQuestions = async (quizId) => {
  const quiz = await LessonQuiz.findById(quizId).lean();
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
  }
  const questions = await Question.find({ _id: { $in: quiz.question_ids } }).lean();
  return questions;
};

module.exports = {
  createCourse,
  createModule,
  createLesson,
  createQuestionForQuiz,
  listCourses,
  getCourseWithModules,
  getModulesByCourse,
  getLessonsByModule,
  getLessonDetail,
  getQuizQuestions,
};


