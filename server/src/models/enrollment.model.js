const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ENROLLMENT_STATUS = ['active', 'completed'];

const currentPositionSchema = new mongoose.Schema(
  {
    module_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
    },
    lesson_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    timestamp: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const enrollmentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completed_lessons: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson',
        },
      ],
      default: [],
    },
    completedLessons: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    current_position: {
      type: currentPositionSchema,
      default: () => ({}),
    },
    progress_percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastAccessedAt: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ENROLLMENT_STATUS,
      default: 'active',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

enrollmentSchema.plugin(toJSON);
enrollmentSchema.plugin(paginate);

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = {
  Enrollment,
  ENROLLMENT_STATUS,
};
