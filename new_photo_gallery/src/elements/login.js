import React,{useState} from "react";
import { Link } from "react-router-dom";
import { Header_home } from "./header";
import { setCookie} from "../app/cookies";
import axios from "axios";
export const Login=()=>{
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const loginAndFetchProtectedData = async (e) => {
        e.preventDefault();
        try { 
            
            const loginResponse = await axios.post('http://localhost:8081/auth/login', {
            username: username,
            password: password,
            headers: {
                "Content-Type": "application/json",
                ...(localStorage.authToken
                    ? { Authorization: "Bearer " + localStorage.authToken }
                    : {}),
                
                }
            }, {
                withCredentials: true 
            },);
            setCookie("accessToken",loginResponse.data.accessToken,2)
            setCookie("userdata",loginResponse.data.id,2)
            window.location.href ="/"
            

            
        } catch (error) {
            document.getElementById("error_msg").innerHTML=error.response.data;
        }
    };
    return(
        <>
            <div className="login_container">
                <Header_home/>
                <div className="form-container-login">
                    <div className="form-content-top">
                        <div className="logo-login">Silfoto</div>
                        <form className="form_inputs" onSubmit={loginAndFetchProtectedData}>
                            <div id="error_msg"></div>
                            <input type="text" className="input-field" placeholder="Email or Username" onChange={(e)=>setUsername(e.target.value)}/>
                            <input type="password" className="input-field" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                            <button className="button-login" type="submit">Log in</button>
                            <div className="divider">
                                <div className="line"></div>
                                <div className="or-text">OR</div>
                                <div className="line"></div>
                            </div>
                            <Link to={`/password-reset`} className="password-reset"><div className="social-login">Forgot password?</div></Link>
                            <div className="agree-text">You can also report content you believe is unlawful in your country without logging in.</div>
                        </form>
                    </div>
                    <div className="form-content-bottom">
                        <div className="account-text-registration">Don't have an account? </div><Link to={`/signup`} className="account-text-registration link-registration">Sign up</Link> 
                    </div>
                    <div className="form-content-footer">
                        <div className="account-text-registration">Get the app.</div>
                    </div>
                </div>
            </div>
        </>
    );
}