import React from 'react'
import { Toaster } from "react-hot-toast";
import { RouterProvider } from 'react-router'
import { router } from "./app.routes.jsx"
import { AuthProvider } from './features/auth/auth.context.jsx'
import { InterviewProvider } from './features/interview/interview.context.jsx'


const App = () => {
  return (
    <AuthProvider>
      <InterviewProvider>
        <Toaster position="top-centera" />
        <RouterProvider router = {router} />  
      </InterviewProvider>    
    </AuthProvider>
    
  )
}
//RouterProvider is a built in component manages all the routing logic, URL matching, and component rendereing based on the current URl

export default App
