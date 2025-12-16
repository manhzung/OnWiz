const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Vỏ câu hỏi: phân loại + stem nội dung + liên kết tới "ruột" chi tiết
const QUESTION_TYPES = ['single_choice', 'multiple_choice', 'fill_in'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: QUESTION_TYPES,
      required: true,
    },
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      default: 'easy',
    },
    // Nội dung chính của câu hỏi (stem)
    content: {
      type: String,
      required: true,
    },
    // Ảnh minh hoạ cho câu hỏi (nếu có)
    image_url: {
      type: String,
      default: '',
    },
    // Liên kết tới document chi tiết tuỳ theo type
    // single_choice -> QuestionSingleChoice, multiple_choice -> QuestionMultipleChoice, fill_in -> QuestionFillIn
    resource_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

questionSchema.plugin(toJSON);
questionSchema.plugin(paginate);

const Question = mongoose.model('Question', questionSchema);

module.exports = {
  Question,
  QUESTION_TYPES,
  DIFFICULTIES,
};


