const User = require("../models/User");
const Profile=require("../models/Profile");
const Course = require("../models/Course");
const {uploadImageToCloudinary} = require("../utils/imageUploader")

exports.updateProfile = async (req, res) => {
	try {
		const { dateOfBirth = "", about = "", contactNumber="",firstName,lastName,gender="" } = req.body;
		const id = req.user.id;

		// Find the profile by id
		const userDetails = await User.findById(id);
		const profile = await Profile.findById(userDetails.additionalDetails);

		// Update the profile fields
		userDetails.firstName = firstName || userDetails.firstName;
		userDetails.lastName = lastName || userDetails.lastName;
		profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
		profile.about = about || profile.about;
		profile.gender=gender || profile.gender;
		profile.contactNumber = contactNumber || profile.contactNumber;

		// Save the updated profile
		await profile.save();
		await userDetails.save();

		return res.json({
			success: true,
			message: "Profile updated successfully",
			profile,
			userDetails
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};


exports.deleteProfile = async (req, res) => {
  try {
    // 1. Get user id from req.user (assuming user is authenticated and user info is populated)
    const id = req.user.id;

    // 2. Find the user by id
    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "Invalid user id",
      });
    }

    // 3. Delete the related profile (assuming profile model is AdditionalDetails)
    // You need to import the model for additionalDetails, example:
    // const AdditionalDetails = require('../models/AdditionalDetails');
    const profileId = userDetails.additionalDetails;
    if (profileId) {
      await Profile.findByIdAndDelete(profileId);
    }

    // 4. Delete the user
    await User.findByIdAndDelete(id);

    // 5. Unenroll student from all courses
    // Assuming the Course model has a 'studentEnrolled' array and you want to remove this user from all courses
    // So you update all courses to pull this user id from studentEnrolled array
    await Course.updateMany(
      { studentEnrolled: id },
      { $pull: { studentEnrolled: id } }
    );

    // 6. Return success response
    return res.status(200).json({
      success: true,
      message: "User and profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the user",
      error: error.message,
    });
  }
};


exports.getAllUserDetails = async(req,res) =>{
    try {
        
        //fetch id
        const id= req?.user?.id;

        //validate and get all details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        //return response
        return res.status(200).json({
            success:true,
            userDetails,
            message:"All data of user retrieved"
        });

    } catch (error) {
        console.error("Error creating course:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve data of user",
            error: error.message,
        });
    }
};

exports.updateDisplayPicture = async(req,res) =>{
   try {

	const id = req.user.id;

	const user = await User.findById(id);
      

	if (!user) {
		return res.status(404).json({
            success: false,
            message: "User not found",
        });
	}

	const image = req.files.displayPicture;
  

	if (!image) {
		return res.status(404).json({
            success: false,
            message: "Image not found",
        });
    }

	const uploadDetails = await uploadImageToCloudinary(
		image,
		process.env.FOLDER_NAME
	);

	console.log(uploadDetails);

	const updatedImage = await User.findByIdAndUpdate({_id:id},{image:uploadDetails.secure_url},{ new: true });

    res.status(200).json({
        success: true,
        message: "Image updated successfully",
        data: updatedImage,
    });
		
	} catch (error) {
		return res.status(500).json({
            success: false,
            message: error.message,
        });
		
	}

};

exports.instructorDashboard = async (req, res) => {
	try {
		const id = req.user.id;
		const courseData = await Course.find({instructor:id});
		const courseDetails = courseData.map((course) => {
			totalStudents = course?.studentsEnrolled?.length;
			totalRevenue = course?.price * totalStudents;
			const courseStats = {
				_id: course._id,
				courseName: course.courseName,
				courseDescription: course.courseDescription,
				totalStudents,
				totalRevenue,
			};
			return courseStats;
		});
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: courseDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

//change all from here
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: "courses", // ✅ correct path
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .populate("courseProgress")
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: user.courses, // ✅ use the correct field
      courseProgress: user.courseProgress,
    });
  } catch (error) {
    console.error("Error in getEnrolledCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

