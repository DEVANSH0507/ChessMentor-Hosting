import React, { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const ChipInput = ({ name, label, register, errors, setValue, trigger }) => {
  const [tags, setTags] = useState([])
  const { editCourse, course } = useSelector((state) => state.course)

  useEffect(() => {
    register(name, {
      required: true,
      validate: (value) => Array.isArray(value) && value.length > 0,
    })

    if (editCourse && course?.tag) {
      const existingTags = Array.isArray(course.tag) ? course.tag : JSON.parse(course.tag)
      setTags(existingTags)
      setValue(name, existingTags)
      trigger(name)
    }
  }, [])

  const addTag = (value) => {
    const trimmed = value.trim()
    if (trimmed && !tags.includes(trimmed)) {
      const updatedTags = [...tags, trimmed]
      setTags(updatedTags)
      setValue(name, updatedTags)
      trigger(name)
    }
  }

  const removeTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, i) => i !== indexToRemove)
    setTags(updatedTags)
    setValue(name, updatedTags)
    trigger(name)
  }

  return (
    <div>
      <label className='text-sm text-richblack-5' htmlFor={name}>
        {label} <sup className='text-pink-200'>*</sup>
      </label>

      <div className='flex flex-wrap gap-2 m-2'>
        {tags.map((tag, index) => (
          <div
            key={index}
            className='m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5'
          >
            <span>{tag}</span>
            <button type='button' onClick={() => removeTag(index)} className='ml-2'>
              <FaTimes />
            </button>
          </div>
        ))}
      </div>

      <input
        type='text'
        id={name}
        placeholder='Press Enter or , to add a tag'
        className='form-style w-full'
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag(e.target.value)
            e.target.value = ''
          }
        }}
      />

      {errors[name] && <span className='text-xs text-pink-200'>Tags are required</span>}
    </div>
  )
}

export default ChipInput
