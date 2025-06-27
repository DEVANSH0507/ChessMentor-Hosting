const cloudinary = require("cloudinary").v2;

exports.deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (err) {
    console.error("Error deleting video from Cloudinary:", err);
  }
};
