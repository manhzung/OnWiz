const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const CLASSROOM_ROLES = ['student', 'admin', 'assistant'];

const memberSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: CLASSROOM_ROLES,
      default: 'student',
    },
  },
  { _id: false }
);

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    members: {
      type: [memberSchema],
      default: [],
    },
    assigned_courses: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

classroomSchema.plugin(toJSON);
classroomSchema.plugin(paginate);

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = {
  Classroom,
  CLASSROOM_ROLES,
};


