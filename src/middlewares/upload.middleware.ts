import multer from "multer";
import path from "path";
import crypto from "crypto";


//----------------------------------//
//        Storage avatar user       //
//----------------------------------//
// Configure où et comment les avatars sont stockés
const avatarStorage = multer.diskStorage({

  // dossier de destination
  destination: (_req, _file, cb) => {
    cb(null, "uploads/users");
  },

  // génération du nom du fichier
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase(); // récupère l'extension (.jpg, .png...)
    const name = crypto.randomUUID(); // génère un nom unique
    cb(null, `${name}${ext}`); // combine nom + extension
  }

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
  }

});

//----------------------------------//
//        Types de fichiers         //
//----------------------------------//
// Vérifie que le fichier envoyé est une image autorisée
function fileFilter(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  // si le type n'est pas autorisé → erreur
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("INVALID_FILE_TYPE"));
  }

  // sinon on accepte le fichier
  cb(null, true);
}

//----------------------------------//
//        Upload avatar user        //
//----------------------------------//
// Middleware utilisé pour l'upload de l'avatar d'un utilisateur
export const uploadAvatar = multer({

  storage: avatarStorage,
  fileFilter,

  // limite taille fichier : 2MB
  limits: { fileSize: 2 * 1024 * 1024 }

}).single("avatar");


//----------------------------------//
//      Upload image article        //
//----------------------------------//
export const uploadArticleImage = multer({

  storage: articleImageStorage,
  fileFilter,

  limits: { fileSize: 2 * 1024 * 1024 }

}).single("image");