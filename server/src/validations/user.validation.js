const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('student', 'admin'),
    is_active: Joi.boolean(),
    imageURL: Joi.string().uri().allow('', null),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    role: Joi.string().valid('student', 'admin'),
    is_active: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      role: Joi.string().valid('student', 'admin'),
      is_active: Joi.boolean(),
      isEmailVerified: Joi.boolean(),
      imageURL: Joi.string().uri().allow('', null),
    })
    .min(1),
};

const updateCurrentUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      imageURL: Joi.string().uri().allow('', null),
    })
    .min(1),
};

const updateUserWallet = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    balance: Joi.number().min(0),
    currency: Joi.string(),
    is_active: Joi.boolean(),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const toggleUserStatus = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateCurrentUser,
  updateUserWallet,
  deleteUser,
  toggleUserStatus,
};
