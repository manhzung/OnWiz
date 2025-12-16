const express = require('express');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const courseValidation = require('../../validations/course.validation');
const courseController = require('../../controllers/course.controller');

const router = express.Router();

// Tạo khoá học mới (bất kỳ user đã đăng nhập nào cũng có thể tạo, instructor_id = user hiện tại)
router
  .route('/')
  .post(requireRole(), validate(courseValidation.createCourse), courseController.createCourse)
  .get(requireRole(), validate(courseValidation.getCourses), courseController.getCourses);

// Lấy thông tin chi tiết 1 course (kèm danh sách module)
router
  .route('/:courseId')
  .get(requireRole(), validate(courseValidation.getCourse), courseController.getCourse)
  .patch(requireRole(), validate(courseValidation.updateCourse), courseController.updateCourse)
  .delete(requireRole(['admin']), validate(courseValidation.deleteCourse), courseController.deleteCourse);

// Thêm module vào course + lấy danh sách module theo course
router
  .route('/:courseId/modules')
  .post(requireRole(), validate(courseValidation.createModule), courseController.createModule)
  .get(requireRole(), validate(courseValidation.getModules), courseController.getModulesByCourse);

// Thêm lesson vào module + lấy danh sách lesson theo module
router
  .route('/modules/:moduleId/lessons')
  .post(requireRole(), validate(courseValidation.createLesson), courseController.createLesson)
  .get(requireRole(), validate(courseValidation.getLessonsByModule), courseController.getLessonsByModule);

// Lấy chi tiết 1 lesson (kèm resource: video/theory/quiz & questions)
router.get(
  '/lessons/:lessonId',
  requireRole(),
  validate(courseValidation.getLessonDetail),
  courseController.getLessonDetail
);

// Thêm question cho quiz (quizId là _id của LessonQuiz) + lấy danh sách question theo quiz
router
  .route('/quizzes/:quizId/questions')
  .post(requireRole(), validate(courseValidation.createQuestionForQuiz), courseController.createQuestionForQuiz)
  .get(requireRole(), validate(courseValidation.getQuizQuestions), courseController.getQuizQuestions);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course & content management
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a course
 *     description: Any logged-in user can create a course. The current user will be set as instructor.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               thumbnail_url:
 *                 type: string
 *               pricing:
 *                 type: object
 *                 properties:
 *                   price:
 *                     type: number
 *                   sale_price:
 *                     type: number
 *                   currency:
 *                     type: string
 *                   is_free:
 *                     type: boolean
 *     responses:
 *       "201":
 *         description: Created
 *   get:
 *     summary: List courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: instructor_id
 *         schema:
 *           type: string
 *         description: Filter by instructor id (admin only)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. created_at:desc)
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
 * /courses/{courseId}:
 *   get:
 *     summary: Get course detail
 *     description: Get a course along with its modules.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course id
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
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
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               thumbnail_url:
 *                 type: string
 *               pricing:
 *                 type: object
 *               is_published:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a course
 *     description: Delete course with all its modules and lessons.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /courses/{courseId}/modules:
 *   post:
 *     summary: Create module for a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Created
 *   get:
 *     summary: Get modules of a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /courses/modules/{moduleId}/lessons:
 *   post:
 *     summary: Create lesson in a module
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_id
 *               - title
 *               - slug
 *               - type
 *             properties:
 *               course_id:
 *                 type: string
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [video, theory, quiz]
 *     responses:
 *       "201":
 *         description: Created
 *   get:
 *     summary: Get lessons of a module
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /courses/lessons/{lessonId}:
 *   get:
 *     summary: Get lesson detail
 *     description: Get lesson with its resource (video/theory/quiz).
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /courses/quizzes/{quizId}/questions:
 *   post:
 *     summary: Create question for a quiz
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
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
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               content:
 *                 type: string
 *               image_url:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Created
 *   get:
 *     summary: Get questions of a quiz
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 */

