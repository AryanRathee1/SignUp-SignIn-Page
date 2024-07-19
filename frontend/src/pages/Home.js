import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function Home() {

    let navigate = useNavigate();

    const [user,setUser] = useState({
        username:"",
        password:"",
    });

    const { username,password } = user;

    const onInputChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value})
    };

    const [showPassword, setShowPassword] = useState(false);

    const [isVisible, setIsVisible] = useState(false);

    let isValid = false;

    const validateUserDetails = (async ()=>{
            try {
                const result = await axios.post(`http://localhost:8080/user/login`,{
                    username : username,
                    password : password
                })
    
                isValid = result.status >= 200 && result.status < 300;
            } catch (error) {
                isValid = false;
                setUser({username : "",password : ""});
                console.error("Error logging In : ", error);
            }
    })    

    const methods = useForm();
    const onSubmit = methods.handleSubmit(() => {
        try {
            if(user.username === "" || user.password === ""){
                setIsVisible(true);
                return;
            }

            setIsVisible(false);

            validateUserDetails();

            if(isValid){
                console.log(isValid);
                navigate('/viewuser/login', { state : {username: user.username, password: user.password} });
                isValid = false;
            }
            
        } catch (error) {
            console.error("Empty fields",error);
        }
    })

  return (
    <div className='container'>
        <div className='py-4'>
        
        <div className='col-md-6 offset-md-3 border rounded pd-4 mt-2 shadow' style={{backgroundColor: 'yellow'}}>
                <h2 className='text-center m-4'>SIGN IN</h2>
                
                    <div className='mb-3'>
                        <label htmlFor='Username' className='form-label' style={{fontSize:20}} >
                            Username
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
                        <label htmlFor='Password' className='form-label' style={{fontSize:20}}>
                            Password
                        </label>
                        <input 
                            type={ showPassword ? "text" : "password"} 
                            className='form-control' 
                            placeholder='Enter your password' 
                            name='password'
                            value={password} 
                            onChange={(e)=>onInputChange(e)}
                            required
                        />
                        <label htmlfor="check" style={{fontSize:15}}>
                            Show Password
                        </label>
                        <input
                            id="check"
                            type="checkbox"
                            value={showPassword}
                            onChange={() =>
                                setShowPassword((prev) => !prev)
                            }
                        />
                    </div>
                    <button className='btn btn-primary my-3' onClick={()=>onSubmit()}>
                        Submit
                    </button>
                    <Link type='button' className='btn btn-danger mx-2' to={`/viewuser/requestEmail`} state={{username}}>
                        Forgot Password
                    </Link>
                    {isVisible && (
                        < div className="conditional-message" style = { {color : 'red' , fontSize : '120%'} }>
                            Fill the username and password
                        </div>
                    )}

                    {!isValid && (
                        <div className="conditional-message" style = { {color : 'red' , fontSize : '120%'} } >
                            ( Enter correct Combination of Username && Password )
                        </div>
                    )}
                
            </div> 
        </div>
    </div>
  )
}
