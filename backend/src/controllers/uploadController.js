const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    return res.status(201).json({
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      },
    });
  } catch (error) {
    console.error("File upload error:", error);

    return res.status(500).json({
      message: "Failed to upload file",
    });
  }
};

module.exports = {
  uploadFile,
};
