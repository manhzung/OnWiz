const httpStatus = require('http-status');
const { Classroom, User, Course } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPublicIdFromUrl } = require('../utils/upload');

/**
 * Create a classroom
 * @param {ObjectId} creatorId - User creating the classroom
 * @param {Object} classroomBody
 * @returns {Promise<Classroom>}
 */
const createClassroom = async (creatorId, classroomBody) => {
  // Verify courses exist if provided
  if (classroomBody.assigned_courses && classroomBody.assigned_courses.length > 0) {
    const courses = await Course.find({ _id: { $in: classroomBody.assigned_courses } });
    if (courses.length !== classroomBody.assigned_courses.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'One or more assigned courses not found');
    }
  }

  // Create classroom with creator as admin
  const members = [{ user_id: creatorId, role: 'admin' }];
  if (classroomBody.members) {
    // Validate and add additional members
    for (const member of classroomBody.members) {
      const user = await User.findById(member.user_id);
      if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, `User ${member.user_id} not found`);
      }
      members.push({
        user_id: member.user_id,
        role: member.role || 'student',
      });
    }
  }

  const classroom = await Classroom.create({
    name: classroomBody.name,
    members: members,
    assigned_courses: classroomBody.assigned_courses || [],
  });

  return classroom;
};

/**
 * Query for classrooms
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {Object} currentUser - User making the request
 * @returns {Promise<QueryResult>}
 */
const queryClassrooms = async (filter, options, currentUser) => {
  const query = {};

  // Apply role-based filtering
  if (currentUser.role !== 'admin') {
    // Users only see classrooms they belong to
    query.members = { $elemMatch: { user_id: currentUser._id } };
  }

  if (filter.name) {
    query.name = { $regex: filter.name, $options: 'i' };
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Classroom.paginate) {
    return Classroom.paginate(query, {
      sortBy: sort,
      limit,
      page,
      populate: [
        { path: 'members.user_id', select: 'name email' },
        { path: 'assigned_courses', select: 'title slug thumbnail_url' },
      ],
    });
  }

  const classrooms = await Classroom.find(query)
    .populate('members.user_id', 'name email')
    .populate('assigned_courses', 'title slug thumbnail_url')
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);

  return { results: classrooms };
};

/**
 * Get classroom by id
 * @param {ObjectId} classroomId
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Classroom>}
 */
const getClassroomById = async (classroomId, currentUser) => {
  const classroom = await Classroom.findById(classroomId)
    .populate('members.user_id', 'name email')
    .populate('assigned_courses', 'title slug thumbnail_url pricing instructor');

  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check if user is a member or admin
  const isMember = classroom.members.some((member) => String(member.user_id._id) === String(currentUser._id));
  const isAdmin = currentUser.role === 'admin';

  if (!isMember && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this classroom');
  }

  return classroom;
};

/**
 * Update classroom by id
 * @param {ObjectId} classroomId
 * @param {Object} updateBody
 * @param {Object} currentUser - User making the update
 * @returns {Promise<Classroom>}
 */
const updateClassroomById = async (classroomId, updateBody, currentUser) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check if user is classroom admin
  const member = classroom.members.find((m) => String(m.user_id) === String(currentUser._id));
  const isAdmin = currentUser.role === 'admin' || (member && member.role === 'admin');

  if (!isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this classroom');
  }

  Object.assign(classroom, updateBody);
  await classroom.save();
  return classroom;
};

/**
 * Delete classroom by id
 * @param {ObjectId} classroomId
 * @param {Object} currentUser - User making the delete request
 * @returns {Promise<Classroom>}
 */
const deleteClassroomById = async (classroomId, currentUser) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check if user is classroom admin
  const member = classroom.members.find((m) => String(m.user_id) === String(currentUser._id));
  const isAdmin = currentUser.role === 'admin' || (member && member.role === 'admin');

  if (!isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete this classroom');
  }

  await classroom.deleteOne();
  return classroom;
};

/**
 * Add member to classroom
 * @param {ObjectId} classroomId
 * @param {ObjectId} userId - User to add
 * @param {string} role - Member role
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Classroom>}
 */
