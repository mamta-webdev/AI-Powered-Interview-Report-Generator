import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/interview";
import Dashboard from "./features/interview/pages/Dashboard"
import Profile from "./features/interview/pages/Profile"
import Myreports from "./features/interview/pages/Myreports"

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path:"/dashboard",
        element: <Protected><Dashboard /></Protected>
    },
    {
        path: "/reports",
        element: <Protected><Myreports /></Protected>
    },
    {
        path: "/profile",
        element: <Protected><Profile /></Protected>
    },
    {
        path:"/register",
        element: <Register />
    },
    {
        path:"/",
        element:<Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element:<Protected><Interview /></Protected>
    }
])