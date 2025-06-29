const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary.js");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const aiTutorRoutes = require("./routes/AiTutor.js");

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 4000;

// Connect to database
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Setup for Render (backend) + Vercel (frontend)
const allowedOrigins = [
  "http://localhost:3000",
  "https://chess-mentor-hosting.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked CORS origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// File Upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Cloudinary Connection
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use('/api/v1/ai-tutor', aiTutorRoutes);


// Default Route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is running and up 🚀",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
