const express = require('express');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const attemptValidation = require('../../validations/attempt.validation');
const attemptController = require('../../controllers/attempt.controller');

const router = express.Router();

router
  .route('/')
  .post(auth, requireRole(), validate(attemptValidation.createAttempt), attemptController.createAttempt)
  .get(auth, requireRole(), validate(attemptValidation.getAttempts), attemptController.getAttempts);

router
  .route('/:attemptId')
  .get(auth, requireRole(), validate(attemptValidation.getAttempt), attemptController.getAttempt)
  .delete(auth, requireRole(), validate(attemptValidation.deleteAttempt), attemptController.deleteAttempt);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Attempts
 *   description: Quiz attempts
 */

/**
 * @swagger
 * /attempts:
 *   post:
 *     summary: Create an attempt for a quiz
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quiz_lesson_id
 *               - score
 *               - is_passed
 *               - answers
 *               - started_at
 *             properties:
 *               quiz_lesson_id:
 *                 type: string
 *               score:
 *                 type: number
 *               is_passed:
 *                 type: boolean
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *               started_at:
 *                 type: string
 *                 format: date-time
 *               submitted_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       "201":
 *         description: Created
 *   get:
 *     summary: List attempts
 *     description: Users see their own attempts; admins can filter by user_id and quiz_lesson_id.
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: quiz_lesson_id
 *         schema:
 *           type: string
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
 * /attempts/{attemptId}:
 *   get:
 *     summary: Get an attempt
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attemptId
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
 *   delete:
 *     summary: Delete an attempt
 *     tags: [Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
