const express = require('express');
const requireRole = require('../../middlewares/requireRole');
const validate = require('../../middlewares/validate');
const moduleValidation = require('../../validations/module.validation');
const moduleController = require('../../controllers/module.controller');

const router = express.Router();

router
  .route('/:moduleId')
  .get(requireRole(), validate(moduleValidation.getModule), moduleController.getModule)
  .patch(requireRole(), validate(moduleValidation.updateModule), moduleController.updateModule)
  .delete(requireRole(), validate(moduleValidation.deleteModule), moduleController.deleteModule);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Module management
 */

/**
 * @swagger
 * /modules/{moduleId}:
 *   get:
 *     summary: Get a module
 *     tags: [Modules]
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
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a module
 *     tags: [Modules]
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
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a module
 *     description: Delete a module and all its lessons.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */


