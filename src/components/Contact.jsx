import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'

function Contact({ details }) {

    const [landlord, setLandlord] = useState({});
    const [message,setMessage]=useState("")

    useEffect(() => {
        const getUserdetails = async (id) => {
            const res = await fetch(`/api/user/${id}`, { headers: { "Content-Type": "application/json" } });
            const data = await res.json();
            setLandlord(data.user);
        }
        getUserdetails(details.userRef);
    }, []);

    return (
        <div>
            {landlord && (
                <div className='flex flex-col gap-2'>
                    <p>
                        Contact <span className='font-semibold'>{landlord.username}</span>{' '}
                        for{' '}
                        <span className='font-semibold'>{details.name.toLowerCase()}</span>
                    </p>
                    <textarea
                        name='message'
                        id='message'
                        rows='2'
                        value={message}
                        onChange={(e)=>{setMessage(e.target.value)}}
                        placeholder='Enter your message here...'
                        className='w-full border p-3 rounded-lg'
                    ></textarea>

                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${details.name}&body=${message}`}
                        className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Contact
