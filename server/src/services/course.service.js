const httpStatus = require('http-status');
const {
  Course,
  Module,
  Lesson,
  LessonVideo,
  LessonTheory,
  LessonQuiz,
  Question,
  QuestionSingleChoice,
  QuestionMultipleChoice,
  QuestionFillIn,
} = require('../models');
const ApiError = require('../utils/ApiError');
const { deleteLessonById } = require('./lesson.service');

const createCourse = async (instructorId, body) => {
  // Get instructor name
  const User = require('../models/user.model');
  const instructor = await User.findById(instructorId);

  // Validate category exists
  const Category = require('../models/category.model').Category;
  const category = await Category.findById(body.category_id);
  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid category');
  }

  const course = await Course.create({
    title: body.title,
    slug: body.slug,
    description: body.description || '',
    instructor_id: instructorId,
    instructor: instructor ? instructor.name : '',
    category_id: body.category_id,
    thumbnail_url: body.thumbnail_url || '',
    pricing: body.pricing || {},
    rating: body.rating || 0,
    totalRatings: body.totalRatings || 0,
    students: body.students || 0,
    level: body.level || 'beginner',
    duration: body.duration || '',
    type: body.type || 'Course',
    tags: body.tags || [],
  });
  return course;
};

const updateCourseById = async (courseId, body) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Update basic fields
  if (body.title !== undefined) course.title = body.title;
  if (body.slug !== undefined) course.slug = body.slug;
  if (body.description !== undefined) course.description = body.description;
  if (body.category_id !== undefined) {
    const Category = require('../models/category.model').Category;
    const category = await Category.findById(body.category_id);
    if (!category) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid category');
    }
    course.category_id = body.category_id;
  }
  if (body.thumbnail_url !== undefined) course.thumbnail_url = body.thumbnail_url;
  if (body.pricing !== undefined) course.pricing = body.pricing;
  if (body.is_published !== undefined) course.is_published = body.is_published;

  // Update metadata fields
  if (body.rating !== undefined) course.rating = body.rating;
  if (body.totalRatings !== undefined) course.totalRatings = body.totalRatings;
  if (body.students !== undefined) course.students = body.students;
  if (body.level !== undefined) course.level = body.level;
  if (body.duration !== undefined) course.duration = body.duration;
  if (body.type !== undefined) course.type = body.type;
  if (body.tags !== undefined) course.tags = body.tags;

  await course.save();
  return course;
};

const deleteCourseById = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Xoá toàn bộ module & lesson (kèm resource)
  const modules = await Module.find({ course_id: courseId });
  // eslint-disable-next-line no-restricted-syntax
  for (const mod of modules) {
    const lessons = await Lesson.find({ module_id: mod._id });
    // eslint-disable-next-line no-restricted-syntax
    for (const lesson of lessons) {
      // eslint-disable-next-line no-await-in-loop
      await deleteLessonById(lesson._id, false);
    }
    // eslint-disable-next-line no-await-in-loop
    await mod.deleteOne();
  }

  await course.deleteOne();
  return course;
};

const createModule = async (courseId, body) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  const moduleDoc = await Module.create({
    course_id: courseId,
    title: body.title,
    lesson_ids: [],
  });
  course.module_ids.push(moduleDoc._id);
  course.total_modules += 1;
  await course.save();
  return moduleDoc;
};

const createLesson = async (moduleId, body) => {
  const moduleDoc = await Module.findById(moduleId);
  if (!moduleDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  // đảm bảo course_id trong body khớp với module
  if (String(moduleDoc.course_id) !== String(body.course_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'course_id does not match module.course_id');
  }

  let resource;
  if (body.type === 'video') {
    resource = await LessonVideo.create({
      provider: body.provider,
      url: body.url,
      duration: body.duration,
      transcript: body.transcript || '',
    });
  } else if (body.type === 'theory') {
    resource = await LessonTheory.create({
      content_html: body.content_html,
      attachments: [],
      reading_time_minutes: 0,
    });
  } else if (body.type === 'quiz') {
    resource = await LessonQuiz.create({
      settings: {
        time_limit: body.settings.time_limit,
        pass_score: body.settings.pass_score,
        shuffle_questions: body.settings.shuffle_questions ?? true,
      },
      question_ids: [],
    });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid lesson type');
  }

  const lesson = await Lesson.create({
    module_id: moduleId,
    course_id: body.course_id,
    title: body.title,
    slug: body.slug,
    type: body.type,
    resource_id: resource._id,
    is_preview: body.is_preview ?? false,
  });

  moduleDoc.lesson_ids.push(lesson._id);
  await moduleDoc.save();

  return lesson;
};

const createQuestionForQuiz = async (quizId, body) => {
  const quiz = await LessonQuiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
  }

  let detail;
  if (body.type === 'single_choice') {
    detail = await QuestionSingleChoice.create({
      options: body.options,
      explanation: body.explanation || '',
    });
  } else if (body.type === 'multiple_choice') {
    detail = await QuestionMultipleChoice.create({
      options: body.options,
      explanation: body.explanation || '',
    });
  } else if (body.type === 'fill_in') {
    detail = await QuestionFillIn.create({
      correct_answers: body.correct_answers,
      explanation: body.explanation || '',
    });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid question type');
  }

  const question = await Question.create({
    type: body.type,
    difficulty: body.difficulty || 'easy',
    content: body.content,
    image_url: body.image_url || '',
    resource_id: detail._id,
  });

  quiz.question_ids.push(question._id);
  await quiz.save();

  return question;
};

const listCourses = async (filter, options) => {
  const query = {};

  // Build query based on filters
  if (filter.instructor_id) {
    query.instructor_id = filter.instructor_id;
  }
  if (filter.category_id) {
    query.category_id = filter.category_id;
  }
  if (filter.category) {
    // For backward compatibility, also check category name
    query.$or = query.$or || [];
    query.$or.push({ 'category.name': { $regex: filter.category, $options: 'i' } });
  }
  if (filter.type) {
    query.type = filter.type;
  }
  if (filter.level) {
    query.level = filter.level;
  }
  if (filter.is_published !== undefined) {
    query.is_published = filter.is_published;
  }
  if (filter.search) {
    query.$or = query.$or || [];
    query.$or.push(
      { title: { $regex: filter.search, $options: 'i' } },
      { description: { $regex: filter.search, $options: 'i' } },
      { 'category.name': { $regex: filter.search, $options: 'i' } },
      { instructor: { $regex: filter.search, $options: 'i' } }
    );
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  // Dùng paginate plugin nếu có, hoặc fallback find
  if (Course.paginate) {
    return Course.paginate(query, {
      sortBy: sort,
      limit,
      page,
      populate: [
        { path: 'category_id', select: 'name slug type icon color' },
        { path: 'instructor_id', select: 'name' },
      ],
    });
  }
  const courses = await Course.find(query)
    .populate('category_id', 'name slug type icon color')
    .populate('instructor_id', 'name')
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);
  return { results: courses };
};

const getCourseWithModules = async (courseId) => {
  const course = await Course.findById(courseId)
    .populate('category_id', 'name slug type icon color')
    .populate('instructor_id', 'name')
    .lean();
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  const modules = await Module.find({ course_id: courseId }).lean();
  return { ...course, modules };
};

const getModulesByCourse = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  const modules = await Module.find({ course_id: courseId });
  return modules;
};

const getLessonsByModule = async (moduleId) => {
  const moduleDoc = await Module.findById(moduleId);
  if (!moduleDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  const lessons = await Lesson.find({ module_id: moduleId });
  return lessons;
};

const getLessonDetail = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  let resource = null;
  if (lesson.type === 'video') {
    resource = await LessonVideo.findById(lesson.resource_id).lean();
  } else if (lesson.type === 'theory') {
    resource = await LessonTheory.findById(lesson.resource_id).lean();
  } else if (lesson.type === 'quiz') {
    const quiz = await LessonQuiz.findById(lesson.resource_id).lean();
    if (!quiz) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
    }
    const questions = await Question.find({ _id: { $in: quiz.question_ids } }).lean();
    resource = { ...quiz, questions };
  }

  return { lesson, resource };
};

const getQuizQuestions = async (quizId) => {
  const quiz = await LessonQuiz.findById(quizId).lean();
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
  }
  const questions = await Question.find({ _id: { $in: quiz.question_ids } }).lean();
  return questions;
};

