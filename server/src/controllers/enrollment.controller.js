const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const enrollmentService = require('../services/enrollment.service');

const createEnrollment = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.createEnrollment(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(enrollment);
});

const getEnrollments = catchAsync(async (req, res) => {
  const result = await enrollmentService.queryEnrollments(
    req.query,
    { sortBy: req.query.sortBy, limit: req.query.limit, page: req.query.page },
    req.user
  );
  res.send(result);
});

const getEnrollment = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.getEnrollmentById(req.params.enrollmentId, req.user);
  res.send(enrollment);
});

const updateEnrollment = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.updateEnrollmentById(req.params.enrollmentId, req.body, req.user);
  res.send(enrollment);
});

const deleteEnrollment = catchAsync(async (req, res) => {
  await enrollmentService.deleteEnrollmentById(req.params.enrollmentId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollment,
  updateEnrollment,
  deleteEnrollment,
};


