import React,{useEffect,useState} from "react";
import { Header_home } from "./header";
import { useParams } from 'react-router-dom';
import { Advertisement_home } from "./advertisement";
import { useDispatch,useSelector } from "react-redux";
import { follow,unfollow } from "../app/followersSlice";
import PopupForm from "./pop-up_upload_form";
import UserImages from "./user_gallery";
import axios from "axios";
import { getCookie } from "../app/cookies";
export function User_page(){
    const  id  = useParams().id;
    const [users, setUsers] = useState({nickname:""});
    const [error, setError] = useState();
    const [showPopup, setShowPopup] = useState(false);
    const dispatch = useDispatch();
    const count = useSelector(state => state.counter.value)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        
        const fetchData = async () => {
                    
            try {

                const response = await axios.post(
                    'http://localhost:8081/maindata',
                    {
                        id: getCookie("userdata"),
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            ...(localStorage.authToken
                                ? { Authorization: "Bearer " + getCookie("accessToken") }
                                : {}),
                        },
                        withCredentials: true, 
                    }
                );
                setUsers(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); 

    const isSubscribed = useSelector(
        (state) => state.counter.users.includes(id)
    );
    const handleSubscribeToggle = () => {
        if (isSubscribed) {
        dispatch(unfollow(id));
        } else {
        dispatch(follow(id));
        }
    };
    return(
        <>
        {showPopup && <PopupForm onClose={() => setShowPopup(false)} />}
        <Advertisement_home/>
            <Header_home onAddClick={() => setShowPopup(true)}/>
            
            <div className="profile_container">
                <div className="profile_header">
                    <div className="profile_picture">
                        <div id="pfp_holder">
                            <img id="pfp"></img>
                        </div>
                    </div>
                    <div className="info_holder">
                        <div className="row">
                            <div className="username">{users.nickname}</div>
                            {id!=getCookie("userdata" ) && getCookie("userdata")!=false?
                                <button onClick={handleSubscribeToggle}>{isSubscribed ? 'Unsubscribe' : 'Subscribe'}</button>
                            :null}
                            <div className="edit_profile"><button>Edit Profile</button></div>
                        </div>
                        <div className="row">
                            <div>Posts:</div>
                            <div>Followers:{count}</div>
                            <div>Following:</div>
                        </div>
                        <div className="row">
                            <div className="about_yourself">Yet nothing</div>
                        </div>
                    </div>
                </div>
                
                <div className="profile_body">
                    <UserImages userId={id}/>
                   
                </div>
            </div>
        </>
    );
}