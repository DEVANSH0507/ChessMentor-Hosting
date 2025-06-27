//IMPORT

const express= require("express")
const router = express.Router();

//IMPORT CONTROLLERS

const{
    createCourse,
    getAllCourse,
    getCourseDetails,
    editCourseDetails,
    getInstructorCourses,
    deleteCourse,
    markLectureAsComplete,
    searchCourse,
    getFullCourseDetails,
}= require("../controllers/Courses")


//categories contoll import

const {
    showAllCategories,
    createCategory,
    categoryPageDetails,
    addCourseToCategory
}= require("../controllers/Category")

//sections imports

const{
    createSections,
    updateSections,
    deleteSections,
} = require("../controllers/Section")

//subsections imports
const{
    updateSubSections,
    deleteSubSections,
    createSubSections,
} = require("../controllers/SubSection")

//Rating controller import

const {
    createRating,
    getAverageRating,
    getAllRating,
} = require("../controllers/RatingAndReviews")

//IMPORTING MIDDLEWARES

const {auth,isInstructor,isStudent,isAdmin} = require("../middlewares/auth") 

                     // COURSE ROUTES

router.post("/createCourse",auth,isInstructor,createCourse)  //checked
router.delete("/deleteCourse/:courseId",auth, isInstructor, deleteCourse);
// Search Courses
router.post("/searchCourse", searchCourse);
//mark lecture as complete
router.post("/updateCourseProgress", auth, isStudent, markLectureAsComplete);
//Get full course details
router.post("/getFullCourseDetails", auth, getFullCourseDetails)


router.post("/addSection",auth,isInstructor,createSections) //checked
router.post("/updateSection",auth,isInstructor,updateSections) //checked
router.post("/deleteSection",auth,isInstructor,deleteSections) //checked

router.post("/updateSubSection",auth,isInstructor,updateSubSections)  //checked
router.post("/deleteSubSection",auth,isInstructor,deleteSubSections) //checked
router.post("/addSubSection",auth,isInstructor,createSubSections)   //checked

router.post("/editCourse", auth, isInstructor, editCourseDetails);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.get("/getAllCourses",getAllCourse)   //checked all detail of each course included
router.post("/getCourseDetails",getCourseDetails)  //checked

                      //Category routes

router.post("/createCategory",auth,isAdmin,createCategory) //checked
router.get("/getCategoryPageDetails",categoryPageDetails) //ckecked see top selling later
router.get("/showAllCategories",showAllCategories)   //checked
router.post("/addCourseToCategory",addCourseToCategory)//checked


                    //RATING AND REVIEWS

router.post("/createRating",auth,isStudent,createRating)
router.get("/getAverageRating",getAverageRating)
router.get("/getReviews",getAllRating)

module.exports = router


