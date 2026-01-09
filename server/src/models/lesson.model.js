const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const LESSON_TYPES = ['video', 'theory', 'quiz'];

const lessonSchema = new mongoose.Schema(
  {
    module_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: LESSON_TYPES,
      required: true,
    },
    // Liên kết đa hình tới nội dung chi tiết
    resource_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    is_preview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

lessonSchema.plugin(toJSON);
lessonSchema.plugin(paginate);

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = {
  Lesson,
  LESSON_TYPES,
};
