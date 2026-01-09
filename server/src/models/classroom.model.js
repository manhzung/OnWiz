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

const materialSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    material_url: {
      type: String,
      required: true,
      trim: true,
    },
    file_size: {
      type: Number,
      required: true,
      min: 0,
    },
    file_type: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: { createdAt: 'uploaded_at', updatedAt: false } }
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
    imageURL: {
      type: String,
      default: '',
      trim: true,
    },
    materials: {
      type: [materialSchema],
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
