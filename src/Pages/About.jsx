import React from 'react'
import HighlightText from '../Components/core/HomePage/HighlightText';
import BannerImage1 from "../assets/Images/aboutus1.jpeg"
import BannerImage2 from "../assets/Images/aboutus2.jpeg"
import BannerImage3 from "../assets/Images/aboutus3.jpeg"
import Quote from "../Components/core/AboutPage/Quote"
import FoundingStory from "../assets/Images/FoundingStory.jpg"
import StatsComponent from '../Components/core/AboutPage/Stats'
import LearningGrid from '../Components/core/AboutPage/LearningGrid'
import ContactFormSection from '../Components/core/AboutPage/ContactFormSection'
import Footer from '../Components/common/Footer'
import RatingSlider from '../Components/core/Ratings/RatingSlider';

const About = () => {
  return (
    <div className='mx-auto text-white'>
      {/* section 1 */}
      <section className='bg-richblack-700'>
        <div className='relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white'>
            <header className='mx-auto py-20 text-4xl font-semibold lg:w-[70%]'>
                Shaping Chess Excellence for a
                <HighlightText text={"Smarter Game"}/>
                <p className='mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]'>ChessMentor is pioneering innovation in chess education. We're passionate about developing strategic thinking by offering interactive lessons, AI analysis, and a competitive learning community.</p>
            </header>
            <div className='sm:h-[70px] lg:h-[150px]'></div>
            <div className='absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5'>
                <img src={BannerImage1} />
                <img src={BannerImage2} />
                <img src={BannerImage3} />
            </div>
        </div>
      </section>

      {/* section 2 */}
      <section className='border-b border-richblack-700'>
        <div className='mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500'>
          <div className='h-[100px] '></div>
            <Quote/>
        </div>
      </section>

      {/* section 3 */}
      <section>
        <div className='mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500'>
          {/* founding story */}
          <div className='flex flex-col items-center gap-10 lg:flex-row justify-between '>
            {/* left */}
            <div className='my-24 flex lg:w-[50%] flex-col gap-10'>
              <h1 className='bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] '>Our Founding Story</h1>
              <p className='text-base font-medium text-richblack-300 lg:w-[95%]'>ChessMentor was built by chess lovers, coaches, and AI developers who saw the need for modern chess education. With the rising popularity of chess, we wanted to create a platform where learning was accessible, immersive, and tailored to every level.</p>
              <p className='text-base font-medium text-richblack-300 lg:w-[95%]'>We recognized how isolated learning and lack of feedback limited progress. ChessMentor bridges this gap, making elite-level insights available to everyone through structured lessons and analysis.</p>
            </div>
            {/* right */}
            <div>
              <img className='shadow-[0_0_20px_0] shadow-[#FC6767]'  src={FoundingStory} />
            </div>
          </div>

          {/* vision and mission */}
          <div className='flex flex-col items-center lg:gap-10 lg:flex-row justify-between'>
            {/* vision */}
            <div className='my-24 flex lg:w-[40%] flex-col gap-10'>
              <h1 className='bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] '>Our Vision</h1>
              <p className='text-base font-medium text-richblack-300 lg:w-[95%]'>We aspire to transform chess education globally by making structured learning, coach feedback, and AI tools accessible to players of all levels. Our vision is to raise a new generation of confident and creative chess minds.</p>
            </div>

            {/* mission */}
            <div className='my-24 flex lg:w-[40%] flex-col gap-10'>
              <h1 className='bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] '>
                Our Mission
              </h1>
              <p className='text-base font-medium text-richblack-300 lg:w-[95%]'>We go beyond lessons. Our mission is to build a vibrant ecosystem where players engage in puzzle challenges, tournament play, and collaborative analysis—fostering growth and community in every move.</p>
            </div>
          </div>
        </div>
      </section>  

      {/* section 4 */}
      <StatsComponent/>  

      {/* section 5 */}
      <section className='mx-auto p-2 flex flex-col items-center justify-between gap-5 mb-[140px]'>
        <LearningGrid />
        <ContactFormSection />
      </section>

      <section>
        <div className='mb-16 mt-3 w-screen'>
          <h2 className='text-center text-4xl font-semibold mt-8 text-richblack-5 mb-5'>Learner Reviews from the Chess Board</h2>
          <RatingSlider />
        </div>
      </section>

    </div>
  )
} 

export default About
