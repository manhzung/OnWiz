const httpStatus = require('http-status');
const { Classroom } = require('../models');
const ApiError = require('../utils/ApiError');

const createClassroom = async (body) => {
  const classroom = await Classroom.create({
    name: body.name,
    members: body.members || [],
    assigned_courses: body.assigned_courses || [],
  });
  return classroom;
};

const queryClassrooms = async (filter, options) => {
  const query = {};
  if (filter.name) {
    query.name = { $regex: filter.name, $options: 'i' };
  }
  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Classroom.paginate) {
    return Classroom.paginate(query, { sortBy: sort, limit, page });
  }
  const classrooms = await Classroom.find(query)
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);
  return { results: classrooms };
};

const getClassroomById = async (classroomId) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }
  return classroom;
};

const updateClassroomById = async (classroomId, body) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }
  if (body.name !== undefined) classroom.name = body.name;
  if (body.members !== undefined) classroom.members = body.members;
  if (body.assigned_courses !== undefined) classroom.assigned_courses = body.assigned_courses;
  await classroom.save();
  return classroom;
};

const deleteClassroomById = async (classroomId) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }
  await classroom.deleteOne();
  return classroom;
};

module.exports = {
  createClassroom,
  queryClassrooms,
  getClassroomById,
  updateClassroomById,
  deleteClassroomById,
};


