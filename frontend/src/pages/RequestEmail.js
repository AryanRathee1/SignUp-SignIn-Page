import axios from 'axios';
import React, { useRef, useState , useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate , useLocation } from 'react-router-dom';

export default function Home() {

    let navigate = useNavigate();

    const [user,setUser] = useState({
        username:"",
        email:"",
    });

    const { username,email } = user;

    let credentials = useLocation();
    let cred = credentials.state;

    useEffect(() => {
        if (cred) {
            setUser({
                username: cred.username || ""
            });
        }
    }, [cred]);

    const onInputChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value})
    };

    let isValid = false;

    const requestOTPHelper = async ()=>{
        try {
            const result = await axios.post(`http://localhost:8080/user/otp`,{
                username : username,
                email : email
            });

            isValid = result.status >= 200 && result.status < 300;

        } catch (error) {
            isValid = false;
            console.log(error);
        }
    }

    //const methods = useForm();
    const requestOTP = ( async () => {
        try {
            await requestOTPHelper();

            if(isValid){
                navigate('/viewuser/forgot', { state : {username: user.username, email: user.email} } );
                isValid = false;
            }

        } catch (error) {
            console.error("Error in sending OTP :", error);
        }
    })

    

  return (
    <div className='container'>
        <div className='py-4'>
        
        <div className='col-md-6 offset-md-3 border rounded pd-4 mt-2 shadow' style={{backgroundColor: 'orange'}}>
                <h2 className='text-center m-4'>SIGN IN</h2>
                
                    <div className='mb-3'>
                        <label htmlFor='Username' className='form-label'>
                            username
                        </label>
                        <input 
                            type='text' 
                            className='form-control' 
                            placeholder='Enter your username' 
                            name='username' 
                            value={username}
                            onChange={(e)=>onInputChange(e)}
                            required
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='email' className='form-label'>
                            email
                        </label>
                        <input 
                            type='text' 
                            className='form-control' 
                            placeholder='Enter your email' 
                            name='email'
                            value={email} 
                            onChange={(e)=>onInputChange(e)}
                            required
                        />
                    </div>
                    <button type='submit btn btn-primary my-3' onClick={()=>requestOTP()}>
                        Send OTP
                    </button>
                    <Link className='btn btn-outline-danger mx-3 my-3' to={`/`}>
                        Cancel
                    </Link>
            </div> 
        </div>
    </div>
  )
}
