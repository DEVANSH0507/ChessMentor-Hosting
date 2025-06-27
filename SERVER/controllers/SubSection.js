const SubSection =require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary} =require("../utils/imageUploader");
const Course = require("../models/Course");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//create subsection

exports.createSubSections = async (req, res) => {
  try {
    const { sectionId, title, description, courseId } = req.body;
    const video = req.files.videoFile;

    if (!sectionId || !title || !description || !video || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const subSection = await SubSection.create({
      title,
      timeDuration: "00:00", // Optional dummy or computed later
      description,
      videoUrl: uploadDetails.secure_url,
      videoPublicId: uploadDetails.public_id,
    });

    await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSection._id } },
      { new: true }
    );

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Sub-section created successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error creating sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the sub-section",
      error: error.message,
    });
  }
};



exports.updateSubSections = async (req, res) => {
  try {
    const { subSectionId, title, timeDuration, description } = req.body;
    const video = req.files?.videoFile;

    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID is required",
      });
    }

    const updatedData = {};
    if (title) updatedData.title = title;
    if (timeDuration) updatedData.timeDuration = timeDuration;
    if (description) updatedData.description = description;

    // Handle video update
    if (video) {
      const subSection = await SubSection.findById(subSectionId);
      if (!subSection) {
        return res.status(404).json({ success: false, message: "SubSection not found" });
      }

      // Delete old video if present
      if (subSection.videoPublicId) {
        await cloudinary.uploader.destroy(subSection.videoPublicId, {
          resource_type: "video",
        });
      }

      // Upload new video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME,
        "video"
      );

      updatedData.videoUrl = uploadDetails.secure_url;
      updatedData.videoPublicId = uploadDetails.public_id;
    }

    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      updatedData,
      { new: true }
    );

    if (!updatedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // Optional: return full updated section (for frontend refresh)
    const parentSection = await Section.findOne({ subSection: subSectionId }).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      updatedSubSection,
      parentSection,
    });

  } catch (error) {
    console.error("Error updating subsection:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the subsection",
      error: error.message,
    });
  }
};


exports.deleteSubSections = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;

        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "SubSection ID and Section ID are required",
            });
        }

        // Remove SubSection from Section
        await Section.findByIdAndUpdate(sectionId, {
            $pull: { subSection: subSectionId }
        });

        // Delete SubSection
        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        // Delete video from Cloudinary
        if (deletedSubSection.videoPublicId) {
            await cloudinary.uploader.destroy(deletedSubSection.videoPublicId, {
                resource_type: "video",
            });
        }

        // Fetch updated section with populated subSections
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            updatedSection,
        });

    } catch (error) {
        console.error("Error deleting subsection:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the subsection",
            error: error.message,
        });
    }
};
