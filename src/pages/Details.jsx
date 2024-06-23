import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import Contact from '../components/Contact';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle'

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';



function Details() {
  
  const {currentUser}=useSelector(states=>states.user);
  const [contact,setContact]=useState(false);


  SwiperCore.use([Navigation]);

  const { id } = useParams()

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [details, setDetails] = useState([]);
  useEffect(() => {
    const getSingeList = async (id) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${id}`,
          {
            headers: {
              "Content-Type": "application/json"
            }
          })
        const data = await res.json();
        setDetails(data);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(error)
      }
    }
    getSingeList(id);
  }, [])

  if (loading) {
    return <h1 className='text-3xl text-center mt-7'>Loading</h1>
  }
  if (error) {
    console.log(error)
    return <h1 className='text-3xl text-center mt-7'>Something rent wrong</h1>
  }

  return (
    <main>
      {
        details &&
        <Swiper navigation>
          {
            details?.imageUrls?.map((url) => (
              <SwiperSlide key={url}>
                <div className=' h-[550px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}>

                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
      }
      <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
        <p className='text-2xl font-semibold'>
          {details?.name} - ${' '}
          {details?.offer
            ? details?.discountPrice
            : details?.regularPrice}
          {details?.type === 'rent' && ' / month'}
        </p>
        <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
          <FaMapMarkerAlt className='text-green-700' />
          {details?.address}
        </p>
        <div className='flex gap-4'>
          <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
            {details?.type === 'rent' ? 'For Rent' : 'For Sale'}
          </p>
          {details?.offer && (
            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
              ${+ details?.regularPrice - + details?.discountPrice} OFF
            </p>
          )}
        </div>
        <p className='text-slate-800'>
          <span className='font-semibold text-black'>Description - </span>
          {details?.description}
        </p>
        <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
          <li className='flex items-center gap-1 whitespace-nowrap '>
            <FaBed className='text-lg' />
            {details?.bedrooms > 1
              ? `${details?.bedrooms} beds `
              : `${details?.bedrooms} bed `}
          </li>
          <li className='flex items-center gap-1 whitespace-nowrap '>
            <FaBath className='text-lg' />
            {details?.bathrooms > 1
              ? `${details?.bathrooms} baths `
              : `${details?.bathrooms} bath `}
          </li>
          <li className='flex items-center gap-1 whitespace-nowrap '>
            <FaParking className='text-lg' />
            {details?.parking ? 'Parking spot' : 'No Parking'}
          </li>
          <li className='flex items-center gap-1 whitespace-nowrap '>
            <FaChair className='text-lg' />
            {details?.furnished ? 'Furnished' : 'Unfurnished'}
          </li>
        </ul>
        {
          currentUser && currentUser._id!==details.userRef && !contact &&
        <button onClick={()=>{setContact(true)}} className='bg-slate-700 text-white rounded-lg hover:opacity-95 p-3'>
          CONTACT LANDLORD
        </button>
        }
        {
          contact && <Contact details={details}/>
        }
      </div>
    </main>
  )
}

export default Details
