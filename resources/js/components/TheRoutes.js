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
                    <Route path="/">
                        <Route path="/app/login" element={<GuestRoute />}>
                            <Route path="/app/login" element={<Login />} />
                        </Route>
                        <Route path="/app/dashboard" element={<ProtectedRoute />}>
                            <Route path="/app/dashboard" element={<Dashboard />} />
                        </Route>
                    </Route>
                </Routes>
            </HashRouter>
    );
}

export default TheRoutes;
