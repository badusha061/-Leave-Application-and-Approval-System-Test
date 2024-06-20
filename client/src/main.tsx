import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {  Route, RouterProvider, createBrowserRouter , createRoutesFromElements } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Otp from './pages/Otp.tsx'
import HomePage from './pages/Home.tsx'
import Manager from './pages/Manager.tsx'
import TotalleavesReport from './pages/TotalleavesReport.tsx'
import ProtectedRoute from './utils/ProtectedRoute.tsx'



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route  >
       <Route path='/' element={<ProtectedRoute> <HomePage />  </ProtectedRoute> } />
       <Route path='/login' element={<Login />} />
       <Route path='/register' element={<Register />} />
       <Route path='/otp' element={<Otp />} />
       <Route path='/manager' element={<ProtectedRoute><Manager /> </ProtectedRoute> } />
       <Route path='/report' element={ <ProtectedRoute> <TotalleavesReport /> </ProtectedRoute> } />
    </Route> 
  )
    
)


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)