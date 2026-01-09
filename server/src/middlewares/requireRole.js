const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

/**
 * Middleware đăng nhập + (tuỳ chọn) kiểm tra role.
 * - Nếu không truyền allowedRoles: chỉ cần user đăng nhập (giống requireLogin)
 * - Nếu truyền allowedRoles: user phải đăng nhập và có role thuộc danh sách
 *
 * @param {string[]} allowedRoles - ví dụ: ['admin', 'student']
 */
const requireRole =
  (allowedRoles = []) =>
  (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err || info || !user) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
      }

      req.user = user;

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }

      return next();
    })(req, res, next);
  };

module.exports = requireRole;
