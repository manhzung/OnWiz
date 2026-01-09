const Joi = require('joi');
const { objectId } = require('./custom.validation');

const uploadUserAvatar = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deleteUserAvatar = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const uploadCourseThumbnail = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
};

const deleteCourseThumbnail = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
};

const uploadClassroomImage = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
  }),
};

const deleteClassroomImage = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  uploadUserAvatar,
  deleteUserAvatar,
  uploadCourseThumbnail,
  deleteCourseThumbnail,
  uploadClassroomImage,
  deleteClassroomImage,
};
