const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSections = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }

    // Create new section
    const newSection = await Section.create({ sectionName });

    // Add section to course
    await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { courseContent: newSection._id } },
      { new: true }
    );

    // Fetch updated course with populated content
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Return updated course
    return res.status(201).json({
      success: true,
      message: "Section created and course updated",
      updatedCourse, // 
    });
  } catch (error) {
    console.error("Error creating section:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the section",
      error: error.message,
    });
  }
};

exports.updateSections = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;

    // Validate input
    if (!sectionName || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: sectionName, sectionId, courseId",
      });
    }

    // Update the section name
    await Section.findByIdAndUpdate(
      sectionId,
      { sectionName: sectionName },
      { new: true }
    );

    // Fetch updated course with populated sections and subsections
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
      message: "Section updated successfully",
      updatedCourse, // ✅ Important for frontend Redux update
    });
  } catch (error) {
    console.error("Error updating section:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the section",
      error: error.message,
    });
  }
};


exports.deleteSections = async (req, res) => {
  try {
    const { courseId, sectionId } = req.body;

    // Validate input
    if (!courseId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Both courseId and sectionId are required",
      });
    }

    // 1. Find section and delete all its subsections
    const section = await Section.findById(sectionId);
    if (section?.subSection?.length > 0) {
      await SubSection.deleteMany({ _id: { $in: section.subSection } });
    }

    // 2. Remove section reference from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });

    // 3. Delete the section itself
    await Section.findByIdAndDelete(sectionId);

    // 4. Fetch updated course with populated courseContent and subSections
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      });

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      updatedCourse, // ✅ Required for frontend Redux update
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the section",
      error: error.message,
    });
  }
};
