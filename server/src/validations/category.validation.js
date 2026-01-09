const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    slug: Joi.string().required().trim(),
    description: Joi.string().trim().allow(''),
    type: Joi.string().valid('course', 'quiz').required(),
    icon: Joi.string().trim().allow(''),
    color: Joi.string().trim().allow(''),
    is_active: Joi.boolean(),
    sort_order: Joi.number().integer().min(0),
    parent_id: Joi.string().custom(objectId).allow(null),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    name: Joi.string(),
    type: Joi.string().valid('course', 'quiz'),
    is_active: Joi.boolean(),
    parent_id: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const getCategoryBySlug = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      slug: Joi.string().trim(),
      description: Joi.string().trim().allow(''),
      type: Joi.string().valid('course', 'quiz'),
      icon: Joi.string().trim().allow(''),
      color: Joi.string().trim().allow(''),
      is_active: Joi.boolean(),
      sort_order: Joi.number().integer().min(0),
      parent_id: Joi.string().custom(objectId).allow(null),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const getCategoriesByType = {
  params: Joi.object().keys({
    type: Joi.string().valid('course', 'quiz').required(),
  }),
  query: Joi.object().keys({
    active_only: Joi.string().valid('true', 'false'),
  }),
};

const getParentCategories = {
  query: Joi.object().keys({
    type: Joi.string().valid('course', 'quiz'),
    active_only: Joi.string().valid('true', 'false'),
  }),
};

const getSubcategories = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    active_only: Joi.string().valid('true', 'false'),
  }),
};

const toggleCategoryStatus = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const updateCategorySortOrder = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    sort_order: Joi.number().integer().min(0).required(),
  }),
};

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
  updateCategorySortOrder,
};
