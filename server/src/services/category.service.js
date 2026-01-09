const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  if (await Category.isNameTaken(categoryBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category name already taken');
  }
  if (await Category.isSlugTaken(categoryBody.slug)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category slug already taken');
  }
  return Category.create(categoryBody);
};

/**
 * Query categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async (filter, options) => {
  const query = {};

  if (filter.name) {
    query.name = { $regex: filter.name, $options: 'i' };
  }
  if (filter.type) {
    query.type = filter.type;
  }
  if (filter.is_active !== undefined) {
    query.is_active = filter.is_active;
  }
  if (filter.parent_id) {
    query.parent_id = filter.parent_id;
  }

  const sort = options.sortBy || 'sort_order:asc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Category.paginate) {
    return Category.paginate(query, {
      sortBy: sort,
      limit,
      page,
      populate: [
        { path: 'parent_id', select: 'name slug' },
        { path: 'subcategories', select: 'name slug type is_active' },
      ],
    });
  }

  const categories = await Category.find(query)
    .populate('parent_id', 'name slug')
    .populate('subcategories', 'name slug type is_active')
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);

  return { results: categories };
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  const category = await Category.findById(id)
    .populate('parent_id', 'name slug')
    .populate('subcategories', 'name slug type is_active');
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

/**
 * Get category by slug
 * @param {string} slug
 * @returns {Promise<Category>}
 */
const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug })
    .populate('parent_id', 'name slug')
    .populate('subcategories', 'name slug type is_active');
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);

  if (updateBody.name && updateBody.name !== category.name && (await Category.isNameTaken(updateBody.name, categoryId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category name already taken');
  }
  if (updateBody.slug && updateBody.slug !== category.slug && (await Category.isSlugTaken(updateBody.slug, categoryId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category slug already taken');
  }

  Object.assign(category, updateBody);
  await category.save();
  return category;
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);

  // Check if category has subcategories
  const subcategories = await Category.find({ parent_id: categoryId });
  if (subcategories.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot delete category with subcategories');
  }

  await category.deleteOne();
  return category;
};

/**
 * Get categories by type
 * @param {string} type
 * @param {boolean} activeOnly
 * @returns {Promise<Category[]>}
 */
const getCategoriesByType = async (type, activeOnly = true) => {
  const query = { type };
  if (activeOnly) {
    query.is_active = true;
  }

  return Category.find(query).sort('sort_order:asc').populate('subcategories', 'name slug type is_active');
};

/**
 * Get parent categories
 * @param {string} type - Optional type filter
 * @param {boolean} activeOnly
 * @returns {Promise<Category[]>}
 */
const getParentCategories = async (type, activeOnly = true) => {
  const query = { parent_id: null };
  if (type) {
    query.type = type;
  }
  if (activeOnly) {
    query.is_active = true;
  }

  return Category.find(query).sort('sort_order:asc').populate('subcategories', 'name slug type is_active');
};

/**
 * Get subcategories by parent ID
 * @param {ObjectId} parentId
 * @param {boolean} activeOnly
 * @returns {Promise<Category[]>}
 */
const getSubcategories = async (parentId, activeOnly = true) => {
  const query = { parent_id: parentId };
  if (activeOnly) {
    query.is_active = true;
  }

  return Category.find(query).sort('sort_order:asc');
};

/**
 * Toggle category active status
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const toggleCategoryStatus = async (categoryId) => {
  const category = await getCategoryById(categoryId);

  category.is_active = !category.is_active;
  await category.save();
  return category;
};

/**
 * Get category statistics
 * @returns {Promise<Object>}
 */
const getCategoryStats = async () => {
  const totalCategories = await Category.countDocuments();
  const activeCategories = await Category.countDocuments({ is_active: true });
  const courseCategories = await Category.countDocuments({ type: 'course' });
  const quizCategories = await Category.countDocuments({ type: 'quiz' });
  const parentCategories = await Category.countDocuments({ parent_id: null });
  const subcategories = await Category.countDocuments({ parent_id: { $ne: null } });

  return {
    totalCategories,
    activeCategories,
    inactiveCategories: totalCategories - activeCategories,
    courseCategories,
    quizCategories,
    parentCategories,
    subcategories,
  };
};

/**
 * Update category sort order
 * @param {ObjectId} categoryId
 * @param {number} sortOrder
 * @returns {Promise<Category>}
 */
const updateCategorySortOrder = async (categoryId, sortOrder) => {
  const category = await getCategoryById(categoryId);

  category.sort_order = sortOrder;
  await category.save();
  return category;
};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategoryById,
  deleteCategoryById,
  getCategoriesByType,
  getParentCategories,
  getSubcategories,
  toggleCategoryStatus,
  getCategoryStats,
  updateCategorySortOrder,
};
