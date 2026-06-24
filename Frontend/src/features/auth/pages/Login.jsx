import React from 'react'
import "../auth.form.scss"
import {useNavigate, Link} from "react-router"
import { useAuth } from '../hooks/use.Auth'
import { useState } from 'react'
import toast from "react-hot-toast";

const login = () => {

  const { loading, handleLogin } = useAuth()
  const navigate = useNavigate();

  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")

  // const handleSubmit = async (e)=>{
  //   e.preventDefault()
    
  //   if (!email || !password) {
  //       alert("Please fill all fields");
  //       return;
  //   }
  //   await handleLogin({ email, password })

  //   if (res?.success) {
  //   navigate("/")
  // } else {
  //   alert(res?.message || "Login failed")
  // }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      // toast.dismiss();
        toast.error("Please fill all the fields",{
          id: "login-validation",
          position: "top-left",
        });
        return;
    }

    const result = await handleLogin({ email, password });

    if (result?.success) {
      toast.success("Successfully Logged in !");
        navigate("/dashboard");
    }
}

  if(loading){
    return (<main><h1>Loading........</h1></main>)
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
            onChange={(e)=> { setEmail(e.target.value) }}
            type="email" id="email" name="email" placeholder="Enter Your email address"/>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
            onChange={(e)=>{ setPassword(e.target.value) }}
            type="password" placeholder="Enter password"/>
          </div>

          <button className="button primary-btn">Login</button>

        </form>

        <p>Don't have an account? <Link to={"/register"}>Register</Link></p>

      </div>
    </main>
  )
}

export default login