const addMember = async (classroomId, userId, role, currentUser) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check if current user is classroom admin
  const member = classroom.members.find((m) => String(m.user_id) === String(currentUser._id));
  const isAdmin = currentUser.role === 'admin' || (member && member.role === 'admin');

  if (!isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to manage classroom members');
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  // Check if user is already a member
  const existingMember = classroom.members.find((m) => String(m.user_id) === String(userId));
  if (existingMember) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is already a member of this classroom');
  }

  classroom.members.push({
    user_id: userId,
    role: role || 'student',
  });

  await classroom.save();
  return classroom;
};

/**
 * Remove member from classroom
 * @param {ObjectId} classroomId
 * @param {ObjectId} userId - User to remove
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Classroom>}
 */
const removeMember = async (classroomId, userId, currentUser) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check if current user is classroom admin
  const member = classroom.members.find((m) => String(m.user_id) === String(currentUser._id));
  const isAdmin = currentUser.role === 'admin' || (member && member.role === 'admin');

  if (!isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to manage classroom members');
  }

  // Cannot remove the last admin
  const adminCount = classroom.members.filter((m) => m.role === 'admin').length;
  const memberToRemove = classroom.members.find((m) => String(m.user_id) === String(userId));

  if (memberToRemove && memberToRemove.role === 'admin' && adminCount <= 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot remove the last admin from classroom');
  }

  classroom.members = classroom.members.filter((m) => String(m.user_id) !== String(userId));
  await classroom.save();

  return classroom;
};

/**
 * Update member role
 * @param {ObjectId} classroomId
 * @param {ObjectId} userId - Member to update
 * @param {string} newRole - New role
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Classroom>}
 */
const updateMemberRole = async (classroomId, userId, newRole, currentUser) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check if current user is classroom admin
  const member = classroom.members.find((m) => String(m.user_id) === String(currentUser._id));
  const isAdmin = currentUser.role === 'admin' || (member && member.role === 'admin');

  if (!isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to manage classroom members');
  }

  const memberToUpdate = classroom.members.find((m) => String(m.user_id) === String(userId));
  if (!memberToUpdate) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is not a member of this classroom');
  }

  // Cannot demote the last admin
  if (memberToUpdate.role === 'admin' && newRole !== 'admin') {
    const adminCount = classroom.members.filter((m) => m.role === 'admin').length;
    if (adminCount <= 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot demote the last admin from classroom');
    }
  }

  memberToUpdate.role = newRole;
  await classroom.save();

  return classroom;
};

/**
 * Assign course to classroom
 * @param {ObjectId} classroomId
 * @param {ObjectId} courseId - Course to assign
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Classroom>}
 */
const assignCourse = async (classroomId, courseId, currentUser) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check if current user is classroom admin
  const member = classroom.members.find((m) => String(m.user_id) === String(currentUser._id));
  const isAdmin = currentUser.role === 'admin' || (member && member.role === 'admin');

  if (!isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to assign courses to this classroom');
  }

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course not found');
  }

  // Check if course is already assigned
  if (classroom.assigned_courses.includes(courseId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course is already assigned to this classroom');
  }

  classroom.assigned_courses.push(courseId);
  await classroom.save();

  return classroom;
};

/**
 * Remove course from classroom
 * @param {ObjectId} classroomId
 * @param {ObjectId} courseId - Course to remove
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Classroom>}
 */
const removeCourse = async (classroomId, courseId, currentUser) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check if current user is classroom admin
  const member = classroom.members.find((m) => String(m.user_id) === String(currentUser._id));
  const isAdmin = currentUser.role === 'admin' || (member && member.role === 'admin');

  if (!isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to remove courses from this classroom');
  }

  classroom.assigned_courses = classroom.assigned_courses.filter((id) => String(id) !== String(courseId));
  await classroom.save();

  return classroom;
};

/**
 * Get classrooms for a user
 * @param {ObjectId} userId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getMyClassrooms = async (userId, options = {}) => {
  const queryOptions = {
    sortBy: options.sortBy || 'created_at:desc',
    limit: options.limit || 20,
    page: options.page || 1,
  };

  return queryClassrooms({}, queryOptions, { _id: userId, role: 'user' });
};

/**
 * Get classroom statistics
 * @returns {Promise<Object>}
 */
