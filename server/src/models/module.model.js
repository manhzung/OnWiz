const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const moduleSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Thứ tự các lesson thuộc module sẽ được quản lý bằng mảng lesson_ids
    lesson_ids: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

moduleSchema.plugin(toJSON);
moduleSchema.plugin(paginate);

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
