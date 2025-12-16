const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().required().custom(objectId),
  }),
};

const updateModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
    })
    .min(1),
};

const deleteModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getModule,
  updateModule,
  deleteModule,
};



