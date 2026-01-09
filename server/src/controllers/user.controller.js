const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

/**
 * Create a user
 * @route POST /api/v1/users
 * @access Private (Admin only)
 */
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

/**
 * Query users
 * @route GET /api/v1/users
 * @access Private (Admin only)
 */
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'email', 'role', 'is_active']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

/**
 * Get user by ID
 * @route GET /api/v1/users/:userId
 * @access Private (Admin or own profile)
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

/**
 * Get current user profile
 * @route GET /api/v1/users/profile/me
 * @access Private
 */
const getCurrentUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

/**
 * Update user by ID
 * @route PATCH /api/v1/users/:userId
 * @access Private (Admin or own profile)
 */
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

/**
 * Update current user profile
 * @route PATCH /api/v1/users/profile/me
 * @access Private
 */
const updateCurrentUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user._id, req.body);
  res.send(user);
});

/**
 * Update user wallet balance
 * @route PATCH /api/v1/users/:userId/wallet
 * @access Private (Admin only)
 */
const updateUserWallet = catchAsync(async (req, res) => {
  const user = await userService.updateUserWallet(req.params.userId, req.body);
  res.send(user);
});

/**
 * Delete user by ID
 * @route DELETE /api/v1/users/:userId
 * @access Private (Admin only)
 */
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get user statistics
 * @route GET /api/v1/users/stats
 * @access Private (Admin only)
 */
const getUserStats = catchAsync(async (req, res) => {
  const stats = await userService.getUserStats();
  res.send(stats);
});

/**
 * Toggle user active status
 * @route PATCH /api/v1/users/:userId/toggle-status
 * @access Private (Admin only)
 */
const toggleUserStatus = catchAsync(async (req, res) => {
  const user = await userService.toggleUserStatus(req.params.userId);
  res.send(user);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateCurrentUser,
  updateUserWallet,
  deleteUser,
  getUserStats,
  toggleUserStatus,
};
