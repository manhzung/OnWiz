const httpStatus = require('http-status');
const { Course, Module, Lesson } = require('../models');
const ApiError = require('../utils/ApiError');
const { deleteLessonById } = require('./lesson.service');

const getModuleById = async (moduleId) => {
  const moduleDoc = await Module.findById(moduleId);
  if (!moduleDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  return moduleDoc;
};

const updateModule = async (moduleId, body) => {
  const moduleDoc = await Module.findById(moduleId);
  if (!moduleDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  if (body.title !== undefined) {
    moduleDoc.title = body.title;
  }
  await moduleDoc.save();
  return moduleDoc;
};

const deleteModule = async (moduleId) => {
  const moduleDoc = await Module.findById(moduleId);
  if (!moduleDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  // Xoá tất cả lesson thuộc module này
  const lessons = await Lesson.find({ module_id: moduleId });
  // eslint-disable-next-line no-restricted-syntax
  for (const lesson of lessons) {
    // eslint-disable-next-line no-await-in-loop
    await deleteLessonById(lesson._id, false);
  }

  // Gỡ module ra khỏi course.module_ids
  const course = await Course.findById(moduleDoc.course_id);
  if (course) {
    course.module_ids = course.module_ids.filter((id) => String(id) !== String(moduleId));
    if (course.total_modules > 0) {
      course.total_modules -= 1;
    }
    await course.save();
  }

  await moduleDoc.deleteOne();
  return moduleDoc;
};

module.exports = {
  getModuleById,
  updateModule,
  deleteModule,
};



