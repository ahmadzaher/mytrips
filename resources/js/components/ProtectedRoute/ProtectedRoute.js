import React, { useContext } from "react";
import {Navigate} from "react-router-dom";
import { AuthContext } from "../../Context/UserContext";

export const ProtectedRoute = ({children}) => {

    const {isLoggedIn} = useContext(AuthContext)

    if(!isLoggedIn)
        return <Navigate to="/app/login" replace />;
    return children
}
