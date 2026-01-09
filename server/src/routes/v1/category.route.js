const express = require('express');
const { categoryController } = require('../../controllers');
const { categoryValidation } = require('../../validations');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');

const router = express.Router();

router
  .route('/')
  .post(auth, requireRole(['admin']), validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(validate(categoryValidation.getCategories), categoryController.getCategories);

router.route('/slug/:slug').get(validate(categoryValidation.getCategoryBySlug), categoryController.getCategoryBySlug);

router.route('/type/:type').get(validate(categoryValidation.getCategoriesByType), categoryController.getCategoriesByType);

router.route('/parents').get(validate(categoryValidation.getParentCategories), categoryController.getParentCategories);

router.route('/stats').get(auth, requireRole(['admin']), categoryController.getCategoryStats);

router
  .route('/:categoryId')
  .get(validate(categoryValidation.getCategory), categoryController.getCategory)
  .patch(auth, requireRole(['admin']), validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(auth, requireRole(['admin']), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

router
  .route('/:categoryId/subcategories')
  .get(validate(categoryValidation.getSubcategories), categoryController.getSubcategories);

router
  .route('/:categoryId/toggle-status')
  .patch(
    auth,
    requireRole(['admin']),
    validate(categoryValidation.toggleCategoryStatus),
    categoryController.toggleCategoryStatus
  );

router
  .route('/:categoryId/sort-order')
  .patch(
    auth,
    requireRole(['admin']),
    validate(categoryValidation.updateCategorySortOrder),
    categoryController.updateCategorySortOrder
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management and retrieval
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a category
 *     description: Only admins can create categories.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               slug:
 *                 type: string
 *                 description: URL-friendly identifier (must be unique)
 *               description:
 *                 type: string
 *                 description: Category description
 *               type:
 *                 type: string
 *                 enum: [course, quiz]
 *                 description: Category type
 *               icon:
 *                 type: string
 *                 description: Category icon URL
 *               color:
 *                 type: string
 *                 description: Category color (hex code)
 *               is_active:
 *                 type: boolean
 *                 default: true
 *               sort_order:
 *                 type: integer
 *                 minimum: 0
 *                 description: Display order
 *               parent_id:
 *                 type: string
 *                 description: Parent category ID (null for root categories)
 *             example:
 *               name: Web Development
 *               slug: web-development
 *               description: Learn web development technologies
 *               type: course
 *               icon: /icons/web.png
 *               color: "#3B82F6"
 *               is_active: true
 *               sort_order: 1
 *               parent_id: null
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all categories
 *     description: Retrieve all categories with optional filtering.
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by category name
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [course, quiz]
 *         description: Filter by category type
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: parent_id
 *         schema:
 *           type: string
 *         description: Filter by parent category ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. sort_order:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of categories
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 */

/**
 * @swagger
 * /categories/slug/{slug}:
 *   get:
 *     summary: Get category by slug
 *     description: Retrieve a category by its slug.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /categories/type/{type}:
 *   get:
 *     summary: Get categories by type
 *     description: Retrieve all categories of a specific type.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [course, quiz]
 *         description: Category type
 *       - in: query
 *         name: active_only
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         default: true
 *         description: Return only active categories
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /categories/parents:
 *   get:
 *     summary: Get parent categories
 *     description: Retrieve all parent (root) categories.
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [course, quiz]
 *         description: Filter by category type
 *       - in: query
 *         name: active_only
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         default: true
 *         description: Return only active categories
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /categories/stats:
 *   get:
 *     summary: Get category statistics
 *     description: Get comprehensive statistics about categories. Only admins can access this endpoint.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCategories:
 *                   type: integer
 *                   example: 25
 *                 activeCategories:
 *                   type: integer
 *                   example: 22
 *                 inactiveCategories:
 *                   type: integer
 *                   example: 3
 *                 courseCategories:
 *                   type: integer
 *                   example: 15
 *                 quizCategories:
 *                   type: integer
 *                   example: 10
 *                 parentCategories:
 *                   type: integer
 *                   example: 8
 *                 subcategories:
 *                   type: integer
 *                   example: 17
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /categories/{categoryId}:
 *   get:
 *     summary: Get category by ID
 *     description: Retrieve a category by its ID.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update category by ID
 *     description: Only admins can update categories.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [course, quiz]
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               sort_order:
 *                 type: integer
 *                 minimum: 0
 *               parent_id:
 *                 type: string
 *             example:
 *               name: Advanced Web Development
 *               description: Learn advanced web development technologies
 *               is_active: true
 *               sort_order: 2
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete category by ID
 *     description: Only admins can delete categories. Categories with subcategories cannot be deleted.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       "204":
 *         description: No content
 *       "400":
 *         description: Bad Request - Category has subcategories
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /categories/{categoryId}/subcategories:
 *   get:
 *     summary: Get subcategories
 *     description: Retrieve all subcategories of a parent category.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent category ID
 *       - in: query
 *         name: active_only
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         default: true
 *         description: Return only active subcategories
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /categories/{categoryId}/toggle-status:
 *   patch:
 *     summary: Toggle category active status
 *     description: Toggle a category's active/inactive status. Only admins can perform this action.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /categories/{categoryId}/sort-order:
 *   patch:
 *     summary: Update category sort order
 *     description: Update a category's display sort order. Only admins can perform this action.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sort_order
 *             properties:
 *               sort_order:
 *                 type: integer
 *                 minimum: 0
 *             example:
 *               sort_order: 5
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
