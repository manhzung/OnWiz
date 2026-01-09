const express = require('express');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const notificationValidation = require('../../validations/notification.validation');
const notificationController = require('../../controllers/notification.controller');

const router = express.Router();

// Notification CRUD operations
router
  .route('/')
  .post(
    auth,
    requireRole(['admin']),
    validate(notificationValidation.createNotification),
    notificationController.createNotification
  )
  .get(auth, validate(notificationValidation.getNotifications), notificationController.getNotifications);

// Notifications by recipient
router
  .route('/recipient/:recipientId')
  .get(
    auth,
    validate(notificationValidation.getNotificationsByRecipient),
    notificationController.getNotificationsByRecipient
  );

// My notifications
router
  .route('/my-notifications')
  .get(auth, notificationController.getMyNotifications)
  .delete(auth, notificationController.deleteMyNotifications);

// Bulk operations
router
  .route('/bulk')
  .post(
    auth,
    requireRole(['admin']),
    validate(notificationValidation.sendBulkNotifications),
    notificationController.sendBulkNotifications
  );

// Mark operations
router.route('/mark-all-read').patch(auth, notificationController.markAllAsRead);

// Notification statistics
router.route('/stats').get(auth, requireRole(['admin']), notificationController.getNotificationStats);

// Individual notification operations
router
  .route('/:notificationId')
  .get(auth, validate(notificationValidation.getNotification), notificationController.getNotification)
  .patch(auth, validate(notificationValidation.updateNotification), notificationController.updateNotification)
  .delete(auth, validate(notificationValidation.deleteNotification), notificationController.deleteNotification);

// Mark as read
router
  .route('/:notificationId/read')
  .patch(auth, validate(notificationValidation.markAsRead), notificationController.markAsRead);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notification system
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a notification
 *     description: Create a new notification for a user. Only admins can create notifications.
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
 *                 description: ID of the user to receive the notification
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *                 description: Notification content
 *               type:
 *                 type: string
 *                 enum: [system, promotion, reminder]
 *                 default: system
 *                 description: Type of notification
 *               is_read:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the notification has been read
 *             example:
 *               recipient_id: 60d5ecb74b24c72b8c8b4567
 *               content: "Welcome to our platform!"
 *               type: system
 *               is_read: false
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Notification'
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
 *     summary: List notifications
 *     description: Users see their own notifications; admins can filter by recipient_id and other criteria.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: recipient_id
 *         schema:
 *           type: string
 *         description: Filter by recipient ID (admin only)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [system, promotion, reminder]
 *         description: Filter by notification type
 *       - in: query
 *         name: is_read
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date (YYYY-MM-DD)
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date (YYYY-MM-DD)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. created_at:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 20
 *         description: Maximum number of notifications
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
 *                     $ref: '#/components/schemas/Notification'
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
 */

/**
 * @swagger
 * /notifications/my-notifications:
 *   get:
 *     summary: Get my notifications
 *     description: Get all notifications for the authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of notifications
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
 *                     $ref: '#/components/schemas/Notification'
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
 *
 *   delete:
 *     summary: Delete all my notifications
 *     description: Delete all notifications for the authenticated user.
 *     tags: [Notifications]
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
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deletedCount:
 *                   type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /notifications/recipient/{recipientId}:
 *   get:
 *     summary: Get notifications by recipient
 *     description: Get all notifications for a specific recipient. Only the recipient themselves or admins can access.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipientId
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipient ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of notifications
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
 *                     $ref: '#/components/schemas/Notification'
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
 */

/**
 * @swagger
 * /notifications/bulk:
 *   post:
 *     summary: Send bulk notifications
 *     description: Send the same notification to multiple users. Only admins can send bulk notifications.
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
 *               - recipient_ids
 *               - content
 *             properties:
 *               recipient_ids:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                 description: Array of recipient user IDs
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *                 description: Notification content
 *               type:
 *                 type: string
 *                 enum: [system, promotion, reminder]
 *                 default: system
 *                 description: Type of notification
 *             example:
 *               recipient_ids: ["60d5ecb74b24c72b8c8b4567", "60d5ecb74b24c72b8c8b4568"]
 *               content: "System maintenance scheduled for tonight"
 *               type: system
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /notifications/mark-all-read:
 *   patch:
 *     summary: Mark all notifications as read
 *     description: Mark all notifications for the authenticated user as read.
 *     tags: [Notifications]
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
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 modifiedCount:
 *                   type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /notifications/stats:
 *   get:
 *     summary: Get notification statistics
 *     description: Get comprehensive statistics about notifications. Only admins can access this endpoint.
 *     tags: [Notifications]
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
 *                 totalNotifications:
 *                   type: integer
 *                   example: 1250
 *                 notificationsByType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         enum: [system, promotion, reminder]
 *                       count:
 *                         type: integer
 *                 readVsUnread:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: boolean
 *                         description: false = unread, true = read
 *                       count:
 *                         type: integer
 *                 notificationsByRecipient:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Recipient ID
 *                       count:
 *                         type: integer
 *                       unreadCount:
 *                         type: integer
 *                 notificationsByMonth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: object
 *                         properties:
 *                           year:
 *                             type: integer
 *                           month:
 *                             type: integer
 *                       count:
 *                         type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /notifications/{notificationId}:
 *   get:
 *     summary: Get notification by ID
 *     description: Get a specific notification by its ID. Only the recipient or admins can access.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Notification'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update notification by ID
 *     description: Update notification properties. Recipients can only mark notifications as read.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_read
 *             properties:
 *               is_read:
 *                 type: boolean
 *                 description: Mark notification as read/unread
 *             example:
 *               is_read: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Notification'
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
 *     summary: Delete notification by ID
 *     description: Delete a notification. Only the recipient or admins can delete notifications.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
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
 * /notifications/{notificationId}/read:
 *   patch:
 *     summary: Mark notification as read
 *     description: Mark a specific notification as read. Only the recipient can mark notifications as read.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Notification'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
