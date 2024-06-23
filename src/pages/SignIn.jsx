import React from 'react'
import { useState } from 'react';
import {useNavigate,Link} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {signInFailure, signInStart, signInSuccess} from '../redux/user/userSlice'
import Oauth from '../components/Oauth'

function SignIn() {

  const [formData, setFormdata] = useState({});
 
  const {loading,error}=useSelector((allstates)=>allstates.user);

  const dispatch=useDispatch();

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormdata({
      ...formData, [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data.user));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className='mx-auto p-3 max-w-lg'>
      <h1 className=' text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="email" placeholder='email' className='border p-3 rounded-lg outline-none' id="email" onChange={handleChange} />
        <input type="password" placeholder='Password' className='border p-3 rounded-lg outline-none' id="password" onChange={handleChange} />
        <button className='p-3 rounded-lg bg-slate-700 text-white disabled:opacity-80 hover:opacity-95' disabled={loading}>
          {loading ? 'LOADING' : 'SIGN IN'}
        </button>
        <Oauth/>
      </form>
      <div className='flex text-sm gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to={'/sign-up'} className='text-blue-500'>Sign Up</Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn
