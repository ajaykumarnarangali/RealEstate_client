import { useState } from "react"
import { app } from '../firebase'
import { getStorage, uploadBytesResumable, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


function CreateList() {

    const navigate = useNavigate();
    const {currentUser}=useSelector(state=>state.user);

    const [images, setImages] = useState([]);

    const [form, setForm] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        regularPrice: 0,
        discountedPrice: 0,
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,
        type: 'rent',
        offer: false,
    });

    const [error, setError] = useState(null);
    const [create, setCreate] = useState(false);

    const [uploading, setUploading] = useState(false);

    const handleImagesubmit = (e) => {
        e.preventDefault();
        if (images.length >= 1 && images.length < 7) {
            const promises = [];
            setUploading(true);

            for (let i = 0; i < images.length; i++) {
                promises.push(getImageUrl(images[i]));
            }
            Promise.all(promises).then((res) => {
                setForm({ ...form, imageUrls: form.imageUrls.concat(res) });
                setUploading(false); // Move inside the Promise.all block
            }).catch((err) => {
                setUploading(false); // Handle error case
            });
        } else {
            setUploading(false);
        }
    }

    const getImageUrl = async (image) => {
        return new Promise(async (res, rej) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + image.name;

            const storageRef = ref(storage, fileName);

            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on("state_changed",
                (snapshot) => {
                    //    const progress=(snapshot.ByteTransfered/snapshot.totalBytes)*100;
                    //    console.log(progress);
                },
                (error) => {
                    rej(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        res(downloadUrl)
                    })
                },
            );
        })
    }

    const handleImageDelete = (e, url) => {
        e.preventDefault();
        setForm(prev => {
            return {
                ...prev, imageUrls: prev.imageUrls.filter((each) => {
                    return each != url
                })
            }
        })
        const storage = getStorage(app);
        const fileRef = ref(storage, url);

        deleteObject(fileRef).then(() => {
            console.log("File deleted successfully");
        }).catch((error) => {
            console.error("Error deleting file:", error);
            console.log(error)
        });

    }

    const handleChanges = (e) => {
        if (e.target.id == "sale" || e.target.id == "rent") {
            setForm({
                ...form, type: e.target.id
            })
        }
        if (e.target.id == "parking" || e.target.id == "furnished" || e.target.id == "offer") {
            setForm({ ...form, [e.target.id]: e.target.checked })
        }

        if (e.target.type === "text" || e.target.type === "number") {
            setForm({ ...form, [e.target.id]: e.target.value })
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCreate(true);
            let res = await fetch('/api/listing/create', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({...form,userRef:currentUser._id})
            })
            const data = await res.json();
            if (data.success == false) {
                setError(data.message);
                setCreate(false);
                return
            }
            setCreate(false);
            navigate('/');
        } catch (error) {
            setError(error);
            setCreate(false);
        }
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-center font-semibold my-7 text-3xl'>Create Listing</h1>
            <form className='flex flex-col flex-1 sm:flex-row' onSubmit={handleSubmit}>
                <div className='flex flex-col flex-1 gap-3'>
                    <input type="text" placeholder='Name' id='name' className='border p-3 rounded-lg outline-none' onChange={handleChanges} required />
                    <input type="text" placeholder='Description' id='description' className='border p-3 rounded-lg outline-none' onChange={handleChanges} required />
                    <input type="text" placeholder='Address' id='address' className='border p-3 rounded-lg outline-none' onChange={handleChanges} required />
                    <div className='flex gap-4 flex-wrap'>
                        <div className='flex gap-3'>
                            <input type="checkbox" className='w-4' id='sale' onChange={handleChanges} checked={form.type === "sale"} />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-3'>
                            <input type="checkbox" className='w-4' id='rent' onChange={handleChanges} checked={form.type === "rent"} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-3'>
                            <input type="checkbox" className='w-4' id='parking' onChange={handleChanges} checked={form.parking} />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-3'>
                            <input type="checkbox" className='w-4' id='furnished' onChange={handleChanges} checked={form.furnished} />
                            <span>Furninshed</span>
                        </div>
                        <div className='flex gap-3'>
                            <input type="checkbox" className='w-4' id='offer' onChange={handleChanges} checked={form.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <div className='flex  items-center gap-3'>
                            <input type="number" onChange={handleChanges} id='bedrooms' className='w-10 outline-none rounded-lg' />
                            <span>Bedrooms</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <input type="number" onChange={handleChanges} id='bathrooms' className='w-10 outline-none rounded-lg' />
                            <span>Bathrooms</span>
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <div className='flex  items-center gap-3'>
                            <input type="number" onChange={handleChanges} id='regularPrice' className='w-20 py-3 outline-none rounded-lg' />
                            <span>Regular Price</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <input type="number" onChange={handleChanges} id='discountedPrice' className='w-20 py-3 outline-none rounded-lg' />
                            <span>Discount price</span>
                        </div>
                    </div>
                </div>
                <div className='flex flex-1 flex-col ms-5'>
                    <div className='flex'>
                        <p className='font-semibold'>Images:</p>
                        <span className='font-normal ml-2 text-gray-600'>The first image will be the cover(MAX 6)</span>
                    </div>
                    <div className='mt-3 flex gap-2'>
                        <input onChange={(e) => { setImages(e.target.files) }} className='p-3 border border-gray-300 rounded w-full' type="file" multiple />
                        <button onClick={handleImagesubmit} className='p-3 border text-green-700 rounded-lg  border-green-700 hover:shadow-lg disabled:opacity-80'>
                            {uploading ? "UPLOADING" : "UPLOAD"}
                        </button>
                    </div>
                    <div>
                        {
                            form.imageUrls.length > 0 && form.imageUrls.map((url) => (
                                <div className="flex justify-between my-2 bg-slate-500 p-3 rounded-lg">
                                    <img src={url}
                                        className=" w-16 h-16" alt="image" />
                                    <button className="border text-white bg-red-700 p-3 rounded-lg" onClick={(e) => { handleImageDelete(e, url) }}>DELETE</button>
                                </div>
                            ))
                        }
                    </div>
                    <button disabled={create} className='p-3 cursor-pointer bg-slate-700 hover:opacity-95 disabled:opacity-80 text-white rounded-lg mt-4'>
                        {create ?"CREATE LISTING":"LISTING"}
                    </button>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                </div>
            </form>
        </main>
    )
}

export default CreateList
