const httpStatus = require('http-status');
const { Lesson, Module, LessonVideo, LessonTheory, LessonQuiz } = require('../models');
const ApiError = require('../utils/ApiError');

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
    resource = await LessonQuiz.findById(lesson.resource_id).lean();
  }

  return { lesson, resource };
};

const updateLesson = async (lessonId, body) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }
  if (body.title !== undefined) {
    lesson.title = body.title;
  }
  if (body.slug !== undefined) {
    lesson.slug = body.slug;
  }
  if (body.is_preview !== undefined) {
    lesson.is_preview = body.is_preview;
  }
  await lesson.save();
  return lesson;
};

// helper nội bộ để có thể dùng lại khi xoá module
const deleteLessonById = async (lessonId, throwIfNotFound = true) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    if (throwIfNotFound) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
    }
    return null;
  }

  // Gỡ lesson khỏi module.lesson_ids
  const moduleDoc = await Module.findById(lesson.module_id);
  if (moduleDoc) {
    moduleDoc.lesson_ids = moduleDoc.lesson_ids.filter((id) => String(id) !== String(lessonId));
    await moduleDoc.save();
  }

  // Xoá resource tương ứng
  if (lesson.type === 'video') {
    await LessonVideo.findByIdAndDelete(lesson.resource_id);
  } else if (lesson.type === 'theory') {
    await LessonTheory.findByIdAndDelete(lesson.resource_id);
  } else if (lesson.type === 'quiz') {
    await LessonQuiz.findByIdAndDelete(lesson.resource_id);
  }

  await lesson.deleteOne();
  return lesson;
};

const deleteLesson = async (lessonId) => {
  return deleteLessonById(lessonId, true);
};

module.exports = {
  getLessonDetail,
  updateLesson,
  deleteLesson,
  deleteLessonById,
};



