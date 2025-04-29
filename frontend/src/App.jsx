import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from "./Components/Start";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import SearchPage from "./Components/SearchPage";
import Tours from "./Components/Tours";               
import TourDetails from "./Components/TourDetails";     
// import "./styles/tour.css";  

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/searchpage" element={<SearchPage />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:id" element={<TourDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;