const express = require('express');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const questionValidation = require('../../validations/question.validation');
const questionController = require('../../controllers/question.controller');

const router = express.Router();

// Question CRUD operations
router
  .route('/')
  .post(auth, validate(questionValidation.createQuestion), questionController.createQuestion)
  .get(auth, validate(questionValidation.getQuestions), questionController.getQuestions);

// Specific question type creation
router
  .route('/single-choice')
  .post(auth, validate(questionValidation.createSingleChoiceQuestion), questionController.createSingleChoiceQuestion);

router
  .route('/multiple-choice')
  .post(auth, validate(questionValidation.createMultipleChoiceQuestion), questionController.createMultipleChoiceQuestion);

router
  .route('/fill-in')
  .post(auth, validate(questionValidation.createFillInQuestion), questionController.createFillInQuestion);

// Questions by filters
router
  .route('/difficulty/:difficulty')
  .get(auth, validate(questionValidation.getQuestionsByDifficulty), questionController.getQuestionsByDifficulty);

router
  .route('/type/:type')
  .get(auth, validate(questionValidation.getQuestionsByType), questionController.getQuestionsByType);

router
  .route('/course/:courseId')
  .get(auth, validate(questionValidation.getQuestionsByCourse), questionController.getQuestionsByCourse);

// Search questions
router.route('/search').get(auth, validate(questionValidation.searchQuestions), questionController.searchQuestions);

// Bulk operations
router.route('/bulk').post(auth, validate(questionValidation.bulkCreateQuestions), questionController.bulkCreateQuestions);

// Question statistics
router.route('/stats').get(auth, requireRole(['admin']), questionController.getQuestionStats);

// Individual question operations
router
  .route('/:questionId')
  .get(auth, validate(questionValidation.getQuestion), questionController.getQuestion)
  .patch(auth, validate(questionValidation.updateQuestion), questionController.updateQuestion)
  .delete(auth, validate(questionValidation.deleteQuestion), questionController.deleteQuestion);

