const express = require('express');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const lessonValidation = require('../../validations/lesson.validation');
const lessonController = require('../../controllers/lesson.controller');

const router = express.Router();

router
  .route('/:lessonId')
  .get(requireRole(), validate(lessonValidation.getLesson), lessonController.getLesson)
  .patch(requireRole(), validate(lessonValidation.updateLesson), lessonController.updateLesson)
  .delete(requireRole(), validate(lessonValidation.deleteLesson), lessonController.deleteLesson);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Lesson management
 */

/**
 * @swagger
 * /lessons/{lessonId}:
 *   get:
 *     summary: Get lesson (with resource)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update lesson metadata
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
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
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               is_preview:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a lesson
 *     description: Delete a lesson and its resource (video, theory or quiz).
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */


