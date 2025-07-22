import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Collections from './Pages/Collections'
import ProtectedRoute from './Components/ProtectedRoute'
import Login from './Pages/Login'
import Home from './Pages/Home'
import SmoothScrollWrapper from './Components/SmoothScrollWrapper'
import SignUp from './Pages/SignUp'
import ProfileDashboard from './Pages/ProfileDashboard'
import Project from './Pages/Project'
import ProjectList from './Pages/ProjectList'
import Profile from './Pages/User/Profile'
import UserCollections from './Pages/User/UserCollections'
import UserProjectsList from './Pages/User/UserProjectsList'
import UserProject from './Pages/User/UserProject'


export default function App() {
  return (
    <SmoothScrollWrapper>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<ProtectedRoute><ProfileDashboard /></ProtectedRoute>} />
        <Route path='/collections' element={<ProtectedRoute><Collections /></ProtectedRoute>} />
        <Route path='/projects/:id' element={<ProtectedRoute> <ProjectList /></ProtectedRoute>} />
        <Route path='/project/:id' element={<ProtectedRoute> <Project /></ProtectedRoute>} />
        <Route path='/:username/collections' element={<UserCollections />} />
        <Route path='/:username/:collectionSlug/:projectSlug' element={<UserProject />} />
        <Route path='/:username/:collectionSlug' element={<UserProjectsList />} />
        <Route path='/:username' element={<Profile />} />

      </Routes>
    </SmoothScrollWrapper>
  )
}
