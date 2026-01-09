const express = require('express');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const lessonValidation = require('../../validations/lesson.validation');
const lessonController = require('../../controllers/lesson.controller');

const router = express.Router();

// Lesson CRUD operations
router
  .route('/')
  .post(auth, validate(lessonValidation.createLesson), lessonController.createLesson)
  .get(auth, validate(lessonValidation.getLessons), lessonController.getLessons);

// Specific lesson type creation
router.route('/video').post(auth, validate(lessonValidation.createVideoLesson), lessonController.createVideoLesson);

router.route('/theory').post(auth, validate(lessonValidation.createTheoryLesson), lessonController.createTheoryLesson);

router.route('/quiz').post(auth, validate(lessonValidation.createQuizLesson), lessonController.createQuizLesson);

// Lessons by relationships
router
  .route('/module/:moduleId')
  .get(auth, validate(lessonValidation.getLessonsByModule), lessonController.getLessonsByModule);

router
  .route('/course/:courseId')
  .get(auth, validate(lessonValidation.getLessonsByCourse), lessonController.getLessonsByCourse);

// Lesson statistics
router.route('/stats').get(auth, requireRole(['admin']), lessonController.getLessonStats);

// Individual lesson operations
router
  .route('/:lessonId')
  .get(auth, validate(lessonValidation.getLesson), lessonController.getLesson)
  .patch(auth, validate(lessonValidation.updateLesson), lessonController.updateLesson)
  .delete(auth, validate(lessonValidation.deleteLesson), lessonController.deleteLesson);

// Lesson content for students
router.route('/:lessonId/content').get(auth, validate(lessonValidation.getLessonContent), lessonController.getLessonContent);

// Lesson preview management
router
  .route('/:lessonId/preview')
  .patch(auth, validate(lessonValidation.updateLessonPreview), lessonController.updateLessonPreview);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Lesson management and content delivery
 */

