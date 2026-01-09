const express = require('express');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const classroomValidation = require('../../validations/classroom.validation');
const classroomController = require('../../controllers/classroom.controller');
const { uploadMaterial } = require('../../utils/upload');

const router = express.Router();

// Classroom CRUD operations
router
  .route('/')
  .post(auth, validate(classroomValidation.createClassroom), classroomController.createClassroom)
  .get(auth, validate(classroomValidation.getClassrooms), classroomController.getClassrooms);

// My classrooms
router.route('/my-classrooms').get(auth, classroomController.getMyClassrooms);

// Classroom statistics
router.route('/stats').get(auth, requireRole(['admin']), classroomController.getClassroomStats);

// Individual classroom operations
router
  .route('/:classroomId')
  .get(auth, validate(classroomValidation.getClassroom), classroomController.getClassroom)
  .patch(auth, validate(classroomValidation.updateClassroom), classroomController.updateClassroom)
  .delete(auth, validate(classroomValidation.deleteClassroom), classroomController.deleteClassroom);

// Member management
router.route('/:classroomId/members').post(auth, validate(classroomValidation.addMember), classroomController.addMember);

router
  .route('/:classroomId/members/:userId')
  .patch(auth, validate(classroomValidation.updateMemberRole), classroomController.updateMemberRole)
  .delete(auth, validate(classroomValidation.removeMember), classroomController.removeMember);

// Course assignment
router
  .route('/:classroomId/courses')
  .post(auth, validate(classroomValidation.assignCourse), classroomController.assignCourse);

router
  .route('/:classroomId/courses/:courseId')
  .delete(auth, validate(classroomValidation.removeCourse), classroomController.removeCourse);

// Material management
router
  .route('/:classroomId/materials')
  .post(auth, uploadMaterial.single('material'), validate(classroomValidation.uploadMaterial), classroomController.uploadMaterial)
  .get(auth, validate(classroomValidation.getMaterials), classroomController.getMaterials);

router
  .route('/:classroomId/materials/:materialId')
  .delete(auth, validate(classroomValidation.deleteMaterial), classroomController.deleteMaterial);

/**
 * @swagger
 * /classrooms/{classroomId}/materials:
 *   post:
 *     summary: Upload material to classroom
 *     description: Upload files (documents, images, videos, etc.) to a classroom. Only classroom members can upload materials.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               material:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (max 50MB) - supports documents, images, videos, audio, etc.
 *     responses:
 *       "201":
 *         description: Material uploaded successfully
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   get:
 *     summary: Get classroom materials
 *     description: Retrieve all materials uploaded to a classroom. Only classroom members can view materials.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 materials:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       filename:
 *                         type: string
 *                       material_url:
 *                         type: string
 *                       file_size:
 *                         type: number
 *                       file_type:
 *                         type: string
 *                       uploaded_at:
 *                         type: string
 *                         format: date-time
 *                       user_id:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /classrooms/{classroomId}/materials/{materialId}:
 *   delete:
 *     summary: Delete material from classroom
 *     description: Delete a material from classroom. Only the uploader or classroom admin can delete materials.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema:
 *           type: string
 *         description: Material ID to delete
 *     responses:
 *       "200":
 *         description: Material deleted successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Classrooms
 *   description: Classroom management and member administration
 */

/**
 * @swagger
 * /classrooms:
 *   post:
 *     summary: Create a classroom
 *     description: Create a new classroom. The creator automatically becomes an admin member.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Classroom name
 *               members:
 *                 type: array
 *                 description: Additional members to add
 *                 items:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       description: User ID
 *                     role:
 *                       type: string
 *                       enum: [student, admin, assistant]
 *                       default: student
 *               assigned_courses:
 *                 type: array
 *                 description: Courses to assign to the classroom
 *                 items:
 *                   type: string
 *             example:
 *               name: "Advanced Programming Class"
 *               members: []
 *               assigned_courses: ["60d5ecb74b24c72b8c8b4567"]
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Classroom'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   get:
 *     summary: List classrooms
 *     description: Users see classrooms they belong to; admins see all classrooms.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by classroom name
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
 *         description: Maximum number of classrooms
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
 *                     $ref: '#/components/schemas/Classroom'
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
 * /classrooms/my-classrooms:
 *   get:
 *     summary: Get my classrooms
 *     description: Get all classrooms where the authenticated user is a member.
 *     tags: [Classrooms]
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
 *         description: Maximum number of classrooms
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
 *                     $ref: '#/components/schemas/Classroom'
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
 * /classrooms/stats:
 *   get:
 *     summary: Get classroom statistics
 *     description: Get comprehensive statistics about classrooms. Only admins can access this endpoint.
 *     tags: [Classrooms]
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
 *                 totalClassrooms:
 *                   type: integer
 *                   example: 25
 *                 totalMembers:
 *                   type: integer
 *                   example: 150
 *                 totalAssignedCourses:
 *                   type: integer
 *                   example: 40
 *                 membersByRole:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         enum: [student, admin, assistant]
 *                       count:
 *                         type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /classrooms/{classroomId}:
 *   get:
 *     summary: Get classroom by ID
 *     description: Get detailed classroom information. Only classroom members can access.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Classroom'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update classroom by ID
 *     description: Update classroom information. Only classroom admins can update.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Classroom name
 *             example:
 *               name: "Updated Classroom Name"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Classroom'
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
 *     summary: Delete classroom by ID
 *     description: Delete a classroom. Only classroom admins can delete.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
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
 * /classrooms/{classroomId}/members:
 *   post:
 *     summary: Add member to classroom
 *     description: Add a user to the classroom with a specific role. Only classroom admins can add members.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to add
 *               role:
 *                 type: string
 *                 enum: [student, admin, assistant]
 *                 default: student
 *                 description: Role for the new member
 *             example:
 *               userId: "60d5ecb74b24c72b8c8b4568"
 *               role: "student"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Classroom'
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
 * /classrooms/{classroomId}/members/{userId}:
 *   patch:
 *     summary: Update member role
 *     description: Update a member's role in the classroom. Only classroom admins can update roles.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID whose role to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [student, admin, assistant]
 *                 description: New role for the member
 *             example:
 *               role: "assistant"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Classroom'
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
 *     summary: Remove member from classroom
 *     description: Remove a user from the classroom. Only classroom admins can remove members. Cannot remove the last admin.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to remove
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Classroom'
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
 * /classrooms/{classroomId}/courses:
 *   post:
 *     summary: Assign course to classroom
 *     description: Assign a course to the classroom. Only classroom admins can assign courses.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: Course ID to assign
 *             example:
 *               courseId: "60d5ecb74b24c72b8c8b4567"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Classroom'
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
 * /classrooms/{classroomId}/courses/{courseId}:
 *   delete:
 *     summary: Remove course from classroom
 *     description: Remove a course assignment from the classroom. Only classroom admins can remove courses.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Classroom ID
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID to remove
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Classroom'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
