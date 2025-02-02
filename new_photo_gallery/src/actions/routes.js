import {Routes,Route} from "react-router-dom"
import { Home } from "../elements/home";
import { Page_Not_Found } from "../elements/pageNotFound";
import { Registration } from "../elements/registration";
import { Login } from "../elements/login";
import { User_page } from "../elements/user_profile";
import { Photo } from "../elements/photo";
export const AllRoutes=()=>{
    return(
        <Routes>
            <Route index element={<Home/>}/>
            <Route path="/signup" element={<Registration/>}/>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="*" element={<Page_Not_Found/>}></Route>
            <Route path="/profiles/:id" element={<User_page/>}></Route>
            <Route path="/profile/p" element={<Photo/>}></Route>
        </Routes>
    );
}