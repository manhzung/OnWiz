const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createClassroom = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    members: Joi.array()
      .items(
        Joi.object().keys({
          user_id: Joi.string().required().custom(objectId),
          role: Joi.string().valid('student', 'admin', 'assistant').default('student'),
        })
      )
      .optional(),
    assigned_courses: Joi.array().items(Joi.string().custom(objectId)).optional(),
    imageURL: Joi.string().uri().allow('', null),
  }),
};

const getClassrooms = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getClassroom = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
  }),
};

const updateClassroom = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      imageURL: Joi.string().uri().allow('', null),
    })
    .min(1),
};

const deleteClassroom = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
  }),
};

const addMember = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    role: Joi.string().valid('student', 'admin', 'assistant').default('student'),
  }),
};

const removeMember = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
  }),
};

const updateMemberRole = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    role: Joi.string().valid('student', 'admin', 'assistant').required(),
  }),
};

const assignCourse = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    courseId: Joi.string().custom(objectId).required(),
  }),
};

const removeCourse = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
    courseId: Joi.string().custom(objectId),
  }),
};

const uploadMaterial = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
  }),
};

const getMaterials = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
  }),
};

const deleteMaterial = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
    materialId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createClassroom,
  getClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom,
  uploadMaterial,
  getMaterials,
  deleteMaterial,
  addMember,
  removeMember,
  updateMemberRole,
  assignCourse,
  removeCourse,
};
