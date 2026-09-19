import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Protected from "../components/Protected.jsx";

import Home from "../interview/pages/Home.jsx";
import Interview from "../interview/pages/Interview.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },

  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
]);