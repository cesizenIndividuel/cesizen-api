import multer from "multer";
import path from "path";
import crypto from "crypto";

//----------------------------------//
//        Storage avatar user       //
//----------------------------------//
const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/users");
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomUUID();
    cb(null, `${name}${ext}`);
  },
});

//----------------------------------//
//      Storage image article       //
//----------------------------------//
const articleImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/articles");
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomUUID();
    cb(null, `${name}${ext}`);
  },
});

//----------------------------------//
//  Storage image contenu article   //
//----------------------------------//
const articleContentImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/articles/content");
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomUUID();
    cb(null, `${name}${ext}`);
  },
});

//----------------------------------//
//        Types de fichiers         //
//----------------------------------//
function fileFilter(
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("INVALID_FILE_TYPE"));
  }

  cb(null, true);
}

//----------------------------------//
//        Upload avatar user        //
//----------------------------------//
export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("avatar");

//----------------------------------//
//      Upload image article        //
//----------------------------------//
export const uploadArticleImage = multer({
  storage: articleImageStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");

//----------------------------------//
//  Upload image contenu article    //
//----------------------------------//
export const uploadArticleContentImage = multer({
  storage: articleContentImageStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");
