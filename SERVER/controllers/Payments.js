const Course = require("../models/Course");
const mailSender = require("../utils/mailSender");
const User = require("../models/User");
const {instance} = require("../config/razorpay");
const { Mongoose } = require("mongoose");
const {courseEnrollmentEmail}=require("../Templates/courseEnrollmentEmail")
const {paymentSuccess} = require("../Templates/paymentSuccess")
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const CourseProgress =require("../models/CourseProgress");




exports.capturePayment = async(req,res) =>{

    //get user id course id
    const userId = req.user.id;
    const {courseId} = req.body;

    //id Validity check
    if(!courseId)
    {
        return res.json({
            success:false,
            message:" Invalid courseid ",
        })
    };

    //get course details
    let course;

    try {
        
        course = await Course.findById(courseId);

        //valdate
        if(!course)
        {
            return res.json({
                success:false,
                message:"Unable to find source",
            });
        }
         
        //check for user already paid or not

        let uid= new mongoose.Types.ObjectId(userId);

        if(course.studentsEnrolled.includes(uid))
        {
            return res.status(200).json(
                {
                    success:false,
                    message:"Users already enrolled",
                }
            );
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }

    
    //create order

    const amount = course.price;
    const currency="INR";

    const options ={
        amount: amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:courseId,
            userId
        }
    };

    //initaiate paynment 

   try {
    
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    //return response

    return res.status(200).json({
        success:true,
        courseName:course.courseName,
        courseDescription: course.courseDescription,
        thumbnail:course.thumbnail,
        orderId:paymentResponse.id,
        currency:paymentResponse.currency,
        amount:paymentResponse.amount
    });

   } catch (error) {
    console.log(error);
        return res.json({
            success:false,
            message:"Unable to initiate payment",
        });
   }

};







exports.verifySignature = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;

    console.log("Received body:", req.body); // 🔍 Add this
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.log("Signature mismatch");
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const userId = req.user?.id; // safer access
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found in token.",
      });
    }

    for (const courseId of courses) {
      const course = await Course.findByIdAndUpdate(
        courseId,
        { $addToSet: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!course) {
        return res.status(404).json({
          success: false,
          message: `Course with ID ${courseId} not found`,
        });
      }

      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { courses: courseId } },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and user enrolled successfully",
    });

  } catch (error) {
    console.error("❌ verifySignature error:", error); // 💥 Log full error
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.sendPaymentSuccessEmail = async (req, res) => {
  const { amount, paymentId, orderId } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!amount || !paymentId || !orderId) {
    return res.status(400).json({
      success: false,
      message: "❌ Please provide valid payment details",
    });
  }

  try {
    // Get user info
    const enrolledStudent = await User.findById(userId);

    if (!enrolledStudent) {
      return res.status(404).json({
        success: false,
        message: "❌ User not found",
      });
    }

    // Send email
    await mailSender(
      enrolledStudent.email,
      "🎉 Study Notion Payment Successful",
      paymentSuccess(
        amount / 100, // Assuming amount is in paise
        paymentId,
        orderId,
        enrolledStudent.firstName,
        enrolledStudent.lastName
      )
    );

    return res.status(200).json({
      success: true,
      message: "✅ Payment success email sent",
    });
  } catch (error) {
    console.error("sendPaymentSuccessEmail error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
