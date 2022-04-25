import React, { useContext } from "react";
import {Navigate, Outlet} from "react-router-dom";
import { AuthContext } from "../../Context/UserContext";

export const GuestRoute = () => {

    const {isLoggedIn} = useContext(AuthContext)

    return !isLoggedIn ? <Outlet/> : <Navigate to="/app/dashboard"/>

}
