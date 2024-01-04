/** ------------------ IMPORTING PACKAGE ------------------ **/
const express = require('express');
const router = express.Router();
const multer = require('multer');

/** ------------------ IMPORTING CONTROLLERS ------------------ **/
const homeController = require('../controllers/home_controller');
const fileController = require('../controllers/file_controller');

/** ------------------ CONFIGURING STORAGE ------------------ **/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/files');
  },
  filename: function (req, file, cb) {
    //console.log(file);
    const uniqueSuffix = Date.now();
    cb(null, file.originalname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

/** ------------------ MAKING ROUTES ------------------ **/
router.get('/', homeController.home);

// Apply Multer middleware only to the /upload route
router.post('/upload', upload.single('csvfile'), fileController.upload);

router.get('/view/:id', fileController.view);
router.get('/delete/:id', fileController.delete);

/** ------------------ EXPORTING ROUTER ------------------ **/
module.exports = router;
