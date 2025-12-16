const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const moduleService = require('../services/module.service');

const getModule = catchAsync(async (req, res) => {
  const moduleDoc = await moduleService.getModuleById(req.params.moduleId);
  res.send(moduleDoc);
});

const updateModule = catchAsync(async (req, res) => {
  const moduleDoc = await moduleService.updateModule(req.params.moduleId, req.body);
  res.send(moduleDoc);
});

const deleteModule = catchAsync(async (req, res) => {
  await moduleService.deleteModule(req.params.moduleId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getModule,
  updateModule,
  deleteModule,
};



