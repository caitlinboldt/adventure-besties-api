const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const crypto = require("crypto");

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDKEY,
  api_secret: process.env.CLOUDSECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "adventure-besties-trips", // The name of the folder in cloudinary.
    format: async (req, file) => "jpg",
    public_id: (req, file) => crypto.randomBytes(10).toString("hex"),
  },
});

const uploadCloud = multer({ storage: storage });

module.exports = uploadCloud;
