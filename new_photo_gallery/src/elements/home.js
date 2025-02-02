import React from "react";
import { Link } from "react-router-dom";
import { Header_home } from "./header";
import { Advertisement_home } from "./advertisement";
import { Services } from "./services";
import { Nav_Bar } from "./nav_bar_home";
export const Home=()=>{
    return(
        <>
            <div className="home_container">
                <Advertisement_home/>
                <Header_home/>
                <Services/>
                <Nav_Bar/>
            </div>
        </>
    );
}