const httpStatus = require('http-status');
const { Message, Classroom, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a message
 * @param {ObjectId} userId - User sending the message
 * @param {Object} messageBody
 * @returns {Promise<Message>}
 */
const createMessage = async (userId, messageBody) => {
  // Verify classroom exists and user is a member
  const classroom = await Classroom.findById(messageBody.classroom_id);
  if (!classroom) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Classroom not found');
  }

  // Check if user is a member of the classroom
  const isMember = classroom.members.some((member) => String(member.user_id) === String(userId));

  if (!isMember) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User is not a member of this classroom');
  }

  const message = await Message.create({
    classroom_id: messageBody.classroom_id,
    sender_id: userId,
    content: messageBody.content,
    type: messageBody.type || 'text',
  });

  return message;
};

/**
 * Query for messages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {Object} currentUser - User making the request
 * @returns {Promise<QueryResult>}
 */
const queryMessages = async (filter, options, currentUser) => {
  // If no classroom_id provided, get messages from all classrooms user belongs to
  let query = {};

  if (filter.classroom_id) {
    // Verify user has access to this classroom
    const classroom = await Classroom.findById(filter.classroom_id);
    if (!classroom) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
    }

    const isMember = classroom.members.some((member) => String(member.user_id) === String(currentUser._id));
    const isAdmin = currentUser.role === 'admin';

    if (!isMember && !isAdmin) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access messages in this classroom');
    }

    query.classroom_id = filter.classroom_id;
  } else {
    // Get all classrooms user belongs to
    const userClassrooms = await Classroom.find({
      members: { $elemMatch: { user_id: currentUser._id } },
    }).select('_id');

    const classroomIds = userClassrooms.map((c) => c._id);
    query.classroom_id = { $in: classroomIds };
  }

  if (filter.type) {
    query.type = filter.type;
  }
  if (filter.sender_id) {
    query.sender_id = filter.sender_id;
  }
  if (filter.date_from) {
    query.created_at = { ...query.created_at, $gte: new Date(filter.date_from) };
  }
  if (filter.date_to) {
    query.created_at = { ...query.created_at, $lte: new Date(filter.date_to) };
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 20;
  const page = options.page || 1;

  if (Message.paginate) {
    return Message.paginate(query, {
      sortBy: sort,
      limit,
      page,
      populate: [
        { path: 'sender_id', select: 'name email' },
        { path: 'classroom_id', select: 'name' },
      ],
    });
  }

  const messages = await Message.find(query)
    .populate('sender_id', 'name email')
    .populate('classroom_id', 'name')
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);

  return { results: messages };
};

/**
 * Get message by id
 * @param {ObjectId} messageId
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Message>}
 */
const getMessageById = async (messageId, currentUser) => {
  const message = await Message.findById(messageId).populate('sender_id', 'name email').populate('classroom_id', 'name');

  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }

  // Check if user has access to the classroom
  const classroom = await Classroom.findById(message.classroom_id._id);
  const isMember = classroom.members.some((member) => String(member.user_id) === String(currentUser._id));
  const isAdmin = currentUser.role === 'admin';

  if (!isMember && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this message');
  }

  return message;
};

/**
 * Update message by id
 * @param {ObjectId} messageId
 * @param {Object} updateBody
 * @param {Object} currentUser - User making the update
 * @returns {Promise<Message>}
 */
const updateMessageById = async (messageId, updateBody, currentUser) => {
  const message = await Message.findById(messageId).populate('classroom_id');
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }

  // Only message sender can update their message
  if (String(message.sender_id) !== String(currentUser._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this message');
  }

  // Only allow updating content
  if (updateBody.content !== undefined) {
    message.content = updateBody.content;
    await message.save();
  }

  return message;
};

/**
 * Delete message by id
 * @param {ObjectId} messageId
 * @param {Object} currentUser - User making the delete request
 * @returns {Promise<Message>}
 */
const deleteMessageById = async (messageId, currentUser) => {
  const message = await Message.findById(messageId).populate('classroom_id');
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }

  // Check authorization: message sender or classroom admin
  const isSender = String(message.sender_id) === String(currentUser._id);
  const classroom = message.classroom_id;
  const isAdmin =
    currentUser.role === 'admin' ||
    classroom.members.some((member) => String(member.user_id) === String(currentUser._id) && member.role === 'admin');

  if (!isSender && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete this message');
  }

  await message.deleteOne();
  return message;
};

/**
 * Get messages by classroom
 * @param {ObjectId} classroomId
 * @param {Object} currentUser - User making the request
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getMessagesByClassroom = async (classroomId, currentUser, options = {}) => {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  // Check if user is a member
  const isMember = classroom.members.some((member) => String(member.user_id) === String(currentUser._id));
  const isAdmin = currentUser.role === 'admin';

  if (!isMember && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access messages in this classroom');
  }

  const filter = { classroom_id: classroomId };
  const queryOptions = {
    sortBy: options.sortBy || 'created_at:desc',
    limit: options.limit || 50,
    page: options.page || 1,
  };

  return queryMessages(filter, queryOptions, currentUser);
};

/**
 * Get messages by sender
 * @param {ObjectId} senderId
 * @param {Object} currentUser - User making the request
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getMessagesBySender = async (senderId, currentUser, options = {}) => {
  // Check authorization
  const isSelf = String(senderId) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isSelf && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to view messages from this sender');
  }

  const filter = { sender_id: senderId };
  const queryOptions = {
    sortBy: options.sortBy || 'created_at:desc',
    limit: options.limit || 20,
    page: options.page || 1,
  };

  return queryMessages(filter, queryOptions, currentUser);
};

/**
 * Search messages
 * @param {Object} query - Search query
 * @param {Object} currentUser - User making the request
 * @returns {Promise<QueryResult>}
 */
const searchMessages = async (query, currentUser) => {
  const filter = {};

  if (query.q) {
    filter.content = { $regex: query.q, $options: 'i' };
  }

  if (query.classroom_id) {
    filter.classroom_id = query.classroom_id;
  }

  if (query.type) {
    filter.type = query.type;
  }

  const options = {
    sortBy: query.sortBy || 'created_at:desc',
    limit: query.limit || 20,
    page: query.page || 1,
  };

  return queryMessages(filter, options, currentUser);
};

/**
 * Mark messages as read
 * @param {Array<ObjectId>} messageIds - Message IDs to mark as read
 * @param {ObjectId} userId - User marking messages as read
 * @returns {Promise<Object>}
 */
const markMessagesAsRead = async (messageIds, userId) => {
  // In a real implementation, you might have a separate read status collection
  // For now, we'll just return a success response
  // This would typically update a read status or last read timestamp

  return {
    success: true,
    message: 'Messages marked as read',
    count: messageIds.length,
  };
};

/**
 * Get message statistics
 * @returns {Promise<Object>}
 */
const getMessageStats = async () => {
  const totalMessages = await Message.countDocuments();

  const messagesByType = await Message.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);

  const messagesByClassroom = await Message.aggregate([
    {
      $group: {
        _id: '$classroom_id',
        count: { $sum: 1 },
        latestMessage: { $max: '$created_at' },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const messagesByMonth = await Message.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$created_at' },
          month: { $month: '$created_at' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  return {
    totalMessages,
    messagesByType,
    messagesByClassroom,
    messagesByMonth,
  };
};

module.exports = {
  createMessage,
  queryMessages,
  getMessageById,
  updateMessageById,
  deleteMessageById,
  getMessagesByClassroom,
  getMessagesBySender,
  searchMessages,
  markMessagesAsRead,
  getMessageStats,
};