/**
 * Query for courses
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCourses = async (filter, options) => {
  const query = {};

  if (filter.title) {
    query.title = { $regex: filter.title, $options: 'i' };
  }
  if (filter.instructor_id) {
    query.instructor_id = filter.instructor_id;
  }
  if (filter.category_id) {
    query.category_id = filter.category_id;
  }
  if (filter.level) {
    query.level = filter.level;
  }
  if (filter.type) {
    query.type = filter.type;
  }
  if (filter.is_published !== undefined) {
    query.is_published = filter.is_published;
  }
  if (filter.min_price !== undefined || filter.max_price !== undefined) {
    query['pricing.price'] = {};
    if (filter.min_price !== undefined) {
      query['pricing.price'].$gte = filter.min_price;
    }
    if (filter.max_price !== undefined) {
      query['pricing.price'].$lte = filter.max_price;
    }
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Course.paginate) {
    return Course.paginate(query, {
      sortBy: sort,
      limit,
      page,
      populate: [
        { path: 'instructor_id', select: 'name email' },
        { path: 'category_id', select: 'name slug' },
      ],
    });
  }

  const courses = await Course.find(query)
    .populate('instructor_id', 'name email')
    .populate('category_id', 'name slug')
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);

  return { results: courses };
};

/**
 * Get course by id
 * @param {ObjectId} id
 * @returns {Promise<Course>}
 */
const getCourseById = async (id) => {
  const course = await Course.findById(id)
    .populate('instructor_id', 'name email')
    .populate('category_id', 'name slug')
    .populate('module_ids', 'title');
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  return course;
};

/**
 * Get course by slug
 * @param {string} slug
 * @returns {Promise<Course>}
 */
const getCourseBySlug = async (slug) => {
  const course = await Course.findOne({ slug })
    .populate('instructor_id', 'name email')
    .populate('category_id', 'name slug')
    .populate('module_ids', 'title');
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  return course;
};

/**
 * Update course by id
 * @param {ObjectId} courseId
 * @param {Object} updateBody
 * @param {ObjectId} userId - User making the update (for authorization)
 * @returns {Promise<Course>}
 */
const updateCourseByIdWithAuth = async (courseId, updateBody, userId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if user is the instructor or admin
  if (String(course.instructor_id) !== String(userId)) {
    // TODO: Add admin check here
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this course');
  }

  // Validate category if provided
  if (updateBody.category_id) {
    const Category = require('../models/category.model').Category;
    const category = await Category.findById(updateBody.category_id);
    if (!category) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid category');
    }
  }

  Object.assign(course, updateBody);
  await course.save();
  return course;
};

/**
 * Delete course by id
 * @param {ObjectId} courseId
 * @param {ObjectId} userId - User making the delete request
 * @returns {Promise<Course>}
 */
const deleteCourseByIdWithAuth = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if user is the instructor or admin
  if (String(course.instructor_id) !== String(userId)) {
    // TODO: Add admin check here
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete this course');
  }

  // Delete all associated modules and lessons
  const modules = await Module.find({ course_id: courseId });
  for (const mod of modules) {
    const lessons = await Lesson.find({ module_id: mod._id });
    for (const lesson of lessons) {
      await deleteLessonById(lesson._id, false);
    }
    await mod.deleteOne();
  }

  await course.deleteOne();
  return course;
};

/**
 * Get courses by instructor
 * @param {ObjectId} instructorId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getCoursesByInstructor = async (instructorId, options = {}) => {
  const filter = { instructor_id: instructorId };
  return queryCourses(filter, options);
};

/**
 * Get courses by category
 * @param {ObjectId} categoryId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getCoursesByCategory = async (categoryId, options = {}) => {
  const filter = { category_id: categoryId };
  return queryCourses(filter, options);
};

/**
 * Get featured courses
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getFeaturedCourses = async (options = {}) => {
  const filter = { is_published: true };
  const featuredOptions = { ...options, sortBy: 'rating:desc' };
  return queryCourses(filter, featuredOptions);
};

/**
 * Get published courses
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getPublishedCourses = async (options = {}) => {
  const filter = { is_published: true };
  return queryCourses(filter, options);
};

/**
 * Publish course
 * @param {ObjectId} courseId
 * @param {ObjectId} userId - User making the request
 * @returns {Promise<Course>}
 */
const publishCourse = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  if (String(course.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to publish this course');
  }

  course.is_published = true;
  await course.save();
  return course;
};

/**
 * Unpublish course
 * @param {ObjectId} courseId
 * @param {ObjectId} userId - User making the request
 * @returns {Promise<Course>}
 */
