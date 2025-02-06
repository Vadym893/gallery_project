import React,{useState} from "react";
import { Link } from "react-router-dom";
import { Header_home } from "./header";
import Axios from "axios";
export const Registration=()=>{
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [nickname,setNickname]=useState("");
    const [email,setEmail]=useState("");
    const handleSubmit=(e)=>{
        e.preventDefault()
        Axios.post("http://localhost:8081/auth/signup",{
            username,
            email,
            nickname,
            password
        }).then(response=>{
            console.log(response)
            window.location.href="/login"
        }).catch(err=>{
            console.log(err)
        })
        
    }
    return(
        <>
            <div className="registation_container">
                <Header_home/>
                <div className="form-container">
                    <div className="form-content-top">
                        <div className="logo-registration">Silfoto</div>
                        <div className="registration-text">Sign up to see photos and videos from your friends</div>
                        <form className="form_inputs" onSubmit={handleSubmit}>
                            <input type="email" className="input-field" placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
                            <input type="text" className="input-field" placeholder="Username" onChange={(e)=>setUsername(e.target.value)}/>
                            <input type="text" className="input-field" placeholder="Nickname" onChange={(e)=>setNickname(e.target.value)}/>
                            <input type="password" className="input-field" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                            <div className="agree-text">By signing up, you agree to our Terms. Learn how we collect, use and share your data in our Privacy Policy and how we use cookies and similar technology in our Cookies Policy.</div>
                            <button className="button-next" type="submit">Next</button>
                            <div className="agree-text">You can also report content you believe is unlawful in your country without logging in.</div>
                        </form>
                    </div>
                    <div className="form-content-bottom">
                        <div className="account-text-registration">Have an account? </div><Link to={`/login`} className="account-text-registration link-registration">Log in</Link> 
                    </div>
                    <div className="form-content-footer">
                        <div className="account-text-registration">Get the app.</div>
                    </div>
                </div>
            </div>
        </>
    );
}