import React from "react";
import { Link } from "react-router-dom";

export function Advertisement_home(){
    return(
        <>
            <div className="advertisement_container">
                <nav className="advertisement_content">
                    <div className="advertisement_text advertisement_item">Here might have been your advertisement.</div>
                    <Link to={`/advertisement`} className="link_element"><div className="advertisement_button advertisement_item">Buy now</div></Link>
                </nav>
            </div>
        </>
    );
}