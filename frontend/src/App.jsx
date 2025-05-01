import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './Components/login/Start';
import Signup from './Components/login/Signup';
import Login from './Components/login/Login';
import SearchPage from './Components/main/SearchPage';
import Tours from './Components/main/Tours';
import TourDetails from './Components/main/TourDetails';
import ForgotPassword from './Components/login/ForgotPassword';
import ResetPassword from './Components/login/ResetPassword';
import Admin from './Components/Admin/Admin';
import UserManagement from './Components/Admin/UserManagement';
import AddEditUser from './Components/Admin/AddEditUser';
import LocationManagement from './Components/Admin/LocationManagement';
import AddEditLocation from './Components/Admin/AddEditLocation';
import ProtectedAdminRoute from './Components/utils/ProtectedAdminRoute';
import { AuthProvider } from './Components/utils/AuthContext';

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

          {/* Protected Admin Panel - Admin components now reside in Components/Admin */}
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