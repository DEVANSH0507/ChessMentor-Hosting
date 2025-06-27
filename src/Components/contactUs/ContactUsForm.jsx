import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { apiConnector } from '../../services/apiConnector';
import { contactusEndpoint } from '../../services/apis';
import toast from 'react-hot-toast';
import countryCode from "../../data/countrycode.json";

const ContactUsForm = () => {
  const [loading, setloading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
        phoneNo: '',
      });
    }
  }, [reset, isSubmitSuccessful]);

  const onSubmit = async (data) => {
    try {
      setloading(true);
      const phoneNo = data.countryCode + '  ' + data.phoneNo;
      const { firstName, lastName, email, message } = data;

      const res = await apiConnector('POST', contactusEndpoint.CONTACT_US_API, {
        firstName,
        lastName,
        email,
        message,
        phoneNo,
      });

      res.data.success
        ? toast.success('Message sent successfully')
        : toast.error('Something went wrong');

      setloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <div className="w-full py-32 flex justify-center">
      <div className="custom-loader" />
    </div>
  ) : (
    <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg shadow-2xl p-8 rounded-2xl border border-white/10">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 w-full lg:w-1/2">
            <label htmlFor="firstname" className="text-sm font-semibold text-white">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              placeholder="Enter first name"
              {...register('firstName', { required: true })}
              className="input-style"
            />
            {errors.firstName && <span className="text-red-400 text-sm">Enter Firstname *</span>}
          </div>

          <div className="flex flex-col gap-2 w-full lg:w-1/2">
            <label htmlFor="lastname" className="text-sm font-semibold text-white">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              placeholder="Enter last name"
              {...register('lastName')}
              className="input-style"
            />
            {errors.lastName && <span className="text-red-400 text-sm">Enter Lastname</span>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold text-white">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter email address"
            {...register('email', { required: true })}
            className="input-style"
          />
          {errors.email && <span className="text-red-400 text-sm">Enter Email *</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phoneNo" className="text-sm font-semibold text-white">
            Phone Number
          </label>
          <div className="flex gap-4">
            <select
              id="countryCode"
              {...register('countryCode', { required: true })}
              className="w-28 input-style"
            >
              {countryCode.map((item, index) => (
                <option key={index} value={item.code}>
                  {item.code} - {item.country}
                </option>
              ))}
            </select>
            <input
              type="tel"
              id="phonenumber"
              placeholder="12345 67890"
              {...register('phoneNo', {
                required: { value: true, message: 'Please enter phone Number *' },
                maxLength: { value: 10, message: 'Enter a valid Phone Number *' },
                minLength: { value: 8, message: 'Enter a valid Phone Number *' },
              })}
              className="w-full input-style"
            />
          </div>
          {errors.phoneNo && <span className="text-red-400 text-sm">{errors.phoneNo.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-sm font-semibold text-white">
            Message
          </label>
          <textarea
            id="message"
            rows="6"
            placeholder="Enter your message here"
            {...register('message', { required: true })}
            className="input-style resize-none"
          />
          {errors.message && <span className="text-red-400 text-sm">Enter your message *</span>}
        </div>

        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out hover:scale-95 shadow-md"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUsForm;
