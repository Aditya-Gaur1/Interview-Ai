/* eslint-disable no-unused-vars */

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// ==================== REGISTER ====================

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log("Register Error:", err.response?.data || err.message);

    throw err;
  }
}

// ==================== LOGIN ====================

export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log("Login Error:", err.response?.data || err.message);

    throw err;
  }
}

// ==================== LOGOUT ====================

export async function logout() {
  try {
    const response = await api.get("/api/auth/logout");

    return response.data;
  } catch (err) {
    console.log("Logout Error:", err.response?.data || err.message);

    throw err;
  }
}

// ==================== GET ME ====================

export async function getMe() {
  try {
    const response = await api.get("/api/auth/getMe");

    return response.data;
  } catch (err) {
    console.log("Get Me Error:", err.response?.data || err.message);

    throw err;
  }
}
