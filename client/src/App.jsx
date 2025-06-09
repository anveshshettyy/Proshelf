import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Collections from './Pages/Collections'
import ProtectedRoute from './Components/ProtectedRoute'
import Login from './Pages/Login'
import Home from './Pages/Home'
import SmoothScrollWrapper from './Components/SmoothScrollWrapper'
import SignUp from './Pages/SignUp'
import Profile from './Pages/Profile'
import Project from './Pages/Project'
import ProjectList from './Pages/ProjectList'


export default function App() {
  return (
    <SmoothScrollWrapper>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/collections' element={<ProtectedRoute><Collections /></ProtectedRoute>} />
        <Route path='/projects/:id' element={<ProtectedRoute> <ProjectList /></ProtectedRoute>} />
        <Route path='/project/:id' element={<ProtectedRoute> <Project /></ProtectedRoute>} />
      </Routes>
    </SmoothScrollWrapper>
  )
}
