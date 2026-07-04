const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
const resumesDir = path.join(uploadDir, 'resumes');
const profilesDir = path.join(uploadDir, 'profiles');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir, { recursive: true });
if (!fs.existsSync(profilesDir)) fs.mkdirSync(profilesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      cb(null, resumesDir);
    } else if (file.fieldname === 'profileImage' || file.fieldname === 'companyLogo') {
      cb(null, profilesDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type! Only PDF resumes are supported.'), false);
    }
  } else if (file.fieldname === 'profileImage' || file.fieldname === 'companyLogo') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type! Only image files are supported.'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
