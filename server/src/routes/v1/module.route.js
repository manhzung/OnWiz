const express = require('express');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const moduleValidation = require('../../validations/module.validation');
const moduleController = require('../../controllers/module.controller');

const router = express.Router();

router
  .route('/')
  .post(auth, validate(moduleValidation.createModule), moduleController.createModule)
  .get(auth, validate(moduleValidation.getModules), moduleController.getModules);

router
  .route('/course/:courseId')
  .get(auth, validate(moduleValidation.getModulesByCourse), moduleController.getModulesByCourse);

router.route('/stats').get(auth, requireRole(['admin']), moduleController.getModuleStats);

router
  .route('/:moduleId')
  .get(auth, validate(moduleValidation.getModule), moduleController.getModule)
  .patch(auth, validate(moduleValidation.updateModule), moduleController.updateModule)
  .delete(auth, validate(moduleValidation.deleteModule), moduleController.deleteModule);

router
  .route('/:moduleId/lessons')
  .post(auth, validate(moduleValidation.addLessonToModule), moduleController.addLessonToModule);

router
  .route('/:moduleId/lessons/:lessonId')
  .delete(auth, validate(moduleValidation.removeLessonFromModule), moduleController.removeLessonFromModule);

router
  .route('/:moduleId/reorder-lessons')
  .patch(auth, validate(moduleValidation.reorderLessons), moduleController.reorderLessons);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Module management and lesson organization
 */

/**
 * @swagger
 * /modules:
 *   post:
 *     summary: Create a module
 *     description: Create a new module for a course. Only the course instructor can create modules.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_id
 *               - title
 *             properties:
 *               course_id:
 *                 type: string
 *                 description: ID of the course this module belongs to
 *               title:
 *                 type: string
 *                 description: Module title
 *             example:
 *               course_id: 60d5ecb74b24c72b8c8b4567
 *               title: Introduction to Programming
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Module'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   get:
 *     summary: Get all modules
 *     description: Retrieve all modules with optional filtering. Only instructors and admins can access.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: course_id
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by module title
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. created_at:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of modules
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
 *                     $ref: '#/components/schemas/Module'
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
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /modules/course/{courseId}:
 *   get:
 *     summary: Get modules by course
 *     description: Retrieve all modules belonging to a specific course.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of modules
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
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
 *                     $ref: '#/components/schemas/Module'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /modules/stats:
 *   get:
 *     summary: Get module statistics
 *     description: Get comprehensive statistics about modules. Only admins can access this endpoint.
 *     tags: [Modules]
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
 *                 totalModules:
 *                   type: integer
 *                   example: 150
 *                 avgModulesPerCourse:
 *                   type: number
 *                   example: 3.5
 *                 maxModulesInCourse:
 *                   type: integer
 *                   example: 10
 *                 minModulesInCourse:
 *                   type: integer
 *                   example: 1
 *                 totalLessonsInModules:
 *                   type: integer
 *                   example: 450
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /modules/{moduleId}:
 *   get:
 *     summary: Get a module by ID
 *     description: Retrieve a module by its ID. Only the course instructor can access.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Module'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a module by ID
 *     description: Update module information. Only the course instructor can update.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Module title
 *             example:
 *               title: Advanced Programming Concepts
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Module'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a module by ID
 *     description: Delete a module and all its lessons. Only the course instructor can delete.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /modules/{moduleId}/lessons:
 *   post:
 *     summary: Add lesson to module
 *     description: Add an existing lesson to a module. Only the course instructor can perform this action.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lessonId
 *             properties:
 *               lessonId:
 *                 type: string
 *                 description: ID of the lesson to add
 *             example:
 *               lessonId: 60d5ecb74b24c72b8c8b4568
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Module'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /modules/{moduleId}/lessons/{lessonId}:
 *   delete:
 *     summary: Remove lesson from module
 *     description: Remove a lesson from a module. Only the course instructor can perform this action.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID to remove
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Module'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /modules/{moduleId}/reorder-lessons:
 *   patch:
 *     summary: Reorder lessons in module
 *     description: Change the order of lessons within a module. Only the course instructor can perform this action.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lessonIds
 *             properties:
 *               lessonIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of lesson IDs in the desired order
 *             example:
 *               lessonIds: ["60d5ecb74b24c72b8c8b4568", "60d5ecb74b24c72b8c8b4569", "60d5ecb74b24c72b8c8b4570"]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Module'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
