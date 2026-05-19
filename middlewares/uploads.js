const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const createdFolders = new Set();

const ensureFolder = (uploadPath) => {
  if (!createdFolders.has(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    createdFolders.add(uploadPath);
  }
};

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP images are allowed"));
  }
};

const createStorage = (folder) => {
  const uploadPath = path.join(__dirname, `/public/uploads/${folder}`);

  return multer.diskStorage({
    destination: (req, file, cb) => {
      ensureFolder(uploadPath);
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const uniqueName =
        crypto.randomUUID() + path.extname(file.originalname);

      cb(null, uniqueName);
    }
  });
};

const upload = (folder) => {
  return multer({
    storage: createStorage(folder),
    fileFilter,
    limits: {
      fileSize: 3 * 1024 * 1024 // 3MB limit
    }
  });
};

module.exports = upload;