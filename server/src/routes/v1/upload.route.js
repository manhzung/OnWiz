const express = require('express');
const auth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const uploadValidation = require('../../validations/upload.validation');
const uploadController = require('../../controllers/upload.controller');
const { upload } = require('../../utils/upload');

const router = express.Router();

// User avatar routes
router
  .route('/users/:userId/avatar')
  .post(auth, upload.single('avatar'), validate(uploadValidation.uploadUserAvatar), uploadController.uploadUserAvatar)
  .delete(auth, validate(uploadValidation.deleteUserAvatar), uploadController.deleteUserAvatar);

// Current user avatar routes (convenience routes)
router
  .route('/users/me/avatar')
  .post(auth, upload.single('avatar'), uploadController.uploadUserAvatar)
  .delete(auth, uploadController.deleteUserAvatar);

// Course thumbnail routes
router
  .route('/courses/:courseId/thumbnail')
  .post(auth, upload.single('thumbnail'), validate(uploadValidation.uploadCourseThumbnail), uploadController.uploadCourseThumbnail)
  .delete(auth, validate(uploadValidation.deleteCourseThumbnail), uploadController.deleteCourseThumbnail);

// Classroom image routes
router
  .route('/classrooms/:classroomId/image')
  .post(auth, requireRole(['admin']), upload.single('image'), validate(uploadValidation.uploadClassroomImage), uploadController.uploadClassroomImage)
  .delete(auth, requireRole(['admin']), validate(uploadValidation.deleteClassroomImage), uploadController.deleteClassroomImage);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload management
 */

/**
 * @swagger
 * /upload/users/{userId}/avatar:
 *   post:
 *     summary: Upload user avatar
 *     description: Users can upload their own avatar, admins can upload any user's avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF, WebP) - max 5MB
 *     responses:
 *       "200":
 *         description: Avatar uploaded successfully
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete user avatar
 *     description: Users can delete their own avatar, admins can delete any user's avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Avatar deleted successfully
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /upload/users/me/avatar:
 *   post:
 *     summary: Upload current user avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF, WebP) - max 5MB
 *     responses:
 *       "200":
 *         description: Avatar uploaded successfully
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *   delete:
 *     summary: Delete current user avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Avatar deleted successfully
 */

/**
 * @swagger
 * /upload/courses/{courseId}/thumbnail:
 *   post:
 *     summary: Upload course thumbnail
 *     description: Only course instructor or admin can upload thumbnail
 *     tags: [Upload]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF, WebP) - max 5MB
 *     responses:
 *       "200":
 *         description: Thumbnail uploaded successfully
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete course thumbnail
 *     description: Only course instructor or admin can delete thumbnail
 *     tags: [Upload]
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
 *         description: Thumbnail deleted successfully
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /upload/classrooms/{classroomId}/image:
 *   post:
 *     summary: Upload classroom image (admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF, WebP) - max 5MB
 *     responses:
 *       "200":
 *         description: Classroom image uploaded successfully
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete classroom image (admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Classroom image deleted successfully
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
