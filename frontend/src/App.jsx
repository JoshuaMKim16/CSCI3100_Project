import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './components/login/Start';
import Signup from './components/login/Signup';
import Login from './components/login/Login';
import SearchPage from './components/main/SearchPage';
import Tours from './components/main/Tours';
import TourDetails from './components/main/TourDetails';
import ForgotPassword from './components/login/ForgotPassword';
import ResetPassword from './components/login/ResetPassword';
import Admin from './components/Admin/Admin';
import UserManagement from './components/Admin/UserManagement';
import AddEditUser from './components/Admin/AddEditUser';
import LocationManagement from './components/Admin/LocationManagement';
import AddEditLocation from './components/Admin/AddEditLocation';
import ProtectedAdminRoute from './components/utils/ProtectedAdminRoute';
import { AuthProvider } from './components/utils/AuthContext';

//testing
import TestAPIs from './TESTING/cloudinary_testing';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public/General Pages */}
          <Route path="/" element={<Start />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/searchpage" element={<SearchPage />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetails />} />

          {/* Testing */}
          <Route path="/phototesting" element={<TestAPIs />} />

          {/* Protected Admin Panel - Admin components now reside in components/Admin */}
          <Route path="/admin/*" element={
            <ProtectedAdminRoute>
              <Admin />
            </ProtectedAdminRoute>
          }>
            <Route path="users" element={<UserManagement />} />
            <Route path="users/add" element={<AddEditUser />} />
            <Route path="users/edit" element={<AddEditUser />} />
            <Route path="locations" element={<LocationManagement />} />
            <Route path="locations/add" element={<AddEditLocation />} />
            <Route path="locations/edit" element={<AddEditLocation />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;