const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const config = require('../config/config');

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Multer storage configuration (in memory)
const storage = multer.memoryStorage();

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

// File filter for classroom materials (broader file types)
const materialFileFilter = (req, file, cb) => {
  // Allow documents, images, PDFs, presentations, spreadsheets, etc.
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar|mp4|avi|mov|mp3|wav/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype; // More permissive for materials

  // Allow common MIME types for documents and media
  const allowedMimeTypes = [
    'image/',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed',
    'video/',
    'audio/'
  ];

  const mimeValid = allowedMimeTypes.some(type => mimetype.startsWith(type));

  if ((extname && mimeValid) || mimeValid) {
    return cb(null, true);
  }
  cb(new Error('File type not supported. Please upload documents, images, videos, or audio files.'));
};

// Multer upload configuration for images
const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Multer upload configuration for materials
const uploadMaterial = multer({
  storage,
  fileFilter: materialFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for materials
  },
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Cloudinary folder name
 * @param {string} publicId - Public ID for the image (optional)
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer, folder = 'elearning', publicId) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: 'image',
      quality: 'auto',
      format: 'webp',
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });

    stream.end(buffer);
  });
};

/**
 * Upload material (any file type) to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Cloudinary folder name
 * @param {string} publicId - Public ID for the file (optional)
 * @param {string} resourceType - Resource type ('auto', 'image', 'video', 'raw')
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadMaterialToCloudinary = (buffer, folder = 'elearning/materials', publicId, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: resourceType,
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    // For non-image files, use upload instead of upload_stream
    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }).end(buffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} Cloudinary delete result
 */
const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} Public ID
 */
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  // Extract public ID from URL like: https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/elearning/image.jpg
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
  return matches ? matches[1] : null;
};

module.exports = {
  upload,
  uploadMaterial,
  uploadToCloudinary,
  uploadMaterialToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
};
