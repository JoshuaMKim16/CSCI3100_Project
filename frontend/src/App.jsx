import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// LOGIN PAGE
import Start from './Components/login/Start';
import Signup from './Components/login/Signup';
import Login from './Components/login/Login';
import ForgotPassword from './Components/login/ForgotPassword';
import ResetPassword from './Components/login/ResetPassword';

// MAIN PAGE
import SearchPage from './Components/main/SearchPage';
import Tours from './Components/main/Tours'; // for main page
import TourList from "./Components/main/TourList"; // for tour page
import TourDetails from './Components/main/TourDetails';
import ShoppingCart from './Components/main/ShoppingCart';
import UserProfile from './Components/UserProfile/UserProfile';
import UserActivity from './Components/UserProfile/UserActivity';
import EditUser from './Components/UserProfile/EditUser';
import Chat from "./Components/main/LiveChat"; // for socket.io chatting
import AIChat from "./Components/utils/AIChatbot"; // for AI Chatbot

// ADMIN PAGE
import Admin from './Components/Admin/Admin';
import UserManagement from './Components/Admin/UserManagement';
import AddEditUser from './Components/Admin/AddEditUser';
import LocationManagement from './Components/Admin/LocationManagement';
import AddEditLocation from './Components/Admin/AddEditLocation';
import Dashboard from './Components/Admin/Dashboard';

// UTILS
import ProtectedRoute from './Components/utils/ProtectedRoute';
import ProtectedAdminRoute from './Components/utils/ProtectedAdminRoute';
import { AuthProvider } from './Components/utils/AuthContext';
import AppLayout from './Components/utils/AppLayout';
import SubscribePage from './Components/Advertisement/SubscribePage';

import './App.css';

function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Start />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />

          {/* Protected Routes for Registered (Non-Admin) Users */}
          <Route element={<ProtectedRoute />}>
            {/* Wrap regular user pages with AppLayout */}
            <Route element={<AppLayout />}>
              <Route path="/main" element={<Tours />} />
              <Route path="/searchpage" element={<SearchPage />} />
              <Route path="/tours/:id" element={<TourDetails />} />
              <Route path="/tour" element={<TourList />} />
              <Route path="/forum" element={<Chat />} />
              <Route path="/planner" element={<ShoppingCart />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/activity" element={<UserActivity />} />
              <Route path="/subscribe" element={<SubscribePage />} />
              <Route path="/edituser" element={<EditUser />} />
            </Route>
          </Route>

          {/* Protected Admin Panel - No Ads */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin/*" element={<Admin />}>
              <Route index element={<Dashboard />} />
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