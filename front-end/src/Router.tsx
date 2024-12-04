import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { LoginForm } from "./components/login-form";
import Home from "./Home";
import App from "./App";
import { RegisterForm } from "./components/register-form";
import NotFound from "./404";
import Post from "./Post";
import Mypost from "./Mypost";

function Router() {
  return useRoutes([
    {
      path: "/login",
      element: localStorage.getItem("token") ? (
        <Navigate to="/" replace />
      ) : (
        <div className="flex justify-center items-center h-dvh">
          <LoginForm />
        </div>
      ),
    },
    {
      path: "/register",
      element: localStorage.getItem("token") ? (
        <Navigate to="/" replace />
      ) : (
        <div className="flex justify-center items-center h-dvh">
          <RegisterForm />
        </div>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
    {
      path: "/404",
      element: <NotFound />,
    },
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/post",
          element: <Post />,
        },
        {
          path: "/my-post",
          element: <Mypost />,
        },
      ],
    },
  ]);
}

export default Router;
