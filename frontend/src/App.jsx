// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './components/login/Start';
import Signup from './components/login/Signup';
import Login from './components/login/Login';
import ForgotPassword from './components/login/ForgotPassword';
import ResetPassword from './components/login/ResetPassword';

import SearchPage from './components/main/SearchPage';
import Tours from './components/main/Tours';
import TourDetails from './components/main/TourDetails';
import ShoppingCart from './components/main/ShoppingCart';
import UserProfile from './components/UserProfile/UserProfile';

import Admin from './components/Admin/Admin';
import UserManagement from './components/Admin/UserManagement';
import AddEditUser from './components/Admin/AddEditUser';
import LocationManagement from './components/Admin/LocationManagement';
import AddEditLocation from './components/Admin/AddEditLocation';

import ProtectedRoute from './components/utils/ProtectedRoute';
import ProtectedAdminRoute from './components/utils/ProtectedAdminRoute';
import { AuthProvider } from './components/utils/AuthContext';
import AppLayout from './components/utils/AppLayout';
import Navbar from './components/utils/Navbar'
import SubscribePage from './components/Advertisement/SubscribePage';

// Testing
import TestAPIs from './TESTING/cloudinary_testing';

import './App.css';

function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Start />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/phototesting" element={<TestAPIs />} />

          {/* Protected Routes for Registered (Non-Admin) Users */}
          <Route element={<ProtectedRoute />}>
            {/* Wrap regular user pages with AppLayout */}
            <Route element={<AppLayout />}>
              <Route path="/searchpage" element={<SearchPage />} />
              <Route path="/main" element={<Tours />} />
              <Route path="/tours/:id" element={<TourDetails />} />
              <Route path="/planner" element={<ShoppingCart />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/subscribe" element={<SubscribePage />} />
            </Route>
          </Route>

          {/* Protected Admin Panel - No Ads */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin/*" element={<Admin />}>
              <Route path="users" element={<UserManagement />} />
              <Route path="users/add" element={<AddEditUser />} />
              <Route path="users/edit" element={<AddEditUser />} />
              <Route path="locations" element={<LocationManagement />} />
              <Route path="locations/add" element={<AddEditLocation />} />
              <Route path="locations/edit" element={<AddEditLocation />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  );
}

export default App;