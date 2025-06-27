const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isActive = currentCard === cardData.heading;

  return (
    <div className="w-[360px]">
      <button
        className={`flex flex-col justify-between h-[300px] w-full p-5 gap-3 rounded-lg transition-all duration-200 
          ${isActive ? "bg-white text-richblack-700 shadow-[12px_12px_0px] shadow-[#FFD60A]" : "bg-richblack-700 text-richblue-100"}
        `}
        onClick={() => setCurrentCard(cardData.heading)}
      >
        {/* Top Section */}
        <div className="flex flex-col text-left border-b-2 border-richblack-100 border-dashed pb-3">
          <p className={`text-xl font-bold mb-2 ${isActive ? "text-black" : "text-richblue-5"}`}>
            {cardData.heading}
          </p>
          <p className="text-base line-clamp-3">{cardData.description}</p>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between text-sm pt-2">
          <p>{cardData.level}</p>
          <p>{cardData.lessionNumber} Lessons</p>
        </div>
      </button>
    </div>
  );
};

export default CourseCard;
