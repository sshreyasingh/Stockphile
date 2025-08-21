// const multer = require('multer');

// // Use memory storage to get access to file.buffer (required for Supabase upload)
// const upload = multer({ storage: multer.memoryStorage() });

// module.exports = upload;

// config/multer.js
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
module.exports = upload;
