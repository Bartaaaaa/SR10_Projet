const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/')); // Assurez-vous que le chemin est correct
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Conserve l'extension du fichier original
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
