const express = require('express');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const courseValidation = require('../../validations/course.validation');
const courseController = require('../../controllers/course.controller');

const router = express.Router();

// Course CRUD operations
router
  .route('/')
  .post(auth, validate(courseValidation.createCourse), courseController.createCourse)
  .get(validate(courseValidation.getCourses), courseController.getCourses);

// Course by slug
router.route('/slug/:slug').get(validate(courseValidation.getCourseBySlug), courseController.getCourseBySlug);

// Course by instructor
router
  .route('/instructor/:instructorId')
  .get(validate(courseValidation.getCoursesByInstructor), courseController.getCoursesByInstructor);

// Course by category
router
  .route('/category/:categoryId')
  .get(validate(courseValidation.getCoursesByCategory), courseController.getCoursesByCategory);

// Featured courses
router.route('/featured').get(courseController.getFeaturedCourses);

// Published courses
router.route('/published').get(courseController.getPublishedCourses);

// Search courses
router.route('/search').get(validate(courseValidation.searchCourses), courseController.searchCourses);

// Course statistics
router.route('/stats').get(auth, requireRole(['admin']), courseController.getCourseStats);

// My courses (for instructors)
router.route('/my-courses').get(auth, courseController.getMyCourses);

// Individual course operations
router
  .route('/:courseId')
  .get(validate(courseValidation.getCourse), courseController.getCourse)
  .patch(auth, validate(courseValidation.updateCourse), courseController.updateCourse)
  .delete(auth, validate(courseValidation.deleteCourse), courseController.deleteCourse);

// Course publish/unpublish
router.route('/:courseId/publish').patch(auth, validate(courseValidation.publishCourse), courseController.publishCourse);

router
  .route('/:courseId/unpublish')
  .patch(auth, validate(courseValidation.unpublishCourse), courseController.unpublishCourse);

// Course rating
router
  .route('/:courseId/rating')
  .patch(auth, validate(courseValidation.updateCourseRating), courseController.updateCourseRating);

// Course modules and overview (for enrolled students)
router.route('/:courseId/modules').get(auth, validate(courseValidation.getCourseModules), courseController.getCourseModules);

router
  .route('/:courseId/overview')
  .get(auth, validate(courseValidation.getCourseOverview), courseController.getCourseOverview);

// Legacy routes for backward compatibility (modules, lessons, quizzes)
router
  .route('/:courseId/modules')
  .post(auth, validate(courseValidation.createModule), courseController.createModule)
  .get(auth, validate(courseValidation.getModules), courseController.getModulesByCourse);

router
  .route('/modules/:moduleId/lessons')
  .post(auth, validate(courseValidation.createLesson), courseController.createLesson)
  .get(auth, validate(courseValidation.getLessonsByModule), courseController.getLessonsByModule);

router.get('/lessons/:lessonId', auth, validate(courseValidation.getLessonDetail), courseController.getLessonDetail);

router
  .route('/quizzes/:quizId/questions')
  .post(auth, validate(courseValidation.createQuestionForQuiz), courseController.createQuestionForQuiz)
  .get(auth, validate(courseValidation.getQuizQuestions), courseController.getQuizQuestions);

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

/**
 * @swagger
 * /courses/slug/{slug}:
 *   get:
 *     summary: Get course by slug
 *     description: Retrieve a course by its URL slug.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Course slug
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Course'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /courses/instructor/{instructorId}:
 *   get:
 *     summary: Get courses by instructor
 *     description: Retrieve all courses created by a specific instructor.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: instructorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Instructor ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of courses
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
 *                     $ref: '#/components/schemas/Course'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 */

/**
 * @swagger
 * /courses/category/{categoryId}:
 *   get:
 *     summary: Get courses by category
 *     description: Retrieve all courses in a specific category.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of courses
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
 *                     $ref: '#/components/schemas/Course'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 */

/**
 * @swagger
 * /courses/featured:
 *   get:
 *     summary: Get featured courses
 *     description: Retrieve featured courses sorted by rating.
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of courses
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
 *                     $ref: '#/components/schemas/Course'
 */

/**
 * @swagger
 * /courses/published:
 *   get:
 *     summary: Get published courses
 *     description: Retrieve all published courses.
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of courses
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
 *                     $ref: '#/components/schemas/Course'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 */

/**
 * @swagger
 * /courses/search:
 *   get:
 *     summary: Search courses
 *     description: Search courses by title, description, or tags.
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc
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
 *                     $ref: '#/components/schemas/Course'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 */

/**
 * @swagger
 * /courses/stats:
 *   get:
 *     summary: Get course statistics
 *     description: Get comprehensive statistics about courses. Only admins can access this endpoint.
 *     tags: [Courses]
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
 *                 totalCourses:
 *                   type: integer
 *                   example: 150
 *                 publishedCourses:
 *                   type: integer
 *                   example: 120
 *                 unpublishedCourses:
 *                   type: integer
 *                   example: 30
 *                 categoryStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 levelStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       count:
 *                         type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /courses/my-courses:
 *   get:
 *     summary: Get my courses
 *     description: Get courses created by the current authenticated instructor.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of courses
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
 *                     $ref: '#/components/schemas/Course'
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
 * /courses/{courseId}/publish:
 *   patch:
 *     summary: Publish course
 *     description: Publish a course so it's visible to students. Only the instructor can publish their course.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Course'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /courses/{courseId}/unpublish:
 *   patch:
 *     summary: Unpublish course
 *     description: Unpublish a course so it's hidden from students. Only the instructor can unpublish their course.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Course'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /courses/{courseId}/rating:
 *   patch:
 *     summary: Update course rating
 *     description: Add or update a rating for a course. Used when students rate courses.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating value (1-5 stars)
 *             example:
 *               rating: 5
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Course'
 *       "400":
 *         description: Bad Request
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /courses/{courseId}/modules:
 *   get:
 *     summary: Get course modules
 *     description: Get all modules of a course with lesson details.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       lesson_ids:
 *                         type: array
 *                         items:
 *                           type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /courses/{courseId}/overview:
 *   get:
 *     summary: Get course overview
 *     description: Get complete course overview for enrolled students including enrollment progress.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *                 enrollment:
 *                   type: object
 *                   description: User's enrollment data
 *                 modules:
 *                   type: array
 *                   items:
 *                     type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: User not enrolled in this course
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
