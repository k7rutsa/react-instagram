import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import { auth } from "./firebase";
import loader from "./images/loader.jpg";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  let [login, setlogin] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setlogin(user);
        navigate("/");
      } else {
        setlogin(null);
        navigate("/login");
      }
    });
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
