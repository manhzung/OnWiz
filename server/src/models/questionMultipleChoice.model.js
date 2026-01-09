const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const multipleChoiceOptionSchema = new mongoose.Schema(
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

const questionMultipleChoiceSchema = new mongoose.Schema(
  {
    options: {
      type: [multipleChoiceOptionSchema],
      validate: {
        validator(value) {
          if (!Array.isArray(value) || value.length < 2) {
            return false;
          }
          const correctCount = value.filter((o) => o.is_correct).length;
          return correctCount >= 1;
        },
        message: 'Multiple choice question must have at least 2 options and at least 1 correct answer',
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

questionMultipleChoiceSchema.plugin(toJSON);
questionMultipleChoiceSchema.plugin(paginate);

const QuestionMultipleChoice = mongoose.model('QuestionMultipleChoice', questionMultipleChoiceSchema);

module.exports = QuestionMultipleChoice;
