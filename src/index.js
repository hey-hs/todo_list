import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";  // Importing the Tailwind CSS
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// Rendering the app with React Router
const root=ReactDOM.createRoot( document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  
  </BrowserRouter>
 
);
