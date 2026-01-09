const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const singleChoiceOptionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    is_correct: {
      type: Boolean,
      default: false,
    },
    image_url: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const questionSingleChoiceSchema = new mongoose.Schema(
  {
    options: {
      type: [singleChoiceOptionSchema],
      validate: {
        validator(value) {
          if (!Array.isArray(value) || value.length < 2) {
            return false;
          }
          const correctCount = value.filter((o) => o.is_correct).length;
          return correctCount === 1;
        },
        message: 'Single choice question must have at least 2 options and exactly 1 correct answer',
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

questionSingleChoiceSchema.plugin(toJSON);
questionSingleChoiceSchema.plugin(paginate);

const QuestionSingleChoice = mongoose.model('QuestionSingleChoice', questionSingleChoiceSchema);

module.exports = QuestionSingleChoice;
