import multer from "multer";

const storage = multer.diskStorage({ // Store files on disk
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); // Directory where files will be stored
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Generate a unique suffix for the filename
        cb(null, file.originalname); // Unique filename
    }
});

export const upload = multer({ 
    storage,
 }); // Create a multer instance with the defined storage