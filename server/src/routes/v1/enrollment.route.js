const express = require('express');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const enrollmentValidation = require('../../validations/enrollment.validation');
const enrollmentController = require('../../controllers/enrollment.controller');

const router = express.Router();

router
  .route('/')
  .post(requireRole(), validate(enrollmentValidation.createEnrollment), enrollmentController.createEnrollment)
  .get(requireRole(), validate(enrollmentValidation.getEnrollments), enrollmentController.getEnrollments);

router
  .route('/:enrollmentId')
  .get(requireRole(), validate(enrollmentValidation.getEnrollment), enrollmentController.getEnrollment)
  .patch(requireRole(), validate(enrollmentValidation.updateEnrollment), enrollmentController.updateEnrollment)
  .delete(requireRole(), validate(enrollmentValidation.deleteEnrollment), enrollmentController.deleteEnrollment);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Course enrollments and progress
 */

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Enroll current user into a course
 *     tags: [Enrollments]
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
 *             properties:
 *               course_id:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Created
 *   get:
 *     summary: List enrollments
 *     description: Users see their own enrollments; admins can filter by user_id and course_id.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: course_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /enrollments/{enrollmentId}:
 *   get:
 *     summary: Get an enrollment
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update enrollment progress
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed_lessons:
 *                 type: array
 *                 items:
 *                   type: string
 *               current_position:
 *                 type: object
 *               progress_percent:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, completed]
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete an enrollment
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

