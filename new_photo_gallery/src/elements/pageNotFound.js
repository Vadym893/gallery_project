import React from "react";
import { Header_home } from "./header";
import { Advertisement_home } from "./advertisement";
export function Page_Not_Found(){

    return(
        <>
        <Advertisement_home/>
            <Header_home/>
            <div className="error_container">
                <div className="error_text" >//404</div>
                <div className="error_text" >Page Not Found</div>
            </div>
        </>
    );
}