const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const classroomService = require('../services/classroom.service');

const createClassroom = catchAsync(async (req, res) => {
  const classroom = await classroomService.createClassroom(req.body);
  res.status(httpStatus.CREATED).send(classroom);
});

const getClassrooms = catchAsync(async (req, res) => {
  const result = await classroomService.queryClassrooms(req.query, {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  });
  res.send(result);
});

const getClassroom = catchAsync(async (req, res) => {
  const classroom = await classroomService.getClassroomById(req.params.classroomId);
  res.send(classroom);
});

const updateClassroom = catchAsync(async (req, res) => {
  const classroom = await classroomService.updateClassroomById(req.params.classroomId, req.body);
  res.send(classroom);
});

const deleteClassroom = catchAsync(async (req, res) => {
  await classroomService.deleteClassroomById(req.params.classroomId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createClassroom,
  getClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom,
};


