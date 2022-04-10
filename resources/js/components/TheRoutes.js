import React, { useContext } from 'react';
import Login from "./Login";
import { Route, BrowserRouter, Routes } from 'react-router-dom';
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
            <BrowserRouter>
                <Routes>
                    <Route path="/app/login" element={
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    } />
                    <Route path="/app/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
    );
}

export default TheRoutes;
