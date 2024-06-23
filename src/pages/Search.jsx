import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import Listitem from '../components/Listitem';

function Search() {

   const [sidebarData, setsideBardata] = useState({
      searchTerm: '',
      offer: false,
      furnished: false,
      parking: false,
      type: 'all',
      sort: 'createdAt',
      order: 'desc'
   });

   const [Listing,setListing]=useState([]);
   const [loading,setLoading]=useState(false);

   const handleChange = (e) => {
      if (e.target.id == 'all' || e.target.id == 'rent' || e.target.id == 'sale') {
         setsideBardata({ ...sidebarData, type: e.target.id });
      }

      if (e.target.id == 'searchTerm') {
         setsideBardata({ ...sidebarData, searchTerm: e.target.value });
      }

      if (e.target.id == 'offer' || e.target.id == 'furnished' || e.target.id == 'parking') {
         setsideBardata({ ...sidebarData, [e.target.id]: e.target.checked || e.target.checked == 'true' ? true : false });
      }

      if (e.target.id == 'sort_order') {
         let sort = e.target.value.split('_')[0];
         let order = e.target.value.split('_')[1];
         setsideBardata({ ...sidebarData, sort, order });
      }
   }
   const navigate = useNavigate();
   const handleSubmit = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams();
      urlParams.set('searchTerm', sidebarData.searchTerm);
      urlParams.set('offer', sidebarData.offer);
      urlParams.set('parking', sidebarData.parking);
      urlParams.set('furnished', sidebarData.furnished);
      urlParams.set('type', sidebarData.type);
      urlParams.set('sort', sidebarData.sort);
      urlParams.set('order', sidebarData.order);

      const searchQuery = urlParams.toString();

      navigate(`/search?${searchQuery}`);

   }

   useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
  
      let searchTermFromURL = urlParams.get('searchTerm');
      let offerFromURL = urlParams.get('offer');
      let furnishedFromURL = urlParams.get('furnished');
      let parkingFromURL = urlParams.get('parking');
      let typeFromURL = urlParams.get('type');
      let sortFromURL = urlParams.get('sort');
      let orderFromURL = urlParams.get('order');

      if(searchTermFromURL || offerFromURL || furnishedFromURL || parkingFromURL || typeFromURL || sortFromURL || orderFromURL)
      {
         setsideBardata({
            searchTerm:searchTermFromURL,
            type:typeFromURL || 'all',
            offer:offerFromURL=='true' ?true:false,
            parking:parkingFromURL=='true'?true:false,
            furnished:furnishedFromURL=='true'?true:false,
            sort:searchTermFromURL || 'createdAt',
            order:orderFromURL || 'desc'
         });
      }

      const fetchListing=async()=>{
         setLoading(true);
         const urlParams=new URLSearchParams(location.search);
         const res=await fetch(`/api/listing/search?${urlParams}`);
         const data=await res.json();
         setListing(data.listing);
         setLoading(false);
      }

      fetchListing();
  
  }, [location.search]);


   return (
      <div className='flex '>
         <div className='p-7 border-r-2 min-h-screen'>
            <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
               <div className='flex items-center gap-2' >
                  <label className='whitespace-nowrap'>Search Term:</label>
                  <input type="text" placeholder='Search...' id='searchTerm' className='border rounded-lg p-3 w-full outline-none'
                     onChange={handleChange} value={sidebarData.searchTerm}
                  />
               </div>
               <div className='flex gap-2 mt-3 flex-wrap items-center'>
                  <label>Type:</label>
                  <div className='flex gap-2'>
                     <input type="checkbox" id='all' onChange={handleChange} checked={sidebarData.type == 'all'} />
                     <span>Sale & Rent</span>
                  </div>
                  <div className='flex gap-2'>
                     <input type="checkbox" id='sale' onChange={handleChange} checked={sidebarData.type == 'sale'} />
                     <span>Sale</span>
                  </div>
                  <div className='flex gap-2'>
                     <input type="checkbox" id='rent' onChange={handleChange} checked={sidebarData.type == 'rent'} />
                     <span> Rent</span>
                  </div>
                  <div className='flex gap-2'>
                     <input type="checkbox" id='offer' onChange={handleChange} checked={sidebarData.offer} />
                     <span>Offer</span>
                  </div>
               </div>
               <div className='flex gap-2 mt-3 flex-wrap items-center'>
                  <label>Amenities:</label>
                  <div className='flex gap-2'>
                     <input type="checkbox" id='parking' onChange={handleChange} checked={sidebarData.parking} />
                     <span>Parking</span>
                  </div>
                  <div className='flex gap-2'>
                     <input type="checkbox" id='furnished' onChange={handleChange} checked={sidebarData.furnished} />
                     <span>Furnished</span>
                  </div>
               </div>
               <div className='flex items-center gap-2 mt-2'>
                  <label>Sort:</label>
                  <select id="sort_order" className='border p-3 outline-none rounded-lg' onChange={handleChange} >
                     <option value={'regularPrice_desc'}>Price high to low</option>
                     <option value={'regularPrice_asc'}>Price low to high</option>
                     <option value={'createdAt_desc'}>Latest</option>
                     <option value={'createdAt_asc'}>Oldest</option>
                  </select>
               </div>
               <button className='bg-slate-700 hover:opacity-95 text-white p-3 rounded-lg mt-2 w-full'>SEARCH</button>
            </form>
         </div>
         <div className='p-7 flex flex-wrap gap-4'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
            <div className='flex flex-wrap mt-5 gap-4'>
               {
                  !loading && Listing?.length==0 &&
                  <p className='text-xl text-slate-700 ml-4'>No Listing found</p>
               }
               {
                  loading && <p className='text-xl text-slate-700 ml-4'>Loading</p>
               }
               {
                  !loading && Listing &&
                  Listing.map((List)=>(
                     <Listitem key={List._id} List={List}/>
                  ))
               }
            </div>
         </div>
      </div>
   )
}

export default Search
