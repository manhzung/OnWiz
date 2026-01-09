const express = require('express');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const transactionValidation = require('../../validations/transaction.validation');
const transactionController = require('../../controllers/transaction.controller');

const router = express.Router();

// Transaction CRUD operations
router
  .route('/')
  .post(
    auth,
    requireRole(['admin']),
    validate(transactionValidation.createTransaction),
    transactionController.createTransaction
  )
  .get(auth, validate(transactionValidation.getTransactions), transactionController.getTransactions);

// Specific transaction types
router.route('/deposit').post(auth, validate(transactionValidation.createDeposit), transactionController.createDeposit);

router.route('/purchase').post(auth, validate(transactionValidation.createPurchase), transactionController.createPurchase);

router
  .route('/withdrawal')
  .post(auth, validate(transactionValidation.createWithdrawal), transactionController.createWithdrawal);

// Transactions by user
router
  .route('/user/:userId')
  .get(auth, validate(transactionValidation.getTransactionsByUser), transactionController.getTransactionsByUser);

// My transactions
router.route('/my-transactions').get(auth, transactionController.getMyTransactions);

// Wallet balance
router.route('/balance').get(auth, transactionController.getWalletBalance);

// Transaction statistics
router.route('/stats').get(auth, requireRole(['admin']), transactionController.getTransactionStats);

// Transaction summary
router
  .route('/summary')
  .get(auth, validate(transactionValidation.getTransactionSummary), transactionController.getTransactionSummary);

// Individual transaction operations
router
  .route('/:transactionId')
  .get(auth, validate(transactionValidation.getTransaction), transactionController.getTransaction)
  .delete(
    auth,
    requireRole(['admin']),
    validate(transactionValidation.deleteTransaction),
    transactionController.deleteTransaction
  );

// Refund processing
router
  .route('/:transactionId/refund')
  .post(auth, requireRole(['admin']), validate(transactionValidation.processRefund), transactionController.processRefund);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Wallet transactions and financial operations
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a transaction (admin)
 *     description: Create a manual transaction. Only admins can create transactions directly.
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
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID of the user for this transaction
 *               type:
 *                 type: string
 *                 enum: [deposit, purchase, refund, withdrawal]
 *                 description: Type of transaction
 *               amount:
 *                 type: number
 *                 description: Transaction amount (positive for credits, negative for debits)
 *               balance_after:
 *                 type: number
 *                 description: Wallet balance after transaction
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed]
 *                 default: completed
 *               date:
 *                 type: string
 *                 description: Transaction date (YYYY-MM-DD)
 *               courseId:
 *                 type: string
 *                 description: Course ID if related to course purchase
 *               reference_id:
 *                 type: string
 *                 description: Reference to related entity (order, etc.)
 *               description:
 *                 type: string
 *                 description: Transaction description
 *               update_wallet:
 *                 type: boolean
 *                 default: true
 *                 description: Whether to update user's wallet balance
 *             example:
 *               user_id: 60d5ecb74b24c72b8c8b4567
 *               type: deposit
 *               amount: 100.00
 *               balance_after: 150.00
 *               description: Manual deposit
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: List transactions
 *     description: Users see their own transactions; admins can filter by user_id and other criteria.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID (admin only)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [deposit, purchase, refund, withdrawal]
 *         description: Filter by transaction type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed]
 *         description: Filter by transaction status
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
 *         description: Maximum number of transactions
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
 *                     $ref: '#/components/schemas/Transaction'
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
 * /transactions/deposit:
 *   post:
 *     summary: Create a deposit transaction
 *     description: Add money to user's wallet.
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
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Amount to deposit
 *               description:
 *                 type: string
 *                 description: Optional description
 *             example:
 *               amount: 50.00
 *               description: Monthly allowance
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /transactions/purchase:
 *   post:
 *     summary: Create a purchase transaction
 *     description: Purchase a course using wallet balance.
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
 *               - course_id
 *             properties:
 *               course_id:
 *                 type: string
 *                 description: ID of the course to purchase
 *             example:
 *               course_id: 60d5ecb74b24c72b8c8b4567
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /transactions/withdrawal:
 *   post:
 *     summary: Create a withdrawal transaction
 *     description: Withdraw money from user's wallet.
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
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Amount to withdraw
 *               description:
 *                 type: string
 *                 description: Optional description
 *             example:
 *               amount: 25.00
 *               description: Cash withdrawal
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /transactions/user/{userId}:
 *   get:
 *     summary: Get transactions by user
 *     description: Get all transactions for a specific user. Only the user themselves or admins can access.
 *     tags: [Transactions]
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
 *         description: Maximum number of transactions
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
 *                     $ref: '#/components/schemas/Transaction'
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
 * /transactions/my-transactions:
 *   get:
 *     summary: Get my transactions
 *     description: Get all transactions for the authenticated user.
 *     tags: [Transactions]
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
 *         description: Maximum number of transactions
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
 *                     $ref: '#/components/schemas/Transaction'
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
 * /transactions/balance:
 *   get:
 *     summary: Get wallet balance
 *     description: Get the current wallet balance for the authenticated user.
 *     tags: [Transactions]
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
 *                 balance:
 *                   type: number
 *                   example: 150.50
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /transactions/stats:
 *   get:
 *     summary: Get transaction statistics
 *     description: Get comprehensive statistics about transactions. Only admins can access this endpoint.
 *     tags: [Transactions]
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
 *                 totalTransactions:
 *                   type: integer
 *                   example: 1250
 *                 transactionsByType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         enum: [deposit, purchase, refund, withdrawal]
 *                       count:
 *                         type: integer
 *                       totalAmount:
 *                         type: number
 *                 transactionsByStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         enum: [pending, completed, failed]
 *                       count:
 *                         type: integer
 *                 totalVolume:
 *                   type: number
 *                   example: 50000.00
 *                   description: Total transaction volume
 *                 transactionsByMonth:
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
 * /transactions/summary:
 *   get:
 *     summary: Get transaction summary
 *     description: Get a summary of transactions for the authenticated user or specified user (admin only).
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: User ID for summary (admin only)
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
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 current_balance:
 *                   type: number
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalTransactions:
 *                       type: integer
 *                     deposits:
 *                       type: number
 *                     purchases:
 *                       type: number
 *                     withdrawals:
 *                       type: number
 *                     refunds:
 *                       type: number
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /transactions/{transactionId}:
 *   get:
 *     summary: Get transaction by ID
 *     description: Get detailed transaction information. Only the transaction owner or admins can access.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete transaction by ID (admin only)
 *     description: Delete a transaction and reverse its wallet impact. Only admins can delete transactions.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
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
 * /transactions/{transactionId}/refund:
 *   post:
 *     summary: Process refund
 *     description: Process a refund for a purchase transaction. Only admins can process refunds.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Original purchase transaction ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Refund amount (defaults to full purchase amount)
 *               description:
 *                 type: string
 *                 description: Refund reason/description
 *             example:
 *               amount: 49.99
 *               description: Course quality issues
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Transaction'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
