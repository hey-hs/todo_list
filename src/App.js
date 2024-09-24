import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import CreateToDo from "./components/CreateToDo";
// import { AuthProvider } from "./context/AuthContext";
// import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Routes>
        {/* Route for the Sign Up page */}
        <Route path="/" element={<SignUp />} />
        {/* Route for the Login page */}
        <Route path="/login" element={<Login />} />
        {/* Route for the Create To-Do List page */}
        <Route path="/todo" element={<CreateToDo />} />
      </Routes>
    </div>
  );
};

export default App;