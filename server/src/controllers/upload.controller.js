const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } = require('../utils/upload');
const { User } = require('../models');
const userService = require('../services/user.service');
const courseService = require('../services/course.service');
const classroomService = require('../services/classroom.service');
const ApiError = require('../utils/ApiError');

/**
 * Upload user avatar
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadUserAvatar = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No image file provided');
  }

  const userId = req.params.userId || req.user.id;

  // Check permissions: users can only upload their own avatar, admins can upload any
  if (req.params.userId && req.user.role !== 'admin' && req.params.userId !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Delete old avatar if exists
  if (user.imageURL) {
    const publicId = getPublicIdFromUrl(user.imageURL);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.warn('Failed to delete old avatar:', error);
      }
    }
  }

  // Upload new avatar
  const result = await uploadToCloudinary(req.file.buffer, 'avatars', `user_${userId}_avatar`);

  // Update user
  await userService.updateUserImageURL(userId, result.secure_url);

  res.status(httpStatus.OK).send({
    message: 'Avatar uploaded successfully',
    imageURL: result.secure_url,
    user: {
      id: user.id,
      name: user.name,
      imageURL: user.imageURL,
    },
  });
});

/**
 * Delete user avatar
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUserAvatar = catchAsync(async (req, res) => {
  const userId = req.params.userId || req.user.id;

  // Check permissions
  if (req.params.userId && req.user.role !== 'admin' && req.params.userId !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Delete avatar from Cloudinary
  if (user.imageURL) {
    const publicId = getPublicIdFromUrl(user.imageURL);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
    await userService.updateUserImageURL(userId, '');
  }

  res.status(httpStatus.OK).send({
    message: 'Avatar deleted successfully',
    user: {
      id: user.id,
      name: user.name,
      imageURL: user.imageURL,
    },
  });
});

/**
 * Upload course thumbnail
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadCourseThumbnail = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No image file provided');
  }

  const { Course } = require('../models');
  const courseId = req.params.courseId;

  // Find course
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if user is the instructor or admin
  if (course.instructor_id.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only course instructor or admin can upload thumbnail');
  }

  // Delete old thumbnail if exists
  if (course.imageURL) {
    const publicId = getPublicIdFromUrl(course.imageURL);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.warn('Failed to delete old thumbnail:', error);
      }
    }
  }

  // Upload new thumbnail
  const result = await uploadToCloudinary(req.file.buffer, 'courses', `course_${courseId}_thumbnail`);

  // Update course
  await courseService.updateCourseImageURL(courseId, result.secure_url);

  res.status(httpStatus.OK).send({
    message: 'Course thumbnail uploaded successfully',
    imageURL: result.secure_url,
    course: {
      id: course.id,
      title: course.title,
      imageURL: course.imageURL,
    },
  });
});

/**
 * Delete course thumbnail
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteCourseThumbnail = catchAsync(async (req, res) => {
  const { Course } = require('../models');
  const courseId = req.params.courseId;

  // Find course
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check permissions
  if (course.instructor_id.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only course instructor or admin can delete thumbnail');
  }

  // Delete thumbnail from Cloudinary
  if (course.imageURL) {
    const publicId = getPublicIdFromUrl(course.imageURL);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
    await courseService.updateCourseImageURL(courseId, '');
  }

  res.status(httpStatus.OK).send({
    message: 'Course thumbnail deleted successfully',
    course: {
      id: course.id,
      title: course.title,
      imageURL: course.imageURL,
    },
  });
});

/**
 * Upload classroom image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadClassroomImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No image file provided');
  }

  const { Classroom } = require('../models');
  const classroomId = req.params.classroomId;

  // Find classroom
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check if user is admin (only admins can upload classroom images)
  if (req.user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only admins can upload classroom images');
  }

  // Delete old image if exists
  if (classroom.imageURL) {
    const publicId = getPublicIdFromUrl(classroom.imageURL);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.warn('Failed to delete old classroom image:', error);
      }
    }
  }

  // Upload new image
  const result = await uploadToCloudinary(req.file.buffer, 'classrooms', `classroom_${classroomId}_image`);

  // Update classroom
  await classroomService.updateClassroomImageURL(classroomId, result.secure_url);

  res.status(httpStatus.OK).send({
    message: 'Classroom image uploaded successfully',
    imageURL: result.secure_url,
    classroom: {
      id: classroom.id,
      name: classroom.name,
      imageURL: classroom.imageURL,
    },
  });
});

/**
 * Delete classroom image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteClassroomImage = catchAsync(async (req, res) => {
  const { Classroom } = require('../models');
  const classroomId = req.params.classroomId;

  // Find classroom
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check permissions
  if (req.user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only admins can delete classroom images');
  }

  // Delete image from Cloudinary
  if (classroom.imageURL) {
    const publicId = getPublicIdFromUrl(classroom.imageURL);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
    await classroomService.updateClassroomImageURL(classroomId, '');
  }

  res.status(httpStatus.OK).send({
    message: 'Classroom image deleted successfully',
    classroom: {
      id: classroom.id,
      name: classroom.name,
      imageURL: classroom.imageURL,
    },
  });
});

module.exports = {
  uploadUserAvatar,
  deleteUserAvatar,
  uploadCourseThumbnail,
  deleteCourseThumbnail,
  uploadClassroomImage,
  deleteClassroomImage,
};
