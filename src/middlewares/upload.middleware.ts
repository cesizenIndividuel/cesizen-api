import multer from "multer";
import path from "path";
import crypto from "crypto";

//Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/users"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase(); //.jpg ou .png
    const name = crypto.randomUUID(); //génère un nom unique
    cb(null, `${name}${ext}`); // combine les 2
  }
});

//type de fichier autorisé
function fileFilter(req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("INVALID_FILE_TYPE"));
  }
  cb(null, true);
}

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}).single("avatar");
