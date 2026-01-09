const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const categoryRoute = require('./category.route');
const courseRoute = require('./course.route');
const moduleRoute = require('./module.route');
const lessonRoute = require('./lesson.route');
const questionRoute = require('./question.route');
const orderRoute = require('./order.route');
const transactionRoute = require('./transaction.route');
const enrollmentRoute = require('./enrollment.route');
const attemptRoute = require('./attempt.route');
const classroomRoute = require('./classroom.route');
const messageRoute = require('./message.route');
const notificationRoute = require('./notification.route');
const uploadRoute = require('./upload.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/courses',
    route: courseRoute,
  },
  {
    path: '/modules',
    route: moduleRoute,
  },
  {
    path: '/lessons',
    route: lessonRoute,
  },
  {
    path: '/questions',
    route: questionRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/transactions',
    route: transactionRoute,
  },
  {
    path: '/enrollments',
    route: enrollmentRoute,
  },
  {
    path: '/attempts',
    route: attemptRoute,
  },
  {
    path: '/classrooms',
    route: classroomRoute,
  },
  {
    path: '/messages',
    route: messageRoute,
  },
  {
    path: '/notifications',
    route: notificationRoute,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
