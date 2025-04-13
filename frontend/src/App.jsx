import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from './Components/Start';
import Signup from './Components/Signup';
import Login from './Components/Login';
import SearchPage from './Components/SearchPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Start />} />
        <Route path = "/signup" element = {<Signup />}></Route>
        <Route path = "/login" element = {<Login />}></Route>
        <Route path = "/searchpage" element = {<SearchPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App