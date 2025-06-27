import React from 'react'
import { Link } from 'react-router-dom'
// import { setProgress } from '../../../slices/loadingBarSlice'
import { useDispatch } from 'react-redux'

// onClick={()=>{dispatch(setProgress(100))}}

const Button = ({children,active,linkto}) => {
    // const dispatch = useDispatch();
  return (
    <Link   to={linkto}>
    <div className={`text-center text-[13px] px-6 py-3 rounded-md font-semibold ${active ? "bg-yellow-50 text-black" : "bg-richblack-800"} hover:scale-95 transition-all duration-200`}>
        {children}
        </div>
        </Link>
  )
}

export default Button