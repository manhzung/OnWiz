const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const pricingSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      default: 0,
    },
    sale_price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'VND',
    },
    is_free: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail_url: {
      type: String,
      trim: true,
      default: '',
    },

    // Luôn có object pricing với các giá trị mặc định
    pricing: {
      type: pricingSchema,
      default: () => ({}),
    },

    // Thứ tự các module trong khóa học
    module_ids: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Module',
        },
      ],
      default: [],
    },

    total_modules: {
      type: Number,
      default: 0,
    },
    is_published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

courseSchema.plugin(toJSON);
courseSchema.plugin(paginate);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;


