import React,{useEffect} from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LogInPage from "./pages/LogInPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import {useAuthStore} from "./store/useAuthStore.js"
import { useThemeStore } from "./store/useThemeStore.js"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"

const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  const {theme} = useThemeStore()
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen w-screen">
        <Loader className="size-15 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" data-theme={theme}>
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login"/>} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"/>} />
          <Route path="/login" element={!authUser ? <LogInPage /> : <Navigate to="/"/>} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login"/>} />
        </Routes>
        <Toaster/>
      </div>
    </div>
  );
};

export default App