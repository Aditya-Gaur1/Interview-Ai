import { createBrowserRouter } from "react-router-dom";
import Login from '../pages/Login.jsx';
import Register from "../pages/Register.jsx";
import Protected from "../components/Protected.jsx";
export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected>
            <h1>HomePage</h1>
        </Protected>
    }
])