const express = require('express');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const messageValidation = require('../../validations/message.validation');
const messageController = require('../../controllers/message.controller');

const router = express.Router();

router
  .route('/')
  .post(requireRole(), validate(messageValidation.createMessage), messageController.createMessage)
  .get(requireRole(), validate(messageValidation.getMessages), messageController.getMessages);

router
  .route('/:messageId')
  .delete(requireRole(['admin']), validate(messageValidation.deleteMessage), messageController.deleteMessage);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Classroom messages
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message to classroom
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classroom_id
 *               - content
 *             properties:
 *               classroom_id:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [text, system]
 *     responses:
 *       "201":
 *         description: Created
 *   get:
 *     summary: List messages in a classroom
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classroom_id
 *         required: true
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
 * /messages/{messageId}:
 *   delete:
 *     summary: Delete a message (admin)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

