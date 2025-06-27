import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

const RequirementField = ({ name, label, register, errors, setValue, getValues }) => {
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);
  const { editCourse, course } = useSelector((state) => state.course);

  // Register the field in form
  useEffect(() => {
    register(name, {
      required: true,
    });
  }, [register, name]);

  // Initial setup on editCourse
  useEffect(() => {
    if (editCourse) {
      let instructions = course?.instructions;

      // If it's a stringified array, parse it
      if (typeof instructions === "string") {
        try {
          instructions = JSON.parse(instructions);
        } catch (e) {
          instructions = [];
        }
      }

      // Fallback if it's not an array
      if (!Array.isArray(instructions)) {
        instructions = [];
      }

      setRequirementList(instructions);
      setValue(name, instructions);
    }
  }, [editCourse, course, name, setValue]);

  // Keep form state in sync
  useEffect(() => {
    setValue(name, requirementList);
  }, [requirementList, name, setValue]);

  const handleAddRequirement = () => {
    if (requirement.trim() !== "") {
      setRequirementList((prev) => [...prev, requirement.trim()]);
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    setRequirementList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className='text-sm text-richblack-5' htmlFor={name}>
        {label}<sup className='text-pink-200'>*</sup>
      </label>

      <div>
        <input
          type='text'
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className='form-style w-full'
        />
        <button
          type='button'
          onClick={handleAddRequirement}
          className='font-semibold text-yellow-50 mt-3'>
          Add
        </button>
      </div>

      {Array.isArray(requirementList) && requirementList.length > 0 && (
        <ul className='mt-2 list-inside list-disc'>
          {requirementList.map((req, index) => (
            <li key={index} className='flex items-center text-richblack-5'>
              <span>{req}</span>
              <button
                type='button'
                onClick={() => handleRemoveRequirement(index)}
                className='ml-2 text-xs text-pure-greys-300'>
                clear
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors[name] && (
        <span className='ml-2 text-xs tracking-wide text-pink-200'>
          {label} is required
        </span>
      )}
    </div>
  );
};

export default RequirementField;
