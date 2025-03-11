import './App.css';
import { AllRoutes } from './actions/routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import React, { useEffect,useState }  from 'react';
import axios from 'axios';
import { Provider } from 'react-redux'
import store from './app/store';
import  {getCookie,delete_cookie}  from './app/cookies';
import { useActivityTracker } from './app/activity_tracker';

let history=createBrowserHistory();
function App() {
  const [token, setToken] = useState(getCookie("accessToken"));
  const isActive = useActivityTracker();
  useEffect(() => {
    if (!token) return;
    const checkAndRefreshToken = async () => {
        try {
            const tokenResponse =await axios.get('http://localhost:8081/auth/protected',{
            headers: {
              "Content-Type": "application/json",
              "userId":( getCookie("userdata")),
              ...(getCookie("accessToken") ? { Authorization: "Bearer " + getCookie("accessToken") } : {}),
            }} ,{
              withCredentials: true  
            });
            console.log(tokenResponse.status())
            if (tokenResponse.status()==401){
              delete_cookie("accessToken");
              delete_cookie("userdata")
            }
        } catch (error) {
           console.log("user is not authorized")
        }
    };
    const logout =async ()=> {
      try { 
          
          const loginResponse = await axios.post('http://localhost:8081/auth/logout', {
          headers: {
              "Content-Type": "application/json",
              "userId":( getCookie("userdata")),
              ...(getCookie("accessToken") ? { Authorization: "Bearer " + getCookie("accessToken") } : {}),
          }
          }, {
              withCredentials: true 
          },);
          delete_cookie('accessToken');
          delete_cookie("userdata");
          console.log('Logged out successfully');
          window.location.href="/login";   
      } catch (error) {
        console.log(error)
      }    
    }
    if (isActive){
      checkAndRefreshToken();
    }else{
      logout();
    }
    
}, [ token, isActive]);
  return (
    <Router history={history}>
        <Provider store={store}>
          <div className='project_container'>
            <AllRoutes/>
          </div>
        </Provider>
    </Router>
  );
}

export default App;
