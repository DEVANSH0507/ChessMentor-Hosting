const express = require("express");
const app = express();
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");


const userRoutes=require("./routes/User");
const profileRoutes=require("./routes/Profile");
const paymentRoutes=require("./routes/Payments");
const courseRoutes=require("./routes/Course");

const {cloudinaryConnect}= require("./config/cloudinary.js");
const fileUpload = require("express-fileupload");

dotenv.config();
const PORT=process.env.PORT || 4000;


//database connect
database.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://chess-mentor-hosting.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

        
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

//cloudinary connections
cloudinaryConnect();

//routes

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payments",paymentRoutes);


//def routes

app.get("/" , (req,res)=> {
    return res.json({
        success:true,
        message:"You server is running and up"
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
})




