const httpStatus = require('http-status');
const { Message } = require('../models');
const ApiError = require('../utils/ApiError');

const createMessage = async (userId, body) => {
  const message = await Message.create({
    classroom_id: body.classroom_id,
    sender_id: userId,
    content: body.content,
    type: body.type || 'text',
  });
  return message;
};

const queryMessages = async (filter, options) => {
  if (!filter.classroom_id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'classroom_id is required');
  }
  const query = { classroom_id: filter.classroom_id };
  const sort = options.sortBy || 'created_at:asc';
  const limit = options.limit || 20;
  const page = options.page || 1;

  if (Message.paginate) {
    return Message.paginate(query, { sortBy: sort, limit, page });
  }
  const messages = await Message.find(query)
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);
  return { results: messages };
};

const deleteMessageById = async (messageId) => {
  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  await message.deleteOne();
  return message;
};

module.exports = {
  createMessage,
  queryMessages,
  deleteMessageById,
};


