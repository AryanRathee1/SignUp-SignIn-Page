import React, { useState , useEffect } from 'react'
import { Link , useLocation } from 'react-router-dom';
import axios from 'axios'

export default function ForgotPassword() {

    const [user,setUser] = useState({
        username:"",
        email: "",
        password:"",
    });

    const { username,email,password } = user;

    const onInputChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value})
    };

    let credentials = useLocation();
    let cred = credentials.state;

    useEffect(() => {
        if (cred) {
            setUser({
                username: cred.username || "",
                email: cred.email || ""
            });
        }
    }, [cred]);

    const changePassword = async () => {
        try {
            
            await axios.post(`http://localhost:8080/user/changePassword`,{
                username : username,
                email : email,
                password : password
            })
            

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
                        <label htmlFor='password' className='form-label'>
                            Password
                        </label>
                        <input 
                            type='text' 
                            className='form-control' 
                            placeholder='Enter new password' 
                            name='password'
                            value={password} 
                            onChange={(e)=>onInputChange(e)}
                            required
                        />
                    </div>
                    <Link className='btn btn-primary my-3' to={`/`} onClick={() => changePassword()}>
                        Submit
                    </Link>
                
            </div> 
        </div>
    </div>
  )
}
