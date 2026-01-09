const express = require('express');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const enrollmentValidation = require('../../validations/enrollment.validation');
const enrollmentController = require('../../controllers/enrollment.controller');

const router = express.Router();

// Enrollment CRUD operations
router
  .route('/')
  .post(auth, validate(enrollmentValidation.createEnrollment), enrollmentController.createEnrollment)
  .get(auth, validate(enrollmentValidation.getEnrollments), enrollmentController.getEnrollments);

// My enrollments
router.route('/my-enrollments').get(auth, enrollmentController.getMyEnrollments);

// Enrollments by course
router
  .route('/course/:courseId')
  .get(auth, validate(enrollmentValidation.getEnrollmentsByCourse), enrollmentController.getEnrollmentsByCourse);

// Enrollments by student
router
  .route('/student/:studentId')
  .get(auth, validate(enrollmentValidation.getEnrollmentsByStudent), enrollmentController.getEnrollmentsByStudent);

// Enrollment statistics
router.route('/stats').get(auth, requireRole(['admin']), enrollmentController.getEnrollmentStats);

// Individual enrollment operations
router
  .route('/:enrollmentId')
  .get(auth, validate(enrollmentValidation.getEnrollment), enrollmentController.getEnrollment)
  .patch(auth, validate(enrollmentValidation.updateEnrollment), enrollmentController.updateEnrollment)
  .delete(auth, validate(enrollmentValidation.deleteEnrollment), enrollmentController.deleteEnrollment);

// Enrollment progress
router
  .route('/:enrollmentId/progress')
  .get(auth, validate(enrollmentValidation.getEnrollmentProgress), enrollmentController.getEnrollmentProgress);

// Lesson completion
router
  .route('/:enrollmentId/complete-lesson')
  .post(auth, validate(enrollmentValidation.completeLesson), enrollmentController.completeLesson);

// Position updates
router
  .route('/:enrollmentId/position')
  .patch(auth, validate(enrollmentValidation.updateCurrentPosition), enrollmentController.updateCurrentPosition);

