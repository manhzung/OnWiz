const express = require('express');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const messageValidation = require('../../validations/message.validation');
const messageController = require('../../controllers/message.controller');

const router = express.Router();

// Message CRUD operations
router
  .route('/')
  .post(auth, validate(messageValidation.createMessage), messageController.createMessage)
  .get(auth, validate(messageValidation.getMessages), messageController.getMessages);

// Messages by classroom
router
  .route('/classroom/:classroomId')
  .get(auth, validate(messageValidation.getMessagesByClassroom), messageController.getMessagesByClassroom);

// Messages by sender
router
  .route('/sender/:senderId')
  .get(auth, validate(messageValidation.getMessagesBySender), messageController.getMessagesBySender);

// My messages
router.route('/my-messages').get(auth, messageController.getMyMessages);

// Search messages
router.route('/search').get(auth, validate(messageValidation.searchMessages), messageController.searchMessages);

// Message statistics
router.route('/stats').get(auth, requireRole(['admin']), messageController.getMessageStats);

// Mark messages as read
router.route('/mark-read').post(auth, validate(messageValidation.markMessagesAsRead), messageController.markMessagesAsRead);

// Individual message operations
router
  .route('/:messageId')
  .get(auth, validate(messageValidation.getMessage), messageController.getMessage)
  .patch(auth, validate(messageValidation.updateMessage), messageController.updateMessage)
  .delete(auth, validate(messageValidation.deleteMessage), messageController.deleteMessage);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Classroom messaging system
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message to classroom
 *     description: Send a message to a classroom. Only classroom members can send messages.
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
 *                 description: ID of the classroom to send message to
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 description: Message content
 *               type:
 *                 type: string
 *                 enum: [text, system]
 *                 default: text
 *                 description: Type of message
 *             example:
 *               classroom_id: 60d5ecb74b24c72b8c8b4567
 *               content: "Hello everyone!"
 *               type: text
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Message'
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
 *     summary: List messages
 *     description: Get messages with optional filtering. Users see messages from classrooms they belong to.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classroom_id
 *         schema:
 *           type: string
 *         description: Filter by classroom ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [text, system]
 *         description: Filter by message type
 *       - in: query
 *         name: sender_id
 *         schema:
 *           type: string
 *         description: Filter by sender ID
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
 *         description: Maximum number of messages
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
 *                     $ref: '#/components/schemas/Message'
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
 * /messages/classroom/{classroomId}:
 *   get:
 *     summary: Get messages by classroom
 *     description: Get all messages in a specific classroom. Only classroom members can access.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query (ex. created_at:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of messages
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
 *                     $ref: '#/components/schemas/Message'
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
 * /messages/sender/{senderId}:
 *   get:
 *     summary: Get messages by sender
 *     description: Get all messages sent by a specific user. Only the user themselves or admins can access.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Sender ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of messages
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
 *                     $ref: '#/components/schemas/Message'
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
 * /messages/my-messages:
 *   get:
 *     summary: Get my messages
 *     description: Get all messages sent by the authenticated user.
 *     tags: [Messages]
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
 *         description: Maximum number of messages
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
 *                     $ref: '#/components/schemas/Message'
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
 * /messages/search:
 *   get:
 *     summary: Search messages
 *     description: Search messages by content, classroom, or type.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search query for message content
 *       - in: query
 *         name: classroom_id
 *         schema:
 *           type: string
 *         description: Filter by classroom ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [text, system]
 *         description: Filter by message type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of results
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
 *                     $ref: '#/components/schemas/Message'
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
 * /messages/stats:
 *   get:
 *     summary: Get message statistics
 *     description: Get comprehensive statistics about messages. Only admins can access this endpoint.
 *     tags: [Messages]
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
 *                 totalMessages:
 *                   type: integer
 *                   example: 1250
 *                 messagesByType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         enum: [text, system]
 *                       count:
 *                         type: integer
 *                 messagesByClassroom:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       count:
 *                         type: integer
 *                       latestMessage:
 *                         type: string
 *                         format: date-time
 *                 messagesByMonth:
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
 * /messages/mark-read:
 *   post:
 *     summary: Mark messages as read
 *     description: Mark multiple messages as read for the authenticated user.
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
 *               - messageIds
 *             properties:
 *               messageIds:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                 description: Array of message IDs to mark as read
 *             example:
 *               messageIds: ["60d5ecb74b24c72b8c8b4567", "60d5ecb74b24c72b8c8b4568"]
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Messages marked as read"
 *                 count:
 *                   type: integer
 *                   example: 2
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /messages/{messageId}:
 *   get:
 *     summary: Get message by ID
 *     description: Get a specific message by its ID. Only classroom members can access.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Message'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update message by ID
 *     description: Update message content. Only the message sender can update their messages.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 description: New message content
 *             example:
 *               content: "Updated message content"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Message'
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
 *     summary: Delete message by ID
 *     description: Delete a message. Only the message sender or classroom admin can delete messages.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
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
