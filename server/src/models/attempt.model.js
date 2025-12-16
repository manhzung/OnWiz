const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const answerSchema = new mongoose.Schema(
  {
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    is_correct: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz_lesson_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    is_passed: {
      type: Boolean,
      required: true,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    started_at: {
      type: Date,
      required: true,
    },
    submitted_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

attemptSchema.plugin(toJSON);
attemptSchema.plugin(paginate);

const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = Attempt;


