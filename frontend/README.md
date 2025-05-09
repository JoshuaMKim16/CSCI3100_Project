# Frontend – TravelTailor

A React-based frontend for TravelTailor, a personalized travel planning application. Provides user signup/login, itinerary builder, search, chat, subscription (ad-free), and an admin dashboard for managing users and locations.

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Prerequisites](#prerequisites)  
4. [Environment Variables](#environment-variables)  
5. [Project Structure](#project-structure)   

---

## Features

- User authentication (signup, login, forgot/reset password)  
- Protected user routes: browse tours, search, tour details, planner, chat, profile & activity  
- Ad-free feature with subscription (license key) 
- Admin panel (protected) with:
  - Dashboard metrics & charts (users, comments, locations)  
  - CRUD for users & locations (with pagination & filtering)  

---

## Tech Stack

- React (v18+)  
- React Router v6  
- Material-UI (MUI) & Reactstrap  
- Axios & Fetch API  
- Recharts  
- React Dropzone 
- Socket.io (live chat)  

---

## Prerequisites

- Node.js (>=14) & npm  
- Backend API running on `http://localhost:3000`  

---

## Environment Variables

<b>For details, please inquire joshuamkim@link.cuhk.edu.hk or refer to User Manual</b>

Create a `.env` file in the ./frontend containing:

```env
REACT_APP_MAP_APIKEY='your_map_api_key'
```

---

## Project Structure

```
src/
├── Components/
│   ├─ login/
│   ├─ main/
│   ├─ Advertisement/
│   ├─ Admin/
│   ├─ UserProfile/
│   ├─ utils/
│   └─ App.jsx
└─
```