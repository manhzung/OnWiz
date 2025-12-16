const express = require('express');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const transactionValidation = require('../../validations/transaction.validation');
const transactionController = require('../../controllers/transaction.controller');

const router = express.Router();

router
  .route('/')
  // tạo transaction: thường nên chỉ cho admin/hệ thống
  .post(requireRole(['admin']), validate(transactionValidation.createTransaction), transactionController.createTransaction)
  .get(requireRole(), validate(transactionValidation.getTransactions), transactionController.getTransactions);

router
  .route('/:transactionId')
  .get(requireRole(), validate(transactionValidation.getTransaction), transactionController.getTransaction)
  .delete(requireRole(['admin']), validate(transactionValidation.deleteTransaction), transactionController.deleteTransaction);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Wallet transactions (audit log)
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a transaction (admin)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - type
 *               - amount
 *               - balance_after
 *             properties:
 *               user_id:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [deposit, payment, refund]
 *               amount:
 *                 type: number
 *               balance_after:
 *                 type: number
 *               reference_id:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Created
 *   get:
 *     summary: List transactions
 *     description: Normal users see their own transactions; admins can filter by user_id.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [deposit, payment, refund]
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
 * /transactions/{transactionId}:
 *   get:
 *     summary: Get a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
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
 *     summary: Delete a transaction (admin)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

