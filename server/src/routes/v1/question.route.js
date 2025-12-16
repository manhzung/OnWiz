const express = require('express');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const questionValidation = require('../../validations/question.validation');
const questionController = require('../../controllers/question.controller');

const router = express.Router();

router
  .route('/:questionId')
  .get(requireRole(), validate(questionValidation.getQuestion), questionController.getQuestion)
  .patch(requireRole(), validate(questionValidation.updateQuestion), questionController.updateQuestion)
  .delete(requireRole(), validate(questionValidation.deleteQuestion), questionController.deleteQuestion);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management
 */

/**
 * @swagger
 * /questions/{questionId}:
 *   get:
 *     summary: Get question (with detail)
 *     description: Returns the question shell and its type-specific detail document.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
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
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               content:
 *                 type: string
 *               image_url:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *               correct_answers:
 *                 type: array
 *                 items:
 *                   type: string
 *               explanation:
 *                 type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a question
 *     description: Delete question shell and its detail; also pull it from all quizzes.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */


