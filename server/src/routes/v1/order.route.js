const express = require('express');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router
  .route('/')
  .post(requireRole(), validate(orderValidation.createOrder), orderController.createOrder)
  .get(requireRole(), validate(orderValidation.getOrders), orderController.getOrders);

router
  .route('/:orderId')
  .get(requireRole(), validate(orderValidation.getOrder), orderController.getOrder)
  // chỉ admin nên được sửa hoặc xoá đơn; bạn có thể siết thêm requireRole(['admin']) nếu muốn
  .patch(requireRole(['admin']), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(requireRole(['admin']), validate(orderValidation.deleteOrder), orderController.deleteOrder);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order
 *     description: Create an order for the current user.
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
 *               - code
 *               - items
 *               - total_amount
 *               - payment_method
 *             properties:
 *               code:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     course_id:
 *                       type: string
 *                     price:
 *                       type: number
 *               total_amount:
 *                 type: number
 *               payment_method:
 *                 type: string
 *                 enum: [wallet, card, bank_transfer, other]
 *     responses:
 *       "201":
 *         description: Created
 *   get:
 *     summary: List orders
 *     description: Normal users see their own orders, admins can filter by user_id.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user id (admin only)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed, cancelled]
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
 * /orders/{orderId}:
 *   get:
 *     summary: Get an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
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
 *     summary: Update an order (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
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
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed, cancelled]
 *               payment_method:
 *                 type: string
 *                 enum: [wallet, card, bank_transfer, other]
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete an order (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

