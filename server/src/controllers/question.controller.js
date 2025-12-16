const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const questionService = require('../services/question.service');

const getQuestion = catchAsync(async (req, res) => {
  const result = await questionService.getQuestionDetail(req.params.questionId);
  res.send(result);
});

const updateQuestion = catchAsync(async (req, res) => {
  const question = await questionService.updateQuestion(req.params.questionId, req.body);
  res.send(question);
});

const deleteQuestion = catchAsync(async (req, res) => {
  await questionService.deleteQuestion(req.params.questionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getQuestion,
  updateQuestion,
  deleteQuestion,
};



