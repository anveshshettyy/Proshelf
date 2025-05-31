import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Category from './Pages/Category'
import ProtectedRoute from './Components/ProtectedRoute'
import Login from './Pages/Login'
import Home from './Pages/Home'
import SmoothScrollWrapper from './Components/SmoothScrollWrapper'
import SignUp from './Pages/SignUp'
import Profile from './Pages/Profile'


export default function App() {
  return (
    <SmoothScrollWrapper>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/category' element={<ProtectedRoute><Category /></ProtectedRoute>} />
      </Routes>
    </SmoothScrollWrapper>
  )
}
