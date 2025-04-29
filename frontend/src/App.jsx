import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from "./Components/Start";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import SearchPage from "./Components/SearchPage";
import Tours from "./Components/Tours";               
import TourDetails from "./Components/TourDetails";    
import ForgotPassword from './Components/ForgotPassword';
import './App.css';
// import "./styles/tour.css";  

const url = 'http://localhost:3000/api'
fetch(url);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Start />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/searchpage" element={<SearchPage />} />
        <Route path = "/forgotPassword" element = {<ForgotPassword />}></Route>

        {/* Main Page */}
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:id" element={<TourDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;