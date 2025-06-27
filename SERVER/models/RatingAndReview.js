const mongoose=require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({

    user:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
      },

    rating:{
        type:Number,
        require:true,
    },

    reviews:{
        type:String,
        require:true,
    },

course: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Course'
},


});

    module.exports = mongoose.model("RatingAndReview",ratingAndReviewSchema)