// Answer validation
router
  .route('/:questionId/validate')
  .post(auth, validate(questionValidation.validateAnswer), questionController.validateAnswer);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management and quiz content
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a question
 *     description: Create a new question with its content and answer options.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - content
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [single_choice, multiple_choice, fill_in]
 *                 description: Type of question
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 default: easy
 *               content:
 *                 type: string
 *                 description: Question text
 *               image_url:
 *                 type: string
 *                 description: Optional image URL for the question
 *               options:
 *                 type: array
 *                 description: Answer options for single/multiple choice questions
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     text:
 *                       type: string
 *                     is_correct:
 *                       type: boolean
 *                     image_url:
 *                       type: string
 *               correct_answers:
 *                 type: array
 *                 description: Correct answers for fill-in questions
 *                 items:
 *                   type: string
 *               explanation:
 *                 type: string
 *                 description: Explanation for the correct answer
 *             example:
 *               type: single_choice
 *               difficulty: easy
 *               content: What is 2 + 2?
 *               options:
 *                 - id: 1
 *                   text: "3"
 *                   is_correct: false
 *                 - id: 2
 *                   text: "4"
 *                   is_correct: true
 *                 - id: 3
 *                   text: "5"
 *                   is_correct: false
 *               explanation: Basic addition
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Question'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   get:
 *     summary: Get all questions
 *     description: Retrieve questions with optional filtering.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [single_choice, multiple_choice, fill_in]
 *         description: Filter by question type
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Search in question content
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
 *         description: Maximum number of questions
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
 *                     $ref: '#/components/schemas/Question'
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
 * /questions/single-choice:
 *   post:
 *     summary: Create a single choice question
 *     description: Create a single choice question with exactly one correct answer.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - options
 *             properties:
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 default: easy
 *               content:
 *                 type: string
 *               image_url:
 *                 type: string
 *               options:
 *                 type: array
 *                 minItems: 2
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     text:
 *                       type: string
 *                     is_correct:
 *                       type: boolean
 *                     image_url:
 *                       type: string
 *               explanation:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Question'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /questions/multiple-choice:
 *   post:
 *     summary: Create a multiple choice question
 *     description: Create a multiple choice question with one or more correct answers.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - options
 *             properties:
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 default: easy
 *               content:
 *                 type: string
 *               image_url:
 *                 type: string
 *               options:
 *                 type: array
 *                 minItems: 2
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     text:
 *                       type: string
 *                     is_correct:
 *                       type: boolean
 *                     image_url:
 *                       type: string
 *               explanation:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Question'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /questions/fill-in:
 *   post:
 *     summary: Create a fill-in question
 *     description: Create a fill-in-the-blank question with correct answers.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - correct_answers
 *             properties:
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 default: easy
 *               content:
 *                 type: string
 *               image_url:
 *                 type: string
 *               correct_answers:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *               explanation:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Question'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /questions/difficulty/{difficulty}:
 *   get:
 *     summary: Get questions by difficulty
 *     description: Retrieve all questions of a specific difficulty level.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: difficulty
 *         required: true
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Difficulty level
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of questions
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
 *                     $ref: '#/components/schemas/Question'
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
 * /questions/type/{type}:
 *   get:
 *     summary: Get questions by type
 *     description: Retrieve all questions of a specific type.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [single_choice, multiple_choice, fill_in]
 *         description: Question type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of questions
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
 *                     $ref: '#/components/schemas/Question'
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
 * /questions/course/{courseId}:
 *   get:
 *     summary: Get questions by course
 *     description: Retrieve questions used in quizzes within a specific course.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of questions
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
 *                     $ref: '#/components/schemas/Question'
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
 * /questions/search:
 *   get:
 *     summary: Search questions
 *     description: Search questions by content, type, or difficulty.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for question content
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [single_choice, multiple_choice, fill_in]
 *         description: Filter by question type
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Filter by difficulty level
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
 *                     $ref: '#/components/schemas/Question'
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
 * /questions/bulk:
 *   post:
 *     summary: Bulk create questions
 *     description: Create multiple questions at once.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questions
 *             properties:
 *               questions:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [single_choice, multiple_choice, fill_in]
 *                     difficulty:
 *                       type: string
 *                       enum: [easy, medium, hard]
 *                     content:
 *                       type: string
 *                     image_url:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                     correct_answers:
 *                       type: array
 *                       items:
 *                         type: string
 *                     explanation:
 *                       type: string
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /questions/stats:
 *   get:
 *     summary: Get question statistics
 *     description: Get comprehensive statistics about questions. Only admins can access this endpoint.
 *     tags: [Questions]
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
 *                 totalQuestions:
 *                   type: integer
 *                   example: 150
 *                 questionsByType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         enum: [single_choice, multiple_choice, fill_in]
 *                       count:
 *                         type: integer
 *                 questionsByDifficulty:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         enum: [easy, medium, hard]
 *                       count:
 *                         type: integer
 *                 questionsInQuizzes:
 *                   type: integer
 *                   example: 120
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /questions/{questionId}:
 *   get:
 *     summary: Get question by ID
 *     description: Retrieve a question with its detailed content and answer options.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question:
 *                   $ref: '#/components/schemas/Question'
 *                 detail:
 *                   type: object
 *                   description: Type-specific question details
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update question by ID
 *     description: Update question content, difficulty, or answer options.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
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
 *               resource:
 *                 type: object
 *                 description: Type-specific updates (options, correct_answers, explanation)
 *             example:
 *               content: What is 3 + 3?
 *               resource:
 *                 explanation: Basic arithmetic
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Question'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete question by ID
 *     description: Delete a question and remove it from all quizzes that use it.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /questions/{questionId}/validate:
 *   post:
 *     summary: Validate question answer
 *     description: Check if a user's answer to a question is correct.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answer
 *             properties:
 *               answer:
 *                 description: User's answer (string for single choice/fill-in, array for multiple choice)
 *             example:
 *               answer: 2
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questionId:
 *                   type: string
 *                 isCorrect:
 *                   type: boolean
 *                 correctAnswer:
 *                   description: The correct answer(s)
 *                 explanation:
 *                   type: string
 *                 userAnswer:
 *                   description: The user's submitted answer
 *             example:
 *               questionId: 60d5ecb74b24c72b8c8b4567
 *               isCorrect: true
 *               correctAnswer: 2
 *               explanation: Basic math
 *               userAnswer: 2
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
