/* eslint-disable no-unused-vars */

import { useContext } from "react";

import { AuthContext } from "../context/auth.context.jsx";

import {
  login,
  register,
  logout,
  getMe,
} from "../api/auth.api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const {
    user,
    setUser,
    loading,
    setLoading,
  } = context;


  // ==================== LOGIN ====================

  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const data = await login({
        email,
        password,
      });

      setUser(data.user);

      return {
        success: true,
        message: null,
      };

    } catch (err) {
      console.log(
        err.response?.data || err.message
      );

      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Login failed. Please try again.",
      };

    } finally {
      setLoading(false);
    }
  };


  // ==================== REGISTER ====================

  const handleRegister = async ({
    username,
    email,
    password,
  }) => {
    setLoading(true);

    try {
      const data = await register({
        username,
        email,
        password,
      });

      setUser(data.user);

      return {
        success: true,
        message: null,
      };

    } catch (err) {
      console.log(
        err.response?.data || err.message
      );

      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      };

    } finally {
      setLoading(false);
    }
  };


  // ==================== LOGOUT ====================

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();

      setUser(null);

      return {
        success: true,
        message: null,
      };

    } catch (err) {
      console.log(
        err.response?.data || err.message
      );

      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Logout failed. Please try again.",
      };

    } finally {
      setLoading(false);
    }
  };


  // ==================== GET CURRENT USER ====================

  const handleGetMe = async () => {
    setLoading(true);

    try {
      const data = await getMe();

      setUser(data.user);

      return data.user;

    } catch (err) {
      console.log(
        err.response?.data || err.message
      );

      setUser(null);

      return null;

    } finally {
      setLoading(false);
    }
  };


  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGetMe,
  };
};