// Enrollment completion
router
  .route('/:enrollmentId/complete')
  .patch(auth, validate(enrollmentValidation.completeEnrollment), enrollmentController.completeEnrollment);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Course enrollments and student progress tracking
 */

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Enroll current user into a course
 *     description: Enroll the authenticated user into a published course. User cannot enroll in the same course twice.
 *     tags: [Enrollments]
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
 *                 description: ID of the course to enroll in
 *             example:
 *               course_id: 60d5ecb74b24c72b8c8b4567
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Enrollment'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   get:
 *     summary: List enrollments
 *     description: Users see their own enrollments; admins can filter by user_id and course_id.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID (admin only)
 *       - in: query
 *         name: course_id
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed]
 *         description: Filter by enrollment status
 *       - in: query
 *         name: progress_min
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         description: Filter by minimum progress percentage
 *       - in: query
 *         name: progress_max
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         description: Filter by maximum progress percentage
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
 *         description: Maximum number of enrollments
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
 *                     $ref: '#/components/schemas/Enrollment'
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
 * /enrollments/my-enrollments:
 *   get:
 *     summary: Get my enrollments
 *     description: Get all course enrollments for the authenticated user.
 *     tags: [Enrollments]
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
 *         description: Maximum number of enrollments
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
 *                     $ref: '#/components/schemas/Enrollment'
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
 * /enrollments/course/{courseId}:
 *   get:
 *     summary: Get enrollments by course
 *     description: Get all enrollments for a specific course. Only course instructors and admins can access.
 *     tags: [Enrollments]
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
 *         description: Maximum number of enrollments
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
 *                     $ref: '#/components/schemas/Enrollment'
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
 * /enrollments/student/{studentId}:
 *   get:
 *     summary: Get enrollments by student
 *     description: Get all enrollments for a specific student. Only the student themselves or admins can access.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of enrollments
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
 *                     $ref: '#/components/schemas/Enrollment'
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
 * /enrollments/stats:
 *   get:
 *     summary: Get enrollment statistics
 *     description: Get comprehensive statistics about enrollments. Only admins can access this endpoint.
 *     tags: [Enrollments]
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
 *                 totalEnrollments:
 *                   type: integer
 *                   example: 1500
 *                 enrollmentsByStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         enum: [active, completed]
 *                       count:
 *                         type: integer
 *                 averageProgress:
 *                   type: number
 *                   example: 65.5
 *                 completedEnrollments:
 *                   type: integer
 *                   example: 450
 *                 enrollmentsByMonth:
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
 * /enrollments/{enrollmentId}:
 *   get:
 *     summary: Get enrollment by ID
 *     description: Get detailed enrollment information. Only the enrolled student, course instructor, or admins can access.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Enrollment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update enrollment by ID
 *     description: Update enrollment progress and status. Students can update their own progress; instructors/admins can update status.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed_lessons:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of completed lesson IDs
 *               current_position:
 *                 type: object
 *                 properties:
 *                   module_id:
 *                     type: string
 *                   lesson_id:
 *                     type: string
 *                   timestamp:
 *                     type: integer
 *                     minimum: 0
 *                 description: Current learning position
 *               progress_percent:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Overall progress percentage
 *               status:
 *                 type: string
 *                 enum: [active, completed]
 *                 description: Enrollment status
 *             example:
 *               progress_percent: 75
 *               status: active
 *               current_position:
 *                 module_id: 60d5ecb74b24c72b8c8b4567
 *                 lesson_id: 60d5ecb74b24c72b8c8b4568
 *                 timestamp: 1800
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Enrollment'
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
 *     summary: Delete enrollment by ID
 *     description: Remove enrollment from course. Only the enrolled student, course instructor, or admins can delete.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
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
 * /enrollments/{enrollmentId}/progress:
 *   get:
 *     summary: Get enrollment progress details
 *     description: Get detailed progress information including module-wise completion. Only the enrolled student, course instructor, or admins can access.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enrollment_id:
 *                   type: string
 *                 course_title:
 *                   type: string
 *                 total_modules:
 *                   type: integer
 *                 total_lessons:
 *                   type: integer
 *                 completed_lessons:
 *                   type: integer
 *                 progress_percent:
 *                   type: integer
 *                 current_position:
 *                   type: object
 *                 module_progress:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       module_id:
 *                         type: string
 *                       module_title:
 *                         type: string
 *                       total_lessons:
 *                         type: integer
 *                       completed_lessons:
 *                         type: integer
 *                       progress_percent:
 *                         type: integer
 *                 status:
 *                   type: string
 *                 last_accessed:
 *                   type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /enrollments/{enrollmentId}/complete-lesson:
 *   post:
 *     summary: Complete a lesson
 *     description: Mark a lesson as completed and update progress. Only the enrolled student can complete lessons.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lessonId
 *             properties:
 *               lessonId:
 *                 type: string
 *                 description: ID of the lesson to mark as completed
 *             example:
 *               lessonId: 60d5ecb74b24c72b8c8b4568
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Enrollment'
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
 * /enrollments/{enrollmentId}/position:
 *   patch:
 *     summary: Update current learning position
 *     description: Update the student's current position in the course (current module and lesson). Only the enrolled student can update their position.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - module_id
 *               - lesson_id
 *             properties:
 *               module_id:
 *                 type: string
 *                 description: Current module ID
 *               lesson_id:
 *                 type: string
 *                 description: Current lesson ID
 *               timestamp:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 description: Current timestamp in the lesson (for video lessons)
 *             example:
 *               module_id: 60d5ecb74b24c72b8c8b4567
 *               lesson_id: 60d5ecb74b24c72b8c8b4568
 *               timestamp: 1800
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Enrollment'
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
 * /enrollments/{enrollmentId}/complete:
 *   patch:
 *     summary: Mark enrollment as completed
 *     description: Mark the entire enrollment as completed. Only the enrolled student can complete their enrollment.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Enrollment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
