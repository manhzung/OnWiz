const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { courseService } = require('../services');

const createCourse = catchAsync(async (req, res) => {
  const course = await courseService.createCourse(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(course);
});

const updateCourse = catchAsync(async (req, res) => {
  const course = await courseService.updateCourseById(req.params.courseId, req.body);
  res.send(course);
});

const deleteCourse = catchAsync(async (req, res) => {
  await courseService.deleteCourseById(req.params.courseId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getCourses = catchAsync(async (req, res) => {
  const result = await courseService.listCourses(req.query, {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  });
  res.send(result);
});

const getCourse = catchAsync(async (req, res) => {
  const course = await courseService.getCourseWithModules(req.params.courseId);
  res.send(course);
});

const createModule = catchAsync(async (req, res) => {
  const moduleDoc = await courseService.createModule(req.params.courseId, req.body);
  res.status(httpStatus.CREATED).send(moduleDoc);
});

const getModulesByCourse = catchAsync(async (req, res) => {
  const modules = await courseService.getModulesByCourse(req.params.courseId);
  res.send(modules);
});

const createLesson = catchAsync(async (req, res) => {
  const lesson = await courseService.createLesson(req.params.moduleId, req.body);
  res.status(httpStatus.CREATED).send(lesson);
});

const getLessonsByModule = catchAsync(async (req, res) => {
  const lessons = await courseService.getLessonsByModule(req.params.moduleId);
  res.send(lessons);
});

const getLessonDetail = catchAsync(async (req, res) => {
  const result = await courseService.getLessonDetail(req.params.lessonId);
  res.send(result);
});

const createQuestionForQuiz = catchAsync(async (req, res) => {
  const question = await courseService.createQuestionForQuiz(req.params.quizId, req.body);
  res.status(httpStatus.CREATED).send(question);
});

const getQuizQuestions = catchAsync(async (req, res) => {
  const questions = await courseService.getQuizQuestions(req.params.quizId);
  res.send(questions);
});

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  createModule,
  getModulesByCourse,
  createLesson,
  getLessonsByModule,
  getLessonDetail,
  createQuestionForQuiz,
  getQuizQuestions,
};


