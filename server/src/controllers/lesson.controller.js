const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const lessonService = require('../services/lesson.service');

const getLesson = catchAsync(async (req, res) => {
  const result = await lessonService.getLessonDetail(req.params.lessonId);
  res.send(result);
});

const updateLesson = catchAsync(async (req, res) => {
  const lesson = await lessonService.updateLesson(req.params.lessonId, req.body);
  res.send(lesson);
});

const deleteLesson = catchAsync(async (req, res) => {
  await lessonService.deleteLesson(req.params.lessonId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getLesson,
  updateLesson,
  deleteLesson,
};



