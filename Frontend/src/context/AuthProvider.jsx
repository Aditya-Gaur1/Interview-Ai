import { useEffect, useState } from "react";

import { AuthContext } from "./auth.context.jsx";
import { getMe } from "../api/auth.api.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const data = await getMe();

        if (isMounted) {
          if (data?.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.log(
          "Authentication check failed:",
          error.response?.data || error.message
        );

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};