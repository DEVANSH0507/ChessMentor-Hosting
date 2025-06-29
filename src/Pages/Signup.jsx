import signupImg from "../assets/Images/signup.webp"
import Template from "../Components/core/Auth/Template"
import { useSelector } from "react-redux";

function Signup() {
  const {loading} = useSelector((state)=>state.auth);
  return (
    loading?(<div className=" h-[100vh] flex justify-center items-center"><div className="custom-loader"></div></div>):(
   <div className=" flex place-content-center">
     <Template
      title="Millions Are Learning You Should Join too"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Start Your Journey to Enter Chess world."
      image={signupImg}
      formType="signup"
    />
   </div>
    )
  )
}

export default Signup