import React from "react";
import { Link } from "react-router-dom";
import { Header_home } from "./header";
import { Advertisement_home } from "./advertisement";
import { Services } from "./services";
export const Home=()=>{
    return(
        <>
            <div className="home_container">
                <Advertisement_home/>
                <Header_home/>
                <Services/>
            </div>
        </>
    );
}