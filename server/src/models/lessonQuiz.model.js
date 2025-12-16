const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const quizSettingsSchema = new mongoose.Schema(
  {
    time_limit: {
      type: Number,
      required: true,
    },
    pass_score: {
      type: Number,
      required: true,
    },
    shuffle_questions: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const lessonQuizSchema = new mongoose.Schema(
  {
    settings: {
      type: quizSettingsSchema,
      required: true,
    },
    question_ids: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

lessonQuizSchema.plugin(toJSON);
lessonQuizSchema.plugin(paginate);

const LessonQuiz = mongoose.model('LessonQuiz', lessonQuizSchema);

module.exports = LessonQuiz;


