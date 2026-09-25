const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(
    filePath,
    {
      folder: "Sahayra"
    }
  );

  return {
    url: result.secure_url,
    publicId: result.public_id
  };
};

module.exports = uploadToCloudinary;