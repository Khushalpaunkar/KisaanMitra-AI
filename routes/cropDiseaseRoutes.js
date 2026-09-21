const express = require("express");

const multer = require("multer");

const {
    getCropDiseasePage,
    analyzeDisease
} = require("../controllers/cropDiseaseController");


const router = express.Router();


// ============================================
// MULTER CONFIGURATION
// ============================================

const upload = multer({

    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only JPG, PNG and WEBP images are allowed."
                )
            );

        }

    }

});


// ============================================
// GET CROP DISEASE PAGE
// ============================================

router.get("/", getCropDiseasePage);


// ============================================
// POST CROP DISEASE ANALYSIS
// ============================================

router.post(
    "/analyze",
    upload.single("cropImage"),
    analyzeDisease
);


module.exports = router;