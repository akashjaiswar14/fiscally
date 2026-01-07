import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import Input from '../components/Input';
import { HandHelping, LoaderCircle } from 'lucide-react';
import AxiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/apiEndPoints';
import AppContext from '../context/AppContext';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {setUser} = useContext(AppContext);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setIsLoading(true);

      if(!validateEmail(email)){
          setError("Please enter your valid email address");
          setIsLoading(false);
          return;
        }
    
        if(!password.trim()){
          setError("Please enter your password");
          setIsLoading(false);
          return;
        }

        setError("");

        // Login api call
        try {
          const response  = await AxiosConfig.post(API_ENDPOINTS.LOGIN, {
            email,
            password
          })
          const {token, user} = response.data;
          if(token){
            localStorage.setItem("token", token);
            setUser(user);
            navigate("/dashbaord");
          }
        } catch (error) {
          if(error.response && error.response.data.message){
            setError(error.response.data.message);
          }
          else{
            console.error("Something went wrong", error);
            setError(error.message);
          }
          
        } finally{
          isLoading(false);
        }
  }

  const navigate = useNavigate();
  return (
    <div className='h-screen w-full relative flex items-center justify-center overflow-hidden'>
      {/* {background image with blur} */}
      <img src={assets.login_bg} alt="Background" className='absolute inset-0 w-full h-full object-cover filter blur-sm' />

      <div className='relative z-10 w-full max-w-lg px-6'>
        <div className='bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto'>
          <h3 className='text-2xl font-semibold text-black text-center mb-2'>
            Welcome back
          </h3>
          <p className='text-sm text-slate-700 text-center mb-8'>
            Please enter your details to login.
          </p>

          <form onSubmit={handleSubmit} className='space-y-4'>

            <Input 
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              label="Email Address"
              placeholder="Enter Email"
              type="email"
            />

            <Input 
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              label="Password"
              placeholder="Enter Password"
              type="password"
            />
              
            {error && (
              <p className='text-red-800 text-sm text-center bg-red-50 p-2 rounded'>
                {error}
              </p>
            )}

            <button disabled={isLoading} className={`btn-primary w-full py-3 text-lg font-medium flex items-center justify-center gap-2 ${isLoading ? 'opacity-60 cursor-not-allowed': ''} bg-purple-900 rounded-3xl text-white hover:bg-purple-700`} type='submit'>
              {isLoading ? (
                <>  
                  <LoaderCircle className='animate-spin w-5 h-5' />
                  Logging in...
                </>
              ) : ("LOGIN")}
            </button>

            <p className='text-sm text-slate-800 text-center mt-6'>
              Don't have an account?
              <Link to="/signup" className='font-medium text-primary underline hover:text-primary-dark transition-colors'> Sign up</Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Login