const getClassroomStats = async () => {
  const totalClassrooms = await Classroom.countDocuments();

  const totalMembers = await Classroom.aggregate([{ $unwind: '$members' }, { $count: 'totalMembers' }]);

  const totalAssignedCourses = await Classroom.aggregate([
    { $unwind: '$assigned_courses' },
    { $count: 'totalAssignedCourses' },
  ]);

  const membersByRole = await Classroom.aggregate([
    { $unwind: '$members' },
    { $group: { _id: '$members.role', count: { $sum: 1 } } },
  ]);

  return {
    totalClassrooms,
    totalMembers: totalMembers[0]?.totalMembers || 0,
    totalAssignedCourses: totalAssignedCourses[0]?.totalAssignedCourses || 0,
    membersByRole,
  };
};

/**
 * Update classroom image URL
 * @param {ObjectId} classroomId
 * @param {string} imageURL
 * @returns {Promise<Classroom>}
 */
const updateClassroomImageURL = async (classroomId, imageURL) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }
  classroom.imageURL = imageURL;
  await classroom.save();
  return classroom;
};

/**
 * Upload material to classroom
 * @param {ObjectId} classroomId
 * @param {ObjectId} userId
 * @param {Object} materialData - { filename, material_url, file_size, file_type }
 * @returns {Promise<Classroom>}
 */
const uploadMaterial = async (classroomId, userId, materialData) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check if user is a member of the classroom
  const isMember = classroom.members.some(member =>
    String(member.user_id) === String(userId)
  );
  if (!isMember) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only classroom members can upload materials');
  }

  // Add material to classroom
  classroom.materials.push({
    user_id: userId,
    filename: materialData.filename,
    material_url: materialData.material_url,
    file_size: materialData.file_size,
    file_type: materialData.file_type,
  });

  await classroom.save();
  return classroom;
};

/**
 * Get classroom materials
 * @param {ObjectId} classroomId
 * @param {ObjectId} userId - User requesting materials
 * @returns {Promise<Array>} Array of materials with user info
 */
const getClassroomMaterials = async (classroomId, userId) => {
  const classroom = await Classroom.findById(classroomId)
    .populate('materials.user_id', 'name email')
    .select('materials members');

  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check if user is a member or admin
  const isMember = classroom.members.some(member =>
    String(member.user_id) === String(userId)
  );
  const isAdmin = await require('./user.service').getUserById(userId).then(user => user.role === 'admin');

  if (!isMember && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access classroom materials');
  }

  return classroom.materials;
};

/**
 * Delete material from classroom
 * @param {ObjectId} classroomId
 * @param {ObjectId} materialId
 * @param {ObjectId} userId - User requesting deletion
 * @returns {Promise<Classroom>}
 */
const deleteMaterial = async (classroomId, materialId, userId) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Find the material
  const materialIndex = classroom.materials.findIndex(material =>
    String(material._id) === String(materialId)
  );

  if (materialIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Material not found');
  }

  const material = classroom.materials[materialIndex];

  // Check permissions: material uploader or admin can delete
  const isUploader = String(material.user_id) === String(userId);
  const isAdmin = await require('./user.service').getUserById(userId).then(user => user.role === 'admin');

  if (!isUploader && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only material uploader or admin can delete materials');
  }

  // Delete file from Cloudinary
  const { deleteFromCloudinary, getPublicIdFromUrl } = require('../utils/upload');
  if (material.material_url) {
    const publicId = getPublicIdFromUrl(material.material_url);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.warn('Failed to delete material from Cloudinary:', error);
      }
    }
  }

  // Remove material from array
  classroom.materials.splice(materialIndex, 1);
  await classroom.save();

  return classroom;
};

module.exports = {
  createClassroom,
  queryClassrooms,
  getClassroomById,
  updateClassroomById,
  updateClassroomImageURL,
  deleteClassroomById,
  uploadMaterial,
  getClassroomMaterials,
  deleteMaterial,
  addMember,
  removeMember,
  updateMemberRole,
  assignCourse,
  removeCourse,
  getMyClassrooms,
  getClassroomStats,
};
