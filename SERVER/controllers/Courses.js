const User=require("../models/User");
const Course=require("../models/Course");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
const Category = require("../models/Category");
const CourseProgress = require("../models/CourseProgress")
const Section = require("../models/Section")
const SubSection=require("../models/SubSection") 
const { deleteFromCloudinary } = require("../utils/cloudinary");

function convertSecondsToDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

function convertSecondsToDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hDisplay = hours > 0 ? `${hours}h ` : "";
  const mDisplay = minutes > 0 ? `${minutes}m ` : "";
  const sDisplay = secs > 0 ? `${secs}s` : "";

  return `${hDisplay}${mDisplay}${sDisplay}`.trim();
}



//create course handler

exports.createCourse = async (req,res)=>
{
  try {
      //fetch data
      const {courseName,
        courseDescription,
        whatYouWillLearn,
        price,
        tag,
        category}=req.body;

      

      //get thumbnail
      const thumbnail=req.files.thumbnailImage;
      
      //validation
      if(!courseName || 
        !courseDescription || 
        !whatYouWillLearn || 
        !price || 
        !tag || 
        !thumbnail||
        !category)
      {
          return res.status(400).json({
              success:false,
              message:"All fields required"
          });
      }
  
      //check for instructor
      const userId=req.user.id;
      const instructorDetails = await User.findById(userId);
      console.log("instructorDetails",instructorDetails);

      //status draft add**??
  
      if(!instructorDetails)
      {
          return res.status(404).json({
              success:false,
              message:"Instructor detail not found"
          });
      }
  
         //check category validity
      const categoryDetails=await Category.findById(category);
      if(!categoryDetails)
      {
          return res.status(404).json({
              success:false,
              message:"Invalid Category"
          });
      }
  
      const thumbnailImage=await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
    );
    console.log(thumbnailImage)

      //create entry for new course
  
      const newCourse = await Course.create(
          {
              courseName,
              courseDescription,
              instructor:instructorDetails._id,
              whatYouWillLearn:whatYouWillLearn,
              price,
              tag:tag,
              category:categoryDetails._id,
              thumbnail:thumbnailImage.secure_url,
          }
      );
  
      //add course to instructor course schema 
  
      await User.findByIdAndUpdate(
          {_id: instructorDetails._id},
          {
              $push:{
                  course:newCourse._id,
              }
          },
         { new:true},
      );
  
      //update Category schema
  
      await Category.findByIdAndUpdate(
          {_id:category},
          {
              $push:{
                  course:newCourse._id,
              }
          },
          { new:true},
      );


      return res.status(200).json({
        success: true,
        message: "Course created successfully",
        data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
        success: false,
        message: "Something went wrong while creating the course",
        error: error.message,
    });
  }
};

exports.getAllCourse = async (req, res) => {
  try {
    const allCourses = await Course.find({})
      .populate("instructor")
      .populate("category")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      });


    //open above to see all details of each course else only courses fetch not details


    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: allCourses,
    });

  } catch (error) {
    console.error("Error fetching all courses:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching courses",
      error: error.message,
    });
  }
};

exports.getCourseDetails = async(req,res) =>{

    try {
        //get id
        const {courseId} = req.body;

        //find course details
        const courseDetails = await Course.findByIdAndUpdate(
            {_id:courseId},)
            .populate(
                {
                    path:"instructor",
                    populate:
                    {
                     path:"additionalDetails",
                    },
                }
            )
            .populate("category")
            // .populate("ratingAndReviews") //there is not rating so it will throw error in testing update later
            .populate(
                {
                    path:"courseContent",
                    populate:
                    {
                        path:"subSection",
                    },
                }
            )

         if(!courseDetails)
         {
            return res.status(400).json({
                status:false,
                message:"Failed to retrieve course details"
            });
         }

          return res.status(200).json({
          success: true, // <- use "success", not "status"
          message: "course details successfully retrieved",
          data: [courseDetails],
         });


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

exports.editCourseDetails = async (req, res) => {
  const { courseId} = req.body;

  if (!courseId ) {
    return res.status(400).json({ success: false, message: "Missing courseId or status" });
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
   // { status },
    { new: true }
  ).populate( /* ... */ );

  return res.status(200).json({
    success: true,
    message: "Course details updated successfully",
    data: updatedCourse,
  });
};

exports.getInstructorCourses = async (req, res) => {
  try {
    // Get instructor ID from token payload
    const userId = req.user.id;

    const instructorCourses = await Course.find({ instructor: userId })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: instructorCourses,
    });
  } catch (error) {
    console.error("GET_INSTRUCTOR_COURSES_ERROR", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch instructor courses",
      error: error.message,
    });
  }
};


exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate course existence
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 1. Delete all subSections' videos from Cloudinary (optional but good practice)
    for (const sectionId of course.courseContent) {
      const section = await Section.findById(sectionId);
      if (section) {
        for (const subSecId of section.subSection) {
          const subSec = await SubSection.findById(subSecId);
          if (subSec?.videoPublicId) {
            await deleteFromCloudinary(subSec.videoPublicId);
          }
          await SubSection.findByIdAndDelete(subSecId);
        }
        await Section.findByIdAndDelete(sectionId);
      }
    }

    // 2. Remove course from instructor's course list
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { courses: course._id },
    });

    // 3. Remove course from its category
    await Category.findByIdAndUpdate(course.category, {
      $pull: { courses: course._id },
    });

    // 4. Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

  //search course by title,description and tags array
  exports.searchCourse = async (req, res) => {
	try {
	  const  { searchQuery }  = req.body
	//   console.log("searchQuery : ", searchQuery)
	  const courses = await Course.find({
		$or: [
		  { courseName: { $regex: searchQuery, $options: "i" } },
		  { courseDescription: { $regex: searchQuery, $options: "i" } },
		  { tag: { $regex: searchQuery, $options: "i" } },
		],
  })
  .populate({
	path: "instructor",  })
  .populate("category")
  .populate("ratingAndReviews")
  .exec();

  return res.status(200).json({
	success: true,
	data: courses,
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}		
}					

//mark lecture as completed
exports.markLectureAsComplete = async (req, res) => {
	const { courseId, subSectionId, userId } = req.body
	if (!courseId || !subSectionId || !userId) {
	  return res.status(400).json({
		success: false,
		message: "Missing required fields",
	  })
	}
	try {
	progressAlreadyExists = await CourseProgress.findOne({
				  userID: userId,
				  courseID: courseId,
				})
	  const completedVideos = progressAlreadyExists.completedVideos
	  if (!completedVideos.includes(subSectionId)) {
		await CourseProgress.findOneAndUpdate(
		  {
			userID: userId,
			courseID: courseId,
		  },
		  {
			$push: { completedVideos: subSectionId },
		  }
		)
	  }else{
		return res.status(400).json({
			success: false,
			message: "Lecture already marked as complete",
		  })
	  }
	  await CourseProgress.findOneAndUpdate(
		{
		  userId: userId,
		  courseID: courseId,
		},
		{
		  completedVideos: completedVideos,
		}
	  )
	return res.status(200).json({
	  success: true,
	  message: "Lecture marked as complete",
	})
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}

}

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found in request",
      });
    }

    const userId = req.user.id;

    console.log("Getting full details for course:", courseId, "user:", userId);

    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Course not found for id: ${courseId}`,
      });
    }

    const courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userID: userId,
    });

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        totalDurationInSeconds += Number(subSection.timeDuration || 0);
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos || [],
      },
    });
  } catch (error) {
    console.error("getFullCourseDetails error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};




