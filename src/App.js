import React from 'react'
import "./App.css"
import {Route,Routes} from "react-router-dom" ;
import Home from "./Pages/Home" 
import LoadingBar from 'react-top-loading-bar';
import { setProgress } from "./slices/loadingBarSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ScrollToTop from './Components/ScrollToTop';
import { RiWifiOffLine } from "react-icons/ri";
import NavBar from './Components/common/NavBar';
import OpenRoute from "./Components/core/Auth/OpenRoute";
import PrivateRoute from "./Components/core/Auth/PrivateRoute";
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Catalog from './Pages/Catalog';
import VerifyOtp from "./Pages/VerifyOtp";
import About from "./Pages/About";
import ContactUs from "./Pages/ContactUs";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from './Pages/Dashboard';
import MyProfile from "./Components/core/Dashboard/MyProfile";
import Setting from "./Components/core/Dashboard/Settings";
import { ACCOUNT_TYPE } from "./utils/constants";
import EnrollledCourses from "./Components/core/Dashboard/EnrolledCourses";
import Cart from "./Components/core/Dashboard/Cart/index";
import PurchaseHistory from "./Components/core/Dashboard/PurchaseHistory";
import AddCourse from "./Components/core/Dashboard/AddCourse/index";
import MyCourses from "./Components/core/Dashboard/MyCourses/MyCourses";
import EditCourse from "./Components/core/Dashboard/EditCourse.jsx/EditCourse";
import InstructorDashboard from "./Components/core/Dashboard/InstructorDashboard/InstructorDashboard";
import AdminPannel from "./Components/core/Dashboard/AdminPannel";
import Footer from './Components/common/Footer';
import ViewCourse from "./Pages/ViewCourse";
import VideoDetails from "./Components/core/ViewCourse/VideoDetails";
import CourseDetails from "./Pages/CourseDetails";
import ChessTutor from "./Pages/ChessTutor";



function App() {
  console.log = function () {};
  const user = useSelector((state) => state.profile.user);
  const progress = useSelector((state) => state.loadingBar);
  const dispatch = useDispatch();
  return (
    <div className=" w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
     <LoadingBar
        color="#FFD60A"
        height={1.4}
        progress={progress}
        onLoaderFinished={() => dispatch(setProgress(0))}
      />

      <NavBar setProgress={setProgress}></NavBar>

      {!navigator.onLine && (
        <div className="bg-red-500 flex text-white text-center p-2 bg-richblack-300 justify-center gap-2 items-center">
          <RiWifiOffLine size={22} />
          Please check your internet connection.
          <button
            className="ml-2 bg-richblack-500 rounded-md p-1 px-2 text-white"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      <ScrollToTop />

      <Routes>
         <Route path="/" element={<Home/>} />

          <Route path="/catalog/:catalog" element={<Catalog />} />

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route path="/verify-email" element={<VerifyOtp />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<ContactUs />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/update-password/:id" element={<ResetPassword />} />

          <Route path="/courses/:courseId" element={<CourseDetails />} />

         <Route path="/search/:searchQuery" element={<searchCourse />} />

      <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Setting />} />
         
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrollledCourses />}
              />
              <Route
                path="dashboard/purchase-history"
                element={<PurchaseHistory />}
              />
            </>
          )}


          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
              <Route
                path="dashboard/instructor"
                element={<InstructorDashboard />}
              />
            </>
          )}


          {user?.accountType === ACCOUNT_TYPE.ADMIN && (
            <>
              <Route path="dashboard/admin-panel" element={<AdminPannel />} />
            </>
          )}
        
        
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="/dashboard/enrolled-courses/view-course/:courseId/section/:sectionId/sub-section/:subsectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

         <Route path="*" element={<Home />} />

         {/* chess tutor path */}
         <Route path="/tutor" element={<ChessTutor />} /> 


      </Routes>
       <Footer />
    </div> 
  );
}

export default App
