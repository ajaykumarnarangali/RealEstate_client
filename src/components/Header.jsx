import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function Header() {
    const { currentUser } = useSelector(state => state.user);

    const [searchTerm, setsearchTerm] = useState('');

    const navigate=useNavigate();
    const handleSearch = (e) => {
        e.preventDefault();    
        const urlParams=new URLSearchParams(window.location.search);
        urlParams.set('searchTerm',searchTerm);
        const searchQuery=urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(()=>{
        const urlParams=new URLSearchParams(location.search);
        const searchQueryfromURL=urlParams.get('searchTerm');
        if(searchQueryfromURL)
        {
            setsearchTerm(searchQueryfromURL);
        }
    },[location.search]);



    return (
        <header className=' bg-slate-200 py-4 '>
            <div className=' flex justify-between items-center max-w-6xl mx-auto'>
                <Link to={'/'}>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-500'>Ajay</span>
                        <span className='text-slate-700'>Estate</span>
                    </h1>
                </Link>
                <form className=' bg-slate-100 p-3 rounded flex items-center cursor-pointer' onSubmit={handleSearch}>
                    <input type="text" placeholder='Search...' value={searchTerm} onChange={(e) => { setsearchTerm(e.target.value) }}  className=' bg-transparent outline-none' />
                    <button>
                        <FaSearch />
                    </button>
                </form>
                <ul className='flex gap-4 cursor-pointer '>
                    <li className='text-slate-700'><Link to={'/'}>Home</Link></li>
                    <li className='text-slate-700'><Link to={'/about'}>About</Link></li>
                    <li className='text-slate-700'>
                        <Link to={'/profile'}>
                            {
                                currentUser ?
                                    <img src={currentUser.avatar} alt="avatar" className='h-7 w-7 object-cover rounded-lg' />
                                    :
                                    <li>Sign In</li>
                            }
                        </Link>
                    </li>
                </ul>
            </div>
        </header>
    )
}

export default Header
