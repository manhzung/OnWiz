const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const attachmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const lessonTheorySchema = new mongoose.Schema(
  {
    content_html: {
      type: String,
      required: true,
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    reading_time_minutes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

lessonTheorySchema.plugin(toJSON);
lessonTheorySchema.plugin(paginate);

const LessonTheory = mongoose.model('LessonTheory', lessonTheorySchema);

module.exports = LessonTheory;
