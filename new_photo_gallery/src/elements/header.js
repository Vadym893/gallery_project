import React,{useState} from "react";
import { Link } from "react-router-dom";
import { getCookie,delete_cookie } from "../app/cookies";

export  function Header_home({onAddClick}){
    const scroll_top=()=>{
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
    const [isMenuVisible, setMenuVisible] = useState(false);
    
    const toggleMenu = () => {
      setMenuVisible(!isMenuVisible);
    };
    async function logout() {
            delete_cookie('accessToken');
            console.log('Logged out successfully');
            window.location.href="/login";
    }  
    return(
        <>
            <div className="header_container">
                {getCookie("accessToken")!==false?
                <nav className="header_menu">
                    <Link to={`/`} className="link_element"><div  className="header_logo " onClick={scroll_top} style={{flexGrow:2}}>
                        <div>Logo gotta be</div>
                    </div></Link>
                    <ul className="header_list " style={{flexGrow:4}}>
                        <li><div className="header_list_item">About us</div></li>
                        <li><div className="header_list_item">Services</div></li>
                        <li><div className="header_list_item">Public photos</div></li>
                        <li><div className="header_list_item">Public videos</div></li>
                    </ul>
                    <ul className="header_list " style={{flexGrow:0.5}}>
                        <li><div className="header_list_item">Price</div></li>
                        <li><div className="header_list_item"><svg width="1vw" height="1vw" className="language_choose"><circle cx="10" cy="10" r="8"fill="transparent" stroke="black" strokeWidth={2}/><line x1="2" y1="8" x2="18" y2="8" stroke="black"  /><line x1="2" y1="12" x2="18" y2="12" stroke="black" /><path d="M 10 2 C 10 2, 17 10, 10 18" stroke="black" fill="transparent" /><path d="M 10 2 C 10 2, 3 10, 10 18" stroke="black" fill="transparent" /></svg></div></li>
                        <li>
                            <div id="settings" className="header_list_item" onClick={toggleMenu}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                <div id={`menu-popup${isMenuVisible ? 'visible' : ''}`}>
                                <ul className="menu-list">
                                    <li className="menu-item"><Link to={`/profiles/${getCookie("userdata")}`}>Profile</Link></li>
                                    <li  className="menu-item">Saved</li>
                                    <li className="menu-item">Account privacy</li>
                                    <li className="menu-item">Favourites</li>
                                    <li className="menu-item">Account setting</li>
                                    {window.location.pathname===`/profiles/${getCookie("userdata")}`?<li className="menu-item" onClick={() => onAddClick()}>Create</li>:null}
                                    <li className="menu-item"onClick={logout}>Log Out</li>
                                </ul>
                            </div>
                            </div>
                            
                        </li>
                    </ul>
                    
                </nav>
                :
                <nav className="header_menu">
                    <Link to={`/`} className="link_element"><div  className="header_logo " onClick={scroll_top} style={{flexGrow:2}}>
                        <div>Logo gotta be</div>
                    </div></Link>
                    <ul className="header_list " style={{flexGrow:4}}>
                        <li><div className="header_list_item">About us</div></li>
                        <li><div className="header_list_item">Services</div></li>
                        <li><div className="header_list_item">Public photos</div></li>
                        <li><div className="header_list_item">Public videos</div></li>
                    </ul>
                    <ul className="header_list ">
                        <li><div className="header_list_item">Price</div></li>
                        <li><div className="header_list_item"><svg width="1vw" height="1vw" className="language_choose"><circle cx="10" cy="10" r="8"fill="transparent" stroke="black" strokeWidth={2}/><line x1="2" y1="8" x2="18" y2="8" stroke="black"  /><line x1="2" y1="12" x2="18" y2="12" stroke="black" /><path d="M 10 2 C 10 2, 17 10, 10 18" stroke="black" fill="transparent" /><path d="M 10 2 C 10 2, 3 10, 10 18" stroke="black" fill="transparent" /></svg></div></li>
                        <li><Link to={`/signup`} className="link_element"><div className="header_list_item">Sign up</div></Link></li>
                        <li><Link to={`/login`} className="link_element"><div className="header_list_item">Log in</div></Link></li>
                    </ul>
                </nav>
                }
            </div>
        </>
    );
}