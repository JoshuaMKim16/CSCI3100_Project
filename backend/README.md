# TravelTailor Backend API

## Table of Contents

1. [Description](#description)  
2. [Technologies](#technologies)  
3. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Environment Variables](#environment-variables)  
   - [Running the Server](#running-the-server)  
4. [API Endpoints](#api-endpoints)  
   - [Authentication](#authentication)  
   - [Users](#users)  
   - [Admin (Protected)](#admin-protected)  
   - [Locations](#locations)  
   - [Comments](#comments)  
   - [Licenses](#licenses)  
   - [Photos (Cloudinary)](#photos-cloudinary)  
   - [AI Chatbot](#ai-chatbot)  
   - [WebSocket (Real-time Chat)](#websocket-real-time-chat)    

---

## Description

This is the backend API for a TravelTailor application featuring:

- JWT-based authentication & authorization  
- Role-based access control (admin)  
- CRUD for users, locations, comments  
- Real-time chat via Socket.IO  
- Image upload & management with Cloudinary  
- AI-powered chat endpoint  

---

## Technologies

- Node.js & Express  
- MongoDB & Mongoose  
- JSON Web Tokens (JWT)  
- Socket.IO  
- Multer & Cloudinary  
- Nodemailer  

---

## Getting Started

### Prerequisites

- Node.js ≥ 14.x  
- npm or yarn  
- MongoDB Atlas URI (or local)  
- Cloudinary account  

### Environment Variables

<b>For details, please inquire joshuamkim@link.cuhk.edu.hk or refer to User Manual</b>

Create a `.env` file in the ./backend containing:

```dotenv
# MongoDB Atlas credentials
DB_USERNAME=your_mongo_username
DB_PASSWORD=your_mongo_password

# Secret for signing JWTs
JWT_SECRET=your_jwt_secret

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# API key for DeepSeek chat
DEEPSEEK_API_KEY=your_deepseek_api_key

# Email account app password for Nodemailer
APP_PASSWORD=your_email_app_password
```

### Running the Server

```bash
npm start
```

The server listens on port `3000`.

---

## API Endpoints

Base URL: `http://localhost:3000`

### Authentication

| Method | Path                   | Body                                                                 | Description                             |
| ------ | ---------------------- | -------------------------------------------------------------------- | --------------------------------------- |
| POST   | `/auth/login`          | `{ "email": "...", "password": "..." }`                              | Login → returns `{ user, token }`       |
| POST   | `/auth/signup`         | `{ "name": "...", "email": "...", "password": "...", "adminCode"? }` | Register → returns `{ user, token }`    |
| POST   | `/auth/forgot_password`| `{ "email": "..." }`                                                 | Send reset code to email                |
| POST   | `/auth/reset_password` | `{ "email": "...", "code": "...", "newPassword": "..." }`            | Verify code & update password           |

### Users

> Protected: `Authorization: Bearer <token>`

| Method | Path                | Body                              | Description                  |
| ------ | ------------------- | --------------------------------- | ---------------------------- |
| GET    | `/api/users`        | —                                 | List all users               |
| GET    | `/api/users/:id`    | —                                 | Get user by ID               |
| POST   | `/api/users`        | same as `/auth/signup`            | Alias signup                 |
| PUT    | `/api/users/:id`    | `{ "name"?,"email"?,"password"? }`| Update own profile           |
| DELETE | `/api/users/:id`    | —                                 | Delete own account           |

### Admin (Protected & Admin Only)

> Requires `is_admin=true`

| Method | Path                       | Body                              | Description                      |
| ------ | -------------------------- | --------------------------------- | -------------------------------- |
| GET    | `/api/admin/users`         | —                                 | List all users                   |
| PUT    | `/api/admin/users/:id`     | same as user PUT                  | Update any user                  |
| DELETE | `/api/admin/users/:id`     | —                                 | Delete any user                  |

### Locations

| Method | Path                       | Body                                                                                                   | Description                  |
| ------ | -------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------- |
| POST   | `/api/locations`           | `{ "name","location":[lng,lat],"address","opening_hour":[open,close],"price", "description","type":[],"picture":[] }` | Create location              |
| GET    | `/api/locations`           | —                                                                                                      | List all locations           |
| GET    | `/api/locations/:id`       | —                                                                                                      | Get location by ID           |
| PUT    | `/api/locations/:id`       | same as POST body                                                                                      | Update location              |
| DELETE | `/api/locations/:id`       | —                                                                                                      | Delete location              |

### Comments

| Method | Path                                          | Body                                                             | Description                       |
| ------ | --------------------------------------------- | ---------------------------------------------------------------- | --------------------------------- |
| POST   | `/api/comments`                               | `{ "content","author":userId,"location":locationId, "parentComment"? }` | Create (or reply to) comment      |
| GET    | `/api/comments`                               | —                                                                | List all comments                 |
| GET    | `/api/comments/location/:locationId`          | —                                                                | Comments for a location           |
| GET    | `/api/comments/user/:userId`                  | —                                                                | Comments by a user                |
| PUT    | `/api/comments/:id`                           | `{ "content": "..." }`                                           | Update comment content            |
| DELETE | `/api/comments/:id`                           | —                                                                | Delete comment                    |
| POST   | `/api/comments/:id/like`                      | —                                                                | Increment like count              |
| POST   | `/api/comments/:id/dislike`                   | —                                                                | Increment dislike count           |

### Licenses

| Method | Path                         | Body                           | Description                       |
| ------ | ---------------------------- | ------------------------------ | --------------------------------- |
| PUT    | `/api/license/:userId`       | `{ "licenseKey": "AAAA-BBBB-CCCC-DDDD" }` | Assign or update license key    |
| DELETE | `/api/license/:userId`       | —                              | Unsubscribe (clear license key)   |

### Photos (Cloudinary)

| Method | Path                      | Body                                                                      | Description           |
| ------ | ------------------------- | ------------------------------------------------------------------------- | --------------------- |
| POST   | `/api/photos/upload`      | multipart/form-data, field name `file`                                     | Upload image          |
| GET    | `/api/photos`             | —                                                                         | List recent images     |
| GET    | `/api/photos/:filename`   | —                                                                         | Fetch image details    |

### AI Chatbot

| Method | Path    | Body                         | Description                     |
| ------ | ------- | ---------------------------- | ------------------------------- |
| POST   | `/chat` | `{ "message": "your query" }`| DeepSeek-powered travel assistant |

### WebSocket (Real-time Chat)

- URL: `ws://localhost:3000` (via Socket.IO)  
- Events:  
  - Client → Server:  
    ```js
    socket.emit("chat message", { sender: "Alice", text: "Hello!" });
    ```  
  - Server → All:  
    ```js
    socket.on("chat message", msg => console.log(msg));
    ```


