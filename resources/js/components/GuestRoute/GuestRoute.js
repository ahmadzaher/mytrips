import React, { useContext } from "react";
import {Navigate} from "react-router-dom";
import { AuthContext } from "../../Context/UserContext";

export const GuestRoute = ({children}) => {

    const {isLoggedIn} = useContext(AuthContext)

    if(isLoggedIn)
        return <Navigate to="/app/dashboard" replace />;
    return children
}
