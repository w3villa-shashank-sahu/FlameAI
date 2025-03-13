// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { Router, Routes } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MyRoutes } from './backend/const.js'
import LoginPage from './pages/login.jsx'
import SignupPage from './pages/signup.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path={MyRoutes.home} element={<App />} />
      <Route path={MyRoutes.login} element={<LoginPage/>} />
      <Route path={MyRoutes.signup} element={<SignupPage/>} />
    </Routes>
  </Router>
)
