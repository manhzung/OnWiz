const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { classroomService } = require('../services');

/**
 * Create a classroom
 * @route POST /api/v1/classrooms
 * @access Private (Admin/Instructor)
 */
const createClassroom = catchAsync(async (req, res) => {
  const classroom = await classroomService.createClassroom(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(classroom);
});

/**
 * Query classrooms
 * @route GET /api/v1/classrooms
 * @access Private (Users see classrooms they belong to, Admin sees all)
 */
const getClassrooms = catchAsync(async (req, res) => {
  const result = await classroomService.queryClassrooms(
    req.query,
    {
      sortBy: req.query.sortBy,
      limit: req.query.limit,
      page: req.query.page,
    },
    req.user
  );
  res.send(result);
});

/**
 * Get classroom by ID
 * @route GET /api/v1/classrooms/:classroomId
 * @access Private (Classroom members only)
 */
const getClassroom = catchAsync(async (req, res) => {
  const classroom = await classroomService.getClassroomById(req.params.classroomId, req.user);
  res.send(classroom);
});

/**
 * Update classroom by ID
 * @route PATCH /api/v1/classrooms/:classroomId
 * @access Private (Classroom admin only)
 */
const updateClassroom = catchAsync(async (req, res) => {
  const classroom = await classroomService.updateClassroomById(req.params.classroomId, req.body, req.user);
  res.send(classroom);
});

/**
 * Delete classroom by ID
 * @route DELETE /api/v1/classrooms/:classroomId
 * @access Private (Classroom admin only)
 */
const deleteClassroom = catchAsync(async (req, res) => {
  await classroomService.deleteClassroomById(req.params.classroomId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Add member to classroom
 * @route POST /api/v1/classrooms/:classroomId/members
 * @access Private (Classroom admin only)
 */
const addMember = catchAsync(async (req, res) => {
  const classroom = await classroomService.addMember(req.params.classroomId, req.body.userId, req.body.role, req.user);
  res.send(classroom);
});

/**
 * Remove member from classroom
 * @route DELETE /api/v1/classrooms/:classroomId/members/:userId
 * @access Private (Classroom admin only)
 */
const removeMember = catchAsync(async (req, res) => {
  const classroom = await classroomService.removeMember(req.params.classroomId, req.params.userId, req.user);
  res.send(classroom);
});

/**
 * Update member role
 * @route PATCH /api/v1/classrooms/:classroomId/members/:userId
 * @access Private (Classroom admin only)
 */
const updateMemberRole = catchAsync(async (req, res) => {
  const classroom = await classroomService.updateMemberRole(
    req.params.classroomId,
    req.params.userId,
    req.body.role,
    req.user
  );
  res.send(classroom);
});

/**
 * Assign course to classroom
 * @route POST /api/v1/classrooms/:classroomId/courses
 * @access Private (Classroom admin only)
 */
const assignCourse = catchAsync(async (req, res) => {
  const classroom = await classroomService.assignCourse(req.params.classroomId, req.body.courseId, req.user);
  res.send(classroom);
});

/**
 * Remove course from classroom
 * @route DELETE /api/v1/classrooms/:classroomId/courses/:courseId
 * @access Private (Classroom admin only)
 */
const removeCourse = catchAsync(async (req, res) => {
  const classroom = await classroomService.removeCourse(req.params.classroomId, req.params.courseId, req.user);
  res.send(classroom);
});

/**
 * Get my classrooms
 * @route GET /api/v1/classrooms/my-classrooms
 * @access Private (Users)
 */
const getMyClassrooms = catchAsync(async (req, res) => {
  const result = await classroomService.getMyClassrooms(req.user._id, req.query);
  res.send(result);
});

/**
 * Get classroom statistics
 * @route GET /api/v1/classrooms/stats
 * @access Private (Admin)
 */
const getClassroomStats = catchAsync(async (req, res) => {
  const stats = await classroomService.getClassroomStats();
  res.send(stats);
});

/**
 * Upload material to classroom
 * @route POST /api/v1/classrooms/:classroomId/materials
 * @access Private (Classroom members)
 */
const uploadMaterial = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No file provided');
  }

  const { uploadMaterialToCloudinary } = require('../utils/upload');

  // Upload file to Cloudinary
  const result = await uploadMaterialToCloudinary(
    req.file.buffer,
    `classrooms/${req.params.classroomId}/materials`,
    `${Date.now()}_${req.file.originalname}`
  );

  // Save material info to classroom
  const materialData = {
    filename: req.file.originalname,
    material_url: result.secure_url,
    file_size: req.file.size,
    file_type: req.file.mimetype,
  };

  const classroom = await classroomService.uploadMaterial(
    req.params.classroomId,
    req.user.id,
    materialData
  );

  res.status(httpStatus.CREATED).send({
    message: 'Material uploaded successfully',
    material: {
      id: classroom.materials[classroom.materials.length - 1]._id,
      filename: materialData.filename,
      material_url: materialData.material_url,
      file_size: materialData.file_size,
      file_type: materialData.file_type,
      uploaded_at: classroom.materials[classroom.materials.length - 1].uploaded_at,
      user_id: req.user.id,
    },
  });
});

/**
 * Get classroom materials
 * @route GET /api/v1/classrooms/:classroomId/materials
 * @access Private (Classroom members)
 */
const getMaterials = catchAsync(async (req, res) => {
  const materials = await classroomService.getClassroomMaterials(
    req.params.classroomId,
    req.user.id
  );
  res.send({ materials });
});

/**
 * Delete material from classroom
 * @route DELETE /api/v1/classrooms/:classroomId/materials/:materialId
 * @access Private (Material uploader or admin)
 */
const deleteMaterial = catchAsync(async (req, res) => {
  await classroomService.deleteMaterial(
    req.params.classroomId,
    req.params.materialId,
    req.user.id
  );
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createClassroom,
  getClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom,
  uploadMaterial,
  getMaterials,
  deleteMaterial,
  addMember,
  removeMember,
  updateMemberRole,
  assignCourse,
  removeCourse,
  getMyClassrooms,
  getClassroomStats,
};
