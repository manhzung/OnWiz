const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const VIDEO_PROVIDERS = ['youtube', 'vimeo'];

const lessonVideoSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: VIDEO_PROVIDERS,
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    transcript: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

lessonVideoSchema.plugin(toJSON);
lessonVideoSchema.plugin(paginate);

const LessonVideo = mongoose.model('LessonVideo', lessonVideoSchema);

module.exports = {
  LessonVideo,
  VIDEO_PROVIDERS,
};