const unpublishCourse = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  if (String(course.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to unpublish this course');
  }

  course.is_published = false;
  await course.save();
  return course;
};

/**
 * Get course statistics
 * @returns {Promise<Object>}
 */
const getCourseStats = async () => {
  const totalCourses = await Course.countDocuments();
  const publishedCourses = await Course.countDocuments({ is_published: true });
  const unpublishedCourses = totalCourses - publishedCourses;

  const categoryStats = await Course.aggregate([
    { $group: { _id: '$category_id', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  const levelStats = await Course.aggregate([{ $group: { _id: '$level', count: { $sum: 1 } } }]);

  return {
    totalCourses,
    publishedCourses,
    unpublishedCourses,
    categoryStats,
    levelStats,
  };
};

/**
 * Update course rating
 * @param {ObjectId} courseId
 * @param {number} newRating
 * @returns {Promise<Course>}
 */
const updateCourseRating = async (courseId, newRating) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Calculate new average rating
  const currentTotal = course.rating * course.totalRatings;
  course.totalRatings += 1;
  course.rating = (currentTotal + newRating) / course.totalRatings;

  await course.save();
  return course;
};

/**
 * Update course image URL
 * @param {ObjectId} courseId
 * @param {string} imageURL
 * @returns {Promise<Course>}
 */
const updateCourseImageURL = async (courseId, imageURL) => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  course.imageURL = imageURL;
  await course.save();
  return course;
};

/**
 * Search courses
 * @param {Object} query - Search query
 * @returns {Promise<QueryResult>}
 */
const searchCourses = async (query) => {
  const filter = {};

  if (query.q) {
    filter.$or = [
      { title: { $regex: query.q, $options: 'i' } },
      { description: { $regex: query.q, $options: 'i' } },
      { tags: { $in: [new RegExp(query.q, 'i')] } },
    ];
  }

  if (query.level) filter.level = query.level;
  if (query.category_id) filter.category_id = query.category_id;
  if (query.min_price || query.max_price) {
    filter['pricing.price'] = {};
    if (query.min_price) filter['pricing.price'].$gte = query.min_price;
    if (query.max_price) filter['pricing.price'].$lte = query.max_price;
  }

  const options = {
    sortBy: query.sortBy || 'rating:desc',
    limit: query.limit || 20,
    page: query.page || 1,
  };

  return queryCourses(filter, options);
};

/**
 * Get course modules
 * @param {ObjectId} courseId
 * @returns {Promise<Module[]>}
 */
const getCourseModules = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  return Module.find({ course_id: courseId }).populate('lesson_ids', 'title type is_preview').sort('created_at');
};

/**
 * Get course overview for enrolled students
 * @param {ObjectId} courseId
 * @param {ObjectId} userId
 * @returns {Promise<Object>}
 */
const getCourseOverview = async (courseId, userId) => {
  const course = await Course.findById(courseId).populate('instructor_id', 'name email').populate('category_id', 'name');

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if user is enrolled
  const Enrollment = require('../models/enrollment.model').Enrollment;
  const enrollment = await Enrollment.findOne({ user_id: userId, course_id: courseId });

  if (!enrollment) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User is not enrolled in this course');
  }

  const modules = await Module.find({ course_id: courseId })
    .populate({
      path: 'lesson_ids',
      select: 'title type is_preview',
      populate: {
        path: 'resource_id',
        select: 'duration content_html settings',
      },
    })
    .sort('created_at');

  return {
    course,
    enrollment,
    modules,
  };
};

module.exports = {
  createCourse,
  queryCourses,
  getCourseById,
  getCourseBySlug,
  updateCourseById,
  updateCourseByIdWithAuth,
  updateCourseImageURL,
  deleteCourseById,
  deleteCourseByIdWithAuth,
  getCoursesByInstructor,
  getCoursesByCategory,
  getFeaturedCourses,
  getPublishedCourses,
  publishCourse,
  unpublishCourse,
  getCourseStats,
  updateCourseRating,
  searchCourses,
  getCourseModules,
  getCourseOverview,
  // Keep existing methods for backward compatibility
  createModule,
  createLesson,
  createQuestionForQuiz,
  listCourses,
  getCourseWithModules,
  getModulesByCourse,
  getLessonsByModule,
  getLessonDetail,
  getQuizQuestions,
};
