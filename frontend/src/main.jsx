import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App'
import SignUpForm from './ui/signup'
import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";

// const rootElement = document.getElementById("root");
// const root = createRoot(rootElement);
// root.render(<App />);
