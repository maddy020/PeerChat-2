import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(
    localStorage.getItem("authtoken") ? true : false
  );
  const socket = io("https://peerchat-2.onrender.com");

  useEffect(() => {
    socket.emit("wave", "Hello");
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Chat isLoggedIn={isLoggedIn} setisLoggedIn={setisLoggedIn} />
          }
        />
        <Route
          path="/login"
          element={
            <Login isLoggedIn={isLoggedIn} setisLoggedIn={setisLoggedIn} />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup isLoggedIn={isLoggedIn} setisLoggedIn={setisLoggedIn} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
