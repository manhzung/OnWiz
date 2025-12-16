const httpStatus = require('http-status');
const { Question, QuestionSingleChoice, QuestionMultipleChoice, QuestionFillIn, LessonQuiz } = require('../models');
const ApiError = require('../utils/ApiError');

const getQuestionDetail = async (questionId) => {
  const question = await Question.findById(questionId).lean();
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  let detail = null;
  if (question.type === 'single_choice') {
    detail = await QuestionSingleChoice.findById(question.resource_id).lean();
  } else if (question.type === 'multiple_choice') {
    detail = await QuestionMultipleChoice.findById(question.resource_id).lean();
  } else if (question.type === 'fill_in') {
    detail = await QuestionFillIn.findById(question.resource_id).lean();
  }

  return { question, detail };
};

const updateQuestion = async (questionId, body) => {
  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  if (body.difficulty !== undefined) {
    question.difficulty = body.difficulty;
  }
  if (body.content !== undefined) {
    question.content = body.content;
  }
  if (body.image_url !== undefined) {
    question.image_url = body.image_url || '';
  }

  // Cập nhật phần chi tiết
  if (question.type === 'single_choice') {
    const update = {};
    if (body.options) update.options = body.options;
    if (body.explanation !== undefined) update.explanation = body.explanation || '';
    if (Object.keys(update).length) {
      await QuestionSingleChoice.findByIdAndUpdate(question.resource_id, update, { runValidators: true });
    }
  } else if (question.type === 'multiple_choice') {
    const update = {};
    if (body.options) update.options = body.options;
    if (body.explanation !== undefined) update.explanation = body.explanation || '';
    if (Object.keys(update).length) {
      await QuestionMultipleChoice.findByIdAndUpdate(question.resource_id, update, { runValidators: true });
    }
  } else if (question.type === 'fill_in') {
    const update = {};
    if (body.correct_answers) update.correct_answers = body.correct_answers;
    if (body.explanation !== undefined) update.explanation = body.explanation || '';
    if (Object.keys(update).length) {
      await QuestionFillIn.findByIdAndUpdate(question.resource_id, update, { runValidators: true });
    }
  }

  await question.save();
  return question;
};

const deleteQuestion = async (questionId) => {
  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  // Xoá document chi tiết
  if (question.type === 'single_choice') {
    await QuestionSingleChoice.findByIdAndDelete(question.resource_id);
  } else if (question.type === 'multiple_choice') {
    await QuestionMultipleChoice.findByIdAndDelete(question.resource_id);
  } else if (question.type === 'fill_in') {
    await QuestionFillIn.findByIdAndDelete(question.resource_id);
  }

  // Gỡ question ra khỏi tất cả quiz chứa nó
  await LessonQuiz.updateMany({ question_ids: question._id }, { $pull: { question_ids: question._id } });

  await question.deleteOne();
  return question;
};

module.exports = {
  getQuestionDetail,
  updateQuestion,
  deleteQuestion,
};



