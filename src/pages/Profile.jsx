import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase'
import { signInStart, signInSuccess, signInFailure, deleteUsersuccess, signOut } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  
  const [showList,setShowlist]=useState(false)

  const [listing, setListing] = useState([]);

  const [form, setForm] = useState({})

  const [image, setImage] = useState(undefined);

  const [uploadPerc, setUploadperc] = useState(0);
  const [uploadError, setuploadError] = useState(null);

  useEffect(() => {
    if (image) {
      handleUpload(image);
    }
  }, [image]);

  const handleUpload = (image) => {

    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;

    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Handle progress, like showing a progress bar
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadperc(Math.round(progress));
      },
      (error) => {
        //handle error 
        setuploadError(error);
      },
      () => {
        //handle complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setForm({ ...form, avatar: downloadURL });
        })
      }
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        })
      const data = await res.json();
      if (data.success == true) {
        dispatch(signInSuccess(data.user))
      } else {
        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      dispatch(signInFailure(error.response.data.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(signInStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        })
      const data = await res.json();
      console.log(data);
      if (data.success == false) {
        dispatch(signInFailure(data.message));
        return
      }
      dispatch(deleteUsersuccess())
    } catch (error) {
      dispatch(signInFailure(error.response.data.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signInStart());
      const res = await fetch(`/api/auth/sign-out`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })
      const data = await res.json();
      console.log(data);
      if (data.success == false) {
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(signOut());
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  const showListing = async () => {
    try {
      const res = await fetch(`/api/user/listing/${currentUser._id}`,
        {
          headers: { "Content-Type": "application/json" }
        }
      )
      const data = await res.json();
      setShowlist(true);
      setListing(data);
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col' onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => { setImage(e.target.files[0]) }} ref={fileRef} hidden accept='image/.*' />
        <img onClick={() => { fileRef.current.click() }} src={form.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 ' />
        <p className='text-center'>
          {
            uploadError ? (
              <span className='text-red-500'>Error occurred in uploading</span>
            ) : (
              uploadPerc > 0 && uploadPerc <= 99 ? (
                <span className='text-green-700'>{`Uploading ${uploadPerc}%`}</span>
              ) : uploadPerc == 100 ? (
                <span className='text-green-700'>Uploaded successfully</span>
              ) : <p></p>
            )
          }
        </p>
        <input type="text" defaultValue={currentUser.username} onChange={handleChange} placeholder='username' className='border p-3 rounded-lg my-3 outline-none' id='username' />
        <input type="email" defaultValue={currentUser.email} onChange={handleChange} placeholder='email' className='border p-3 rounded-lg my-3 outline-none' id='email' />
        <input type="password" placeholder='password' onChange={handleChange} className='border p-3 rounded-lg my-3 outline-none' id='password' />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80 mt-2'>
          {
            loading ? "UPDATING" : "UPDATE"
          }
        </button>
        <Link to={'/create-listing'} className='bg-green-700 flex justify-center text-white rounded-lg p-3 hover:opacity-95  mt-2'>
          CREATE LISTING
        </Link>
      </form>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign out</span>
      </div>
      <div className='flex justify-center'>
       {!showList ? <button className='text-green-700' onClick={showListing}>Show listing</button>:
        <button className='text-green-700' onClick={()=>{setShowlist(false)}}>Close listing</button>}
      </div>
      <div className='mt-8'>
        {
         showList && listing?.length > 0 && listing.map((item) => (
            <Link to={`/listing/${item._id}`}>
              <div className='flex justify-between my-4'>
                <img src={item.imageUrls[0]} className='h-20 w-20' alt="" />
                <div className='flex flex-col justify-between'>
                  <button className='border border-green-700 text-green-700 p-1 rounded-lg'>UPDATE</button>
                  <button className='border border-red-700 text-red-700 p-1 rounded-lg'>DELETE</button>
                </div>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default Profile
