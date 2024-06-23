import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import {app} from '../firebase'
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../redux/user/userSlice'
import {useNavigate} from 'react-router-dom'

function Oauth() {
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const handleGoogleClick=async()=>{

        try {
            const provider=new GoogleAuthProvider();
            const auth=getAuth(app);//check which application is sending the request.//establish connection

            const result=await signInWithPopup(auth,provider);
            
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({username:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
              });
            
            const data=await res.json();
            dispatch(signInSuccess(data.user));
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg hover:opacity-95'>
        CONTINUE WITH GOOGLE
    </button>
  )
}

export default Oauth
