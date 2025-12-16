const express = require('express');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const classroomValidation = require('../../validations/classroom.validation');
const classroomController = require('../../controllers/classroom.controller');

const router = express.Router();

router
  .route('/')
  .post(requireRole(['admin']), validate(classroomValidation.createClassroom), classroomController.createClassroom)
  .get(requireRole(), validate(classroomValidation.getClassrooms), classroomController.getClassrooms);

router
  .route('/:classroomId')
  .get(requireRole(), validate(classroomValidation.getClassroom), classroomController.getClassroom)
  .patch(requireRole(['admin']), validate(classroomValidation.updateClassroom), classroomController.updateClassroom)
  .delete(requireRole(['admin']), validate(classroomValidation.deleteClassroom), classroomController.deleteClassroom);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Classrooms
 *   description: Classroom management
 */

/**
 * @swagger
 * /classrooms:
 *   post:
 *     summary: Create a classroom (admin)
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
 *               assigned_courses:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       "201":
 *         description: Created
 *   get:
 *     summary: List classrooms
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
 * /classrooms/{classroomId}:
 *   get:
 *     summary: Get classroom
 *     tags: [Classrooms]
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
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update classroom (admin)
 *     tags: [Classrooms]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: object
 *               assigned_courses:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       "200":
 *         description: OK
 *   delete:
 *     summary: Delete classroom (admin)
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

