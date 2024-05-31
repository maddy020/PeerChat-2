import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useState } from "react";
function App() {
  const [isLoggedIn, setisLoggedIn] = useState(
    localStorage.getItem("authtoken") ? true : false
  );
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
