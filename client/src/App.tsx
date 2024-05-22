import { useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const socket = io("http://localhost:3000");

  useEffect(() => {
    socket.emit("wave", "Hello");
  }, []);

  return (
    <>
      <div>
        <h1>Hello</h1>
      </div>
    </>
  );
}

export default App;
