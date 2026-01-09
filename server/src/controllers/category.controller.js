const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

/**
 * Create a category
 * @route POST /api/v1/categories
 * @access Private (Admin only)
 */
const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(category);
});

/**
 * Query categories
 * @route GET /api/v1/categories
 * @access Public
 */
const getCategories = catchAsync(async (req, res) => {
  const result = await categoryService.queryCategories(req.query, {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  });
  res.send(result);
});

/**
 * Get category by ID
 * @route GET /api/v1/categories/:categoryId
 * @access Public
 */
const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);
  res.send(category);
});

/**
 * Get category by slug
 * @route GET /api/v1/categories/slug/:slug
 * @access Public
 */
const getCategoryBySlug = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  res.send(category);
});

/**
 * Update category by ID
 * @route PATCH /api/v1/categories/:categoryId
 * @access Private (Admin only)
 */
const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  res.send(category);
});

/**
 * Delete category by ID
 * @route DELETE /api/v1/categories/:categoryId
 * @access Private (Admin only)
 */
const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get categories by type
 * @route GET /api/v1/categories/type/:type
 * @access Public
 */
const getCategoriesByType = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategoriesByType(req.params.type, req.query.active_only !== 'false');
  res.send({ results: categories });
});

/**
 * Get parent categories
 * @route GET /api/v1/categories/parents
 * @access Public
 */
const getParentCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getParentCategories(req.query.type, req.query.active_only !== 'false');
  res.send({ results: categories });
});

/**
 * Get subcategories by parent ID
 * @route GET /api/v1/categories/:categoryId/subcategories
 * @access Public
 */
const getSubcategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getSubcategories(req.params.categoryId, req.query.active_only !== 'false');
  res.send({ results: categories });
});

/**
 * Toggle category active status
 * @route PATCH /api/v1/categories/:categoryId/toggle-status
 * @access Private (Admin only)
 */
const toggleCategoryStatus = catchAsync(async (req, res) => {
  const category = await categoryService.toggleCategoryStatus(req.params.categoryId);
  res.send(category);
});

/**
 * Get category statistics
 * @route GET /api/v1/categories/stats
 * @access Private (Admin only)
 */
const getCategoryStats = catchAsync(async (req, res) => {
  const stats = await categoryService.getCategoryStats();
  res.send(stats);
});

/**
 * Update category sort order
 * @route PATCH /api/v1/categories/:categoryId/sort-order
 * @access Private (Admin only)
 */
const updateCategorySortOrder = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategorySortOrder(req.params.categoryId, req.body.sort_order);
  res.send(category);
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getCategoriesByType,
  getParentCategories,
  getSubcategories,
  toggleCategoryStatus,
  getCategoryStats,
  updateCategorySortOrder,
};
