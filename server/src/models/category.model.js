const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const CATEGORY_TYPES = ['course', 'quiz'];

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      enum: CATEGORY_TYPES,
      required: true,
    },
    icon: {
      type: String,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      trim: true,
      default: '#6B7280', // Default gray color
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    sort_order: {
      type: Number,
      default: 0,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Indexes for performance
categorySchema.index({ type: 1, is_active: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ parent_id: 1 });

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent_id',
});

// Plugin for toJSON and pagination
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

// Static methods
categorySchema.statics.isNameTaken = async function (name, excludeCategoryId) {
  const category = await this.findOne({
    name,
    _id: { $ne: excludeCategoryId },
  });
  return !!category;
};

categorySchema.statics.isSlugTaken = async function (slug, excludeCategoryId) {
  const category = await this.findOne({
    slug,
    _id: { $ne: excludeCategoryId },
  });
  return !!category;
};

const Category = mongoose.model('Category', categorySchema);

module.exports = {
  Category,
  CATEGORY_TYPES,
};
