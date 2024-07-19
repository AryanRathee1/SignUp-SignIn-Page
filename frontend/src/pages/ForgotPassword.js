import React, { useState , useEffect } from 'react'
import { Link , useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {

    let navigate = useNavigate();

    const [user,setUser] = useState({
        username:"",
        email: "",
        OTP:"",
    });

    const { username,email,OTP } = user;

    const onInputChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value})
    };

    let credentials = useLocation();
    let cred = credentials.state;

    useEffect(() => {
        if (cred) {
            setUser({
                username: cred.username || "",
                email : cred.email || ""
            });
        }
    }, [cred]);


    const verifyOTP = async () => {
        try {            
            await axios.post(`http://localhost:8080/user/verifyOTP`,{
                username : username,
                email : email,
                oneTimePassword : OTP
            })

            navigate (`/viewuser/changePassword` , { state : {username: user.username, email: user.email} } )
            

        } catch (error) {
            console.error("Error in verifing OTP : ",error);
        }
    }

  return (
    <div className='container'>
        <div className='py-4'>
        
        <div className='col-md-6 offset-md-3 border rounded pd-4 mt-2 shadow' style={{backgroundColor: 'yellow'}}>
                <h2 className='text-center m-4'>SIGN IN</h2>
                
                    <div className='mb-3'>
                        <label htmlFor='username' className='form-label'>
                            username
                        </label>
                        <input 
                            type='text' 
                            className='form-control' 
                            placeholder='Enter your username' 
                            name='username' 
                            value={username}
                            onChange={(e)=>onInputChange(e)}
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='E-mail' className='form-label'>
                            E-mail
                        </label>
                        <input 
                            type='text' 
                            className='form-control' 
                            placeholder='Enter your password' 
                            name='email'
                            value={email} 
                            onChange={(e)=>onInputChange(e)}
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='OTP' className='form-label'>
                            OTP
                        </label>
                        <p className='text-danger'>
                            OTP has been sent to registered email
                        </p>
                        <input 
                            type='text' 
                            className='form-control' 
                            placeholder='Enter OTP' 
                            name='OTP'
                            value={OTP} 
                            onChange={(e)=>onInputChange(e)}
                            required
                        />
                    </div>
                    <button className='btn btn-primary my-3' onClick={() => {verifyOTP()}}>
                        Submit
                    </button>
                    <Link className='btn btn-outline-danger mx-3 my-3' to={`/`}>
                        Cancel
                    </Link>

                    
                
            </div> 
        </div>
    </div>
  )
}
