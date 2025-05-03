import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './Components/login/Start';
import Signup from './Components/login/Signup';
import Login from './Components/login/Login';
import ForgotPassword from './Components/login/ForgotPassword';
import ResetPassword from './Components/login/ResetPassword';

import SearchPage from './Components/main/SearchPage';
import Tours from './Components/main/Tours';
import TourDetails from './Components/main/TourDetails';
import ShoppingCart from './Components/main/ShoppingCart';
import WeatherForecast from './Components/main/WeatherForecast';
import UserProfile from './Components/UserProfile/UserProfile';
import UserActivity from './Components/UserProfile/UserActivity';

import Admin from './Components/Admin/Admin';
import UserManagement from './Components/Admin/UserManagement';
import AddEditUser from './Components/Admin/AddEditUser';
import LocationManagement from './Components/Admin/LocationManagement';
import AddEditLocation from './Components/Admin/AddEditLocation';

import ProtectedRoute from './Components/utils/ProtectedRoute';
import ProtectedAdminRoute from './Components/utils/ProtectedAdminRoute';
import { AuthProvider } from './Components/utils/AuthContext';
import MainLayout from './Components/utils/MainLayout';
import SubscribePage from './Components/Advertisement/SubscribePage';

// Testing
import Chat from "./TESTING/chat_testing";

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Start />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />

          {/* Chat Testing */}
          <Route path="/chat" element={<Chat />} />

          {/* Protected Routes for Registered (Non-Admin) Users */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/searchpage" element={<SearchPage />} />
              <Route path="/main" element={<Tours />} />
              <Route path="/tours/:id" element={<TourDetails />} />
              <Route path="/planner" element={<ShoppingCart />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/activity" element={<UserActivity />} />
              <Route path="/subscribe" element={<SubscribePage />} />
              <Route path="/weatherforecast" element={<WeatherForecast/>}/>
            </Route>
          </Route>

          {/* Protected Admin Routes */}
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
  );
}

export default App;