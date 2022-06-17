import React, { useContext } from 'react';
import Login from "./Login";
import { Route, HashRouter, Routes, BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute';
import { GuestRoute } from './GuestRoute/GuestRoute';
import Index from './Dashboard';
import Dashboard from "./Dashboard/Dashboard";
import Loading from './Loading/Loading';
import { AuthContext } from '../Context/UserContext';
import Users from "./Dashboard/Users";
import AllowedPackages from "./Dashboard/AllowedPackages";

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
                            <Route path="/" element={<Index component={Dashboard} />} />
                            <Route path="/app/dashboard" element={<Index component={<Dashboard />} />} />
                            <Route path="/app/users" element={<Index title={'User List'} component={<Users type={'user'} />} />} />
                            <Route path="/app/staffs" element={<Index title={'Staff List'} component={<Users type={'staff/user'} />} />} />
                            <Route path="/app/allowed_packages" element={<Index title={'Allowed Packages'} component={<AllowedPackages />} />} />
                        </Route>
                </Routes>
            </HashRouter>
    );
}

export default TheRoutes;
