const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./config/logger');

const dropIndex = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('Connected to MongoDB');

    const collection = mongoose.connection.collection('users');

    console.log('Checking indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));

    const indexExists = indexes.find((idx) => idx.name === 'username_1');

    if (indexExists) {
      console.log('Found username_1 index. Dropping it...');
      await collection.dropIndex('username_1');
      console.log('Successfully dropped username_1 index');
    } else {
      console.log('username_1 index not found. No action needed.');
    }

    await mongoose.disconnect();
    console.log('Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

dropIndex();
