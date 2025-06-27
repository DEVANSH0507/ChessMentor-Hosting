const Category = require("../models/Category");
const Course = require("../models/Course");
const mongoose = require("mongoose");

exports.createCategory = async(req,res) => {
   
    try {

         //fetch data
    const {name,description}=req.body;
   
    //check data
    if(!name || !description)
    {
      return res.status(400).json(
        {
            success:false,
            message:"All fields required"
        }
      );
    }

   //update db
    const categoryDetails = await Category.create(
        {
            name:name,
            description:description,
        }
    );

    console.log(categoryDetails);

    //return response
    return res.status(200).json({
        success:true,
        message:"Category created successfully",
    });
    } catch (error) {
        console.log(error);
        return res.status(200).json(
            {
                success:false,
                message:"error in creating Category",
            }
        )
    }

};

exports.showAllCategories = async (req, res) => {
    try {
      const allCategories = await Category.find({}, {
        name: true,
        description: true,
      });
  
      res.status(200).json({
        success: true,
        message: "All categories retrieved successfully",
        categories: allCategories,
      });
    } catch (error) {
        console.log(error);
      return res.status(500).json({
        success: false,
        message: "Unable to show all Categories",
        error: error.message,
      });
    }
};



exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.query; // ✅ works for GET query params

    console.log(categoryId);
    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Valid categoryId is required",
      });
    }

    

    // Get selected category with published courses
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "course",
        //match: { status: "Published" },
        populate: [
          { path: "instructor" },
          { path: "ratingAndReviews" }
        ]
      })
      .exec();

console.log("Selected category:", selectedCategory?.name || categoryId);
console.log("Published course count:", selectedCategory?.course?.length || 0);


    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!selectedCategory.course || selectedCategory.course.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published courses found in this category",
      });
    }

    // Fetch other categories with published courses
    const differentCategories = await Category.find({ _id: { $ne: categoryId } })
      .populate({
        path: "course",
       // match: { status: "Published" },
        populate: [
          { path: "instructor" },
          { path: "ratingAndReviews" }
        ]
      });

    const differentCourses = differentCategories.flatMap(cat => cat.course);

    // Top 10 selling published courses
    const topSellingCourses = await Course.find({ status: "Published" })
      .sort({ enrolledStudent: -1 })
      .limit(10)
      .populate("instructor ratingAndReviews");

    // Send final structured response
    return res.status(200).json({
      success: true,
      message: "courses for category retrieved",
      selectedCourses: selectedCategory.course,
      differentCourses: differentCourses,
      mostSellingCourses: topSellingCourses,
    });

  } catch (error) {
    console.error("Error fetching category page details:", error);
    return res.status(500).json({
      success: false,
      message: "courses for category can not be retrieved",
      error: error.message,
    });
  }
};


//CHANGE

exports.addCourseToCategory = async (req, res) => {
  try {
    const { categoryId, courseId } = req.body;

    // Validate input
    if (!categoryId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Category ID and Course ID are required",
      });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Add course to category if not already added
    if (!category.course.includes(courseId)) {
      category.course.push(courseId);
      await category.save();
    }

    // Optional: Add category to course model (if your schema has a category field)
    if (!Course.category || Course.category.toString() !== categoryId) {
      Course.category = categoryId;
      await course.save();
    }

    return res.status(200).json({
      success: true,
      message: "Course added to category successfully",
      category,
    });
  } catch (error) {
    console.error("Error adding course to category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while adding course to category",
      error: error.message,
    });
  }
};


