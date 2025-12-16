const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const questionFillInSchema = new mongoose.Schema(
  {
    // Danh sách đáp án đúng được chấp nhận
    correct_answers: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'Fill-in questions must have at least one correct answer',
      },
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

questionFillInSchema.plugin(toJSON);
questionFillInSchema.plugin(paginate);

const QuestionFillIn = mongoose.model('QuestionFillIn', questionFillInSchema);

module.exports = QuestionFillIn;


