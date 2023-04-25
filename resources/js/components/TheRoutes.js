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
import Advertisements from './Dashboard/Advertisements';
import Orders from './Dashboard/Orders';

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
                            <Route path="/" element={<Index title={'لوحة التحكم'} component={Dashboard} />} />
                            <Route path="/app/dashboard" element={<Index title={'لوحة التحكم'} component={<Dashboard />} />} />
                            <Route path="/app/users" element={<Index title={'قائمة المستخدمين'} component={<Users type={'user'} />} />} />
                            <Route path="/app/staffs" element={<Index title={'قائمة الموظفين'} component={<Users type={'staff/user'} />} />} />
                            <Route path="/app/allowed_packages" element={<Index title={'الأغراض المسموحة'} component={<AllowedPackages />} />} />
                            <Route path="/app/advertisements" element={<Index title={'قائمة الاعلانات'} component={<Advertisements />} />} />
                            <Route path="/app/orders" element={<Index title={'قائمة الطلبيات'} component={<Orders />} />} />
                        </Route>
                </Routes>
            </HashRouter>
    );
}

export default TheRoutes;
