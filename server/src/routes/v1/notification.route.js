const express = require('express');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const notificationValidation = require('../../validations/notification.validation');
const notificationController = require('../../controllers/notification.controller');

const router = express.Router();

router
  .route('/')
  .post(requireRole(['admin']), validate(notificationValidation.createNotification), notificationController.createNotification)
  .get(requireRole(), validate(notificationValidation.getNotifications), notificationController.getNotifications);

router
  .route('/:notificationId')
  .patch(requireRole(), validate(notificationValidation.updateNotification), notificationController.updateNotification)
  .delete(requireRole(), validate(notificationValidation.deleteNotification), notificationController.deleteNotification);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notifications
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a notification (admin)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipient_id
 *               - content
 *             properties:
 *               recipient_id:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [system, promotion, reminder]
 *               is_read:
 *                 type: boolean
 *     responses:
 *       "201":
 *         description: Created
 *   get:
 *     summary: List notifications
 *     description: Users see their own notifications; admins can filter by recipient_id.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: recipient_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: is_read
 *         schema:
 *           type: boolean
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
 * /notifications/{notificationId}:
 *   patch:
 *     summary: Update notification (e.g. mark as read)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
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
 *               is_read:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: OK
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