/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Create a lesson
 *     description: Create a new lesson with its content. Only course instructors can create lessons.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - module_id
 *               - title
 *               - slug
 *               - type
 *             properties:
 *               module_id:
 *                 type: string
 *                 description: ID of the module this lesson belongs to
 *               title:
 *                 type: string
 *                 description: Lesson title
 *               slug:
 *                 type: string
 *                 description: URL-friendly identifier
 *               type:
 *                 type: string
 *                 enum: [video, theory, quiz]
 *                 description: Type of lesson content
 *               is_preview:
 *                 type: boolean
 *                 default: false
 *                 description: Whether this lesson is available for preview
 *               provider:
 *                 type: string
 *                 enum: [youtube, vimeo]
 *                 description: Video provider (required for video lessons)
 *               url:
 *                 type: string
 *                 description: Video URL (required for video lessons)
 *               duration:
 *                 type: integer
 *                 description: Video duration in seconds (required for video lessons)
 *               transcript:
 *                 type: string
 *                 description: Video transcript (optional for video lessons)
 *               content_html:
 *                 type: string
 *                 description: HTML content (required for theory lessons)
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: File attachments (optional for theory lessons)
 *               reading_time_minutes:
 *                 type: integer
 *                 description: Estimated reading time (optional for theory lessons)
 *               settings:
 *                 type: object
 *                 properties:
 *                   time_limit:
 *                     type: integer
 *                     description: Quiz time limit in minutes
 *                   pass_score:
 *                     type: number
 *                     description: Minimum score to pass
 *                   shuffle_questions:
 *                     type: boolean
 *                     description: Whether to shuffle questions
 *                 description: Quiz settings (optional for quiz lessons)
 *               question_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs of questions in the quiz (optional for quiz lessons)
 *             example:
 *               module_id: 60d5ecb74b24c72b8c8b4567
 *               title: Introduction to Programming
 *               slug: introduction-to-programming
 *               type: video
 *               is_preview: true
 *               provider: youtube
 *               url: https://youtube.com/watch?v=example
 *               duration: 1800
 *               transcript: "Welcome to programming..."
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lesson'
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
 *     summary: Get all lessons
 *     description: Retrieve lessons with optional filtering. Access depends on user role.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: module_id
 *         schema:
 *           type: string
 *         description: Filter by module ID
 *       - in: query
 *         name: course_id
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [video, theory, quiz]
 *         description: Filter by lesson type
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by lesson title
 *       - in: query
 *         name: is_preview
 *         schema:
 *           type: boolean
 *         description: Filter by preview status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. created_at:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of lessons
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
 *                     $ref: '#/components/schemas/Lesson'
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
 * /lessons/video:
 *   post:
 *     summary: Create a video lesson
 *     description: Create a new video lesson. Only course instructors can create lessons.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - module_id
 *               - title
 *               - slug
 *               - provider
 *               - url
 *               - duration
 *             properties:
 *               module_id:
 *                 type: string
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               is_preview:
 *                 type: boolean
 *                 default: false
 *               provider:
 *                 type: string
 *                 enum: [youtube, vimeo]
 *               url:
 *                 type: string
 *               duration:
 *                 type: integer
 *                 minimum: 0
 *               transcript:
 *                 type: string
 *             example:
 *               module_id: 60d5ecb74b24c72b8c8b4567
 *               title: Introduction Video
 *               slug: introduction-video
 *               is_preview: true
 *               provider: youtube
 *               url: https://youtube.com/watch?v=example
 *               duration: 1800
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lesson'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /lessons/theory:
 *   post:
 *     summary: Create a theory lesson
 *     description: Create a new theory/text lesson. Only course instructors can create lessons.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - module_id
 *               - title
 *               - slug
 *               - content_html
 *             properties:
 *               module_id:
 *                 type: string
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               is_preview:
 *                 type: boolean
 *                 default: false
 *               content_html:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *               reading_time_minutes:
 *                 type: integer
 *                 minimum: 0
 *             example:
 *               module_id: 60d5ecb74b24c72b8c8b4567
 *               title: Programming Basics
 *               slug: programming-basics
 *               content_html: "<h1>Programming Basics</h1><p>This is the content...</p>"
 *               reading_time_minutes: 15
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lesson'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /lessons/quiz:
 *   post:
 *     summary: Create a quiz lesson
 *     description: Create a new quiz lesson. Only course instructors can create lessons.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - module_id
 *               - title
 *               - slug
 *             properties:
 *               module_id:
 *                 type: string
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               is_preview:
 *                 type: boolean
 *                 default: false
 *               settings:
 *                 type: object
 *                 properties:
 *                   time_limit:
 *                     type: integer
 *                   pass_score:
 *                     type: number
 *                   shuffle_questions:
 *                     type: boolean
 *               question_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               module_id: 60d5ecb74b24c72b8c8b4567
 *               title: Basic Quiz
 *               slug: basic-quiz
 *               settings:
 *                 time_limit: 30
 *                 pass_score: 70
 *                 shuffle_questions: true
 *               question_ids: ["60d5ecb74b24c72b8c8b4568"]
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lesson'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /lessons/module/{moduleId}:
 *   get:
 *     summary: Get lessons by module
 *     description: Retrieve all lessons in a specific module.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of lessons
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
 *                     $ref: '#/components/schemas/Lesson'
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
 * /lessons/course/{courseId}:
 *   get:
 *     summary: Get lessons by course
 *     description: Retrieve all lessons in a specific course.
 *     tags: [Lessons]
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
 *         description: Maximum number of lessons
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
 *                     $ref: '#/components/schemas/Lesson'
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
 * /lessons/stats:
 *   get:
 *     summary: Get lesson statistics
 *     description: Get comprehensive statistics about lessons. Only admins can access this endpoint.
 *     tags: [Lessons]
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
 *                 totalLessons:
 *                   type: integer
 *                   example: 150
 *                 lessonsByType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         enum: [video, theory, quiz]
 *                       count:
 *                         type: integer
 *                 previewLessons:
 *                   type: integer
 *                   example: 25
 *                 totalVideoDuration:
 *                   type: integer
 *                   example: 54000
 *                   description: Total video duration in seconds
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /lessons/{lessonId}:
 *   get:
 *     summary: Get lesson by ID
 *     description: Retrieve a lesson by its ID. Access depends on enrollment and preview status.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lesson'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update lesson by ID
 *     description: Update lesson information. Only the course instructor can update lessons.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Lesson title
 *               slug:
 *                 type: string
 *                 description: URL-friendly identifier
 *               is_preview:
 *                 type: boolean
 *                 description: Preview availability
 *               resource:
 *                 type: object
 *                 description: Resource-specific updates (video URL, theory content, quiz settings)
 *             example:
 *               title: Updated Lesson Title
 *               is_preview: false
 *               resource:
 *                 duration: 2000
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lesson'
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
 *     summary: Delete lesson by ID
 *     description: Delete a lesson and its associated resource. Only the course instructor can delete lessons.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
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
 * /lessons/{lessonId}/content:
 *   get:
 *     summary: Get lesson content for student
 *     description: Get the full lesson content including resource data for enrolled students or preview lessons.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lesson:
 *                   $ref: '#/components/schemas/Lesson'
 *                 resource:
 *                   type: object
 *                   description: Lesson resource content (video, theory, or quiz data)
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /lessons/{lessonId}/preview:
 *   patch:
 *     summary: Update lesson preview status
 *     description: Toggle whether a lesson is available for preview. Only course instructors can modify this.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_preview
 *             properties:
 *               is_preview:
 *                 type: boolean
 *                 description: Whether the lesson should be available for preview
 *             example:
 *               is_preview: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lesson'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
