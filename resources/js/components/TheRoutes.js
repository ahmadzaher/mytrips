import React, { useContext } from 'react';
import Login from "./Login";
import { Route, HashRouter, Routes, BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute';
import { GuestRoute } from './GuestRoute/GuestRoute';
import Dashboard from './Dashboard/Dashboard';
import Loading from './Loading/Loading';
import { AuthContext } from '../Context/UserContext';

function TheRoutes() {

    const {isReady} = useContext(AuthContext)

    if(!isReady)
        return <Loading />
    return (
            <HashRouter>
                <Routes>
                        <Route path="/" element={<GuestRoute />}>
                            <Route path="/" element={<Login />} />
                            <Route path="/app/login" element={<Login />} />
                        </Route>
                        <Route path="/" element={<ProtectedRoute />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/app/dashboard" element={<Dashboard />} />
                        </Route>
                </Routes>
            </HashRouter>
    );
}

export default TheRoutes;
