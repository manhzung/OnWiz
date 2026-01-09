const express = require('express');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

// Order CRUD operations
router
  .route('/')
  .post(auth, validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth, validate(orderValidation.getOrders), orderController.getOrders);

// Orders by user
router.route('/user/:userId').get(auth, validate(orderValidation.getOrdersByUser), orderController.getOrdersByUser);

// My orders
router.route('/my-orders').get(auth, orderController.getMyOrders);

// Order by code
router.route('/code/:code').get(auth, validate(orderValidation.getOrderByCode), orderController.getOrderByCode);

// Order statistics
router.route('/stats').get(auth, requireRole(['admin']), orderController.getOrderStats);

// Individual order operations
router
  .route('/:orderId')
  .get(auth, validate(orderValidation.getOrder), orderController.getOrder)
  .patch(auth, requireRole(['admin']), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(auth, requireRole(['admin']), validate(orderValidation.deleteOrder), orderController.deleteOrder);

// Payment processing
router
  .route('/:orderId/process-payment')
  .post(auth, requireRole(['admin']), validate(orderValidation.processPayment), orderController.processPayment);

// Order cancellation
router.route('/:orderId/cancel').patch(auth, validate(orderValidation.cancelOrder), orderController.cancelOrder);

// Refund processing
router
  .route('/:orderId/refund')
  .post(auth, requireRole(['admin']), validate(orderValidation.refundOrder), orderController.refundOrder);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and payment processing
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order
 *     description: Create a new order for course purchases. Total amount is calculated server-side for security.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - payment_method
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - course_id
 *                   properties:
 *                     course_id:
 *                       type: string
 *                       description: ID of the course to purchase
 *               payment_method:
 *                 type: string
 *                 enum: [wallet, card, bank_transfer, other]
 *                 description: Payment method for the order
 *             example:
 *               items:
 *                 - course_id: 60d5ecb74b24c72b8c8b4567
 *               payment_method: wallet
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Order'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   get:
 *     summary: List orders
 *     description: Users see their own orders; admins can filter by user_id and other criteria.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID (admin only)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: payment_method
 *         schema:
 *           type: string
 *           enum: [wallet, card, bank_transfer, other]
 *         description: Filter by payment method
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Search by order code
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
 *         name: amount_min
 *         schema:
 *           type: number
 *         description: Filter by minimum amount
 *       - in: query
 *         name: amount_max
 *         schema:
 *           type: number
 *         description: Filter by maximum amount
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
 *         default: 10
 *         description: Maximum number of orders
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
 *                     $ref: '#/components/schemas/Order'
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
 * /orders/my-orders:
 *   get:
 *     summary: Get my orders
 *     description: Get all orders for the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query (ex. created_at:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of orders
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
 *                     $ref: '#/components/schemas/Order'
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
 * /orders/user/{userId}:
 *   get:
 *     summary: Get orders by user
 *     description: Get all orders for a specific user. Only the user themselves or admins can access.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of orders
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
 *                     $ref: '#/components/schemas/Order'
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
 * /orders/code/{code}:
 *   get:
 *     summary: Get order by code
 *     description: Get order details by order code. Only the order owner or admins can access.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Order code
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Order'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /orders/stats:
 *   get:
 *     summary: Get order statistics
 *     description: Get comprehensive statistics about orders. Only admins can access this endpoint.
 *     tags: [Orders]
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
 *                 totalOrders:
 *                   type: integer
 *                   example: 1250
 *                 ordersByStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         enum: [pending, completed, failed, cancelled]
 *                       count:
 *                         type: integer
 *                       totalAmount:
 *                         type: number
 *                 ordersByPaymentMethod:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         enum: [wallet, card, bank_transfer, other]
 *                       count:
 *                         type: integer
 *                       totalAmount:
 *                         type: number
 *                 totalRevenue:
 *                   type: number
 *                   example: 50000.00
 *                 ordersByMonth:
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
 *                       totalAmount:
 *                         type: number
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     description: Get detailed order information. Only the order owner or admins can access.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Order'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update order by ID (admin only)
 *     description: Update order status or payment method. Only admins can update orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed, cancelled]
 *                 description: Order status
 *               payment_method:
 *                 type: string
 *                 enum: [wallet, card, bank_transfer, other]
 *                 description: Payment method
 *             example:
 *               status: completed
 *               payment_method: wallet
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Order'
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
 *     summary: Delete order by ID (admin only)
 *     description: Delete an order. Only admins can delete orders, and only pending orders can be deleted.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
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
 * /orders/{orderId}/process-payment:
 *   post:
 *     summary: Process order payment (admin only)
 *     description: Process payment for an order and create enrollments. Only admins can process payments.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Whether the payment was successful
 *               transaction_id:
 *                 type: string
 *                 description: External transaction ID
 *               payment_details:
 *                 type: object
 *                 description: Additional payment details
 *             example:
 *               success: true
 *               transaction_id: "txn_123456789"
 *               payment_details:
 *                 gateway: "stripe"
 *                 payment_intent_id: "pi_123456789"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Order'
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
 * /orders/{orderId}/cancel:
 *   patch:
 *     summary: Cancel order
 *     description: Cancel a pending order. Only the order owner or admins can cancel orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Order'
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
 * /orders/{orderId}/refund:
 *   post:
 *     summary: Refund order (admin only)
 *     description: Process a refund for a completed order. Only admins can process refunds.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Refund amount (defaults to full order amount)
 *               description:
 *                 type: string
 *                 description: Reason for refund
 *               remove_enrollments:
 *                 type: boolean
 *                 default: false
 *                 description: Whether to remove course enrollments
 *             example:
 *               amount: 49.99
 *               description: "Customer requested refund due to technical issues"
 *               remove_enrollments: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 refund_transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *                 refund_amount:
 *                   type: number
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
