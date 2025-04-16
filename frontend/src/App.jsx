import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from './Components/Start';
import Signup from './Components/Signup';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import './App.css';

const url = 'http://localhost:3000/api'
fetch(url);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Start />} />
        <Route path = "/signup" element = {<Signup />}></Route>
        <Route path = "/login" element = {<Login />}></Route>
        <Route path = "/forgotPassword" element = {<ForgotPassword />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App