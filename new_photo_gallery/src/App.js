
import './App.css';
import { AllRoutes } from './actions/routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import React, { useEffect }  from 'react';
import axios from 'axios';
import { Provider } from 'react-redux'
import store from './app/store';
import  {getCookie}  from './app/cookies';


let history=createBrowserHistory();
function App() {
  useEffect(() => {
    const checkAndRefreshToken = async () => {
        try {
            await axios.post('http://localhost:8081/token', {accessToken:getCookie("acessToken")}, {
                withCredentials: true  
            });
        } catch (error) {
           console.log("user is not authorized")
        }
    };

    checkAndRefreshToken();
}, []);
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
