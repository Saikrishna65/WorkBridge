import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Try to fetch user from access token
  const fetchUser = async (accessToken) => {
    try {
      const res = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Access token invalid or expired:", err.message);
      await tryRefreshToken();
    } finally {
      setLoading(false); // ✅ always end loading
    }
  };

  // Try to refresh token
  const tryRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return logout();

    try {
      const res = await API.post("/auth/refresh", { token: refreshToken });
      const newAccessToken = res.data.accessToken;

      localStorage.setItem("accessToken", newAccessToken);
      setToken(newAccessToken);
      await fetchUser(newAccessToken);
    } catch (err) {
      console.error("Refresh token expired or invalid:", err.message);
      logout();
    }
  };

  // On mount, try to fetch user
  useEffect(() => {
    const init = async () => {
      if (token) {
        await fetchUser(token);
      } else {
        setLoading(false); // ✅ handle missing token
      }
    };
    init();
  }, [token]);

  const login = async (form) => {
    const res = await API.post("/auth/login", form);
    const { accessToken, refreshToken, user } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    setUser(user);

    if (user.role === "freelancer") {
      navigate("/freelancer/complete-profile");
    } else {
      navigate("/");
    }
  };

  const register = async (form) => {
    const { role, ...data } = form;
    const endpoint =
      role === "freelancer"
        ? "/auth/register-freelancer"
        : "/auth/register-user";

    const res = await API.post(endpoint, data);
    const { accessToken, refreshToken, user } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    setUser(user);

    if (user.role === "freelancer") {
      navigate("/freelancer/complete-profile");
    } else {
      navigate("/");
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await API.post("/auth/logout", { token: refreshToken });
      }
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setToken(null);
      navigate("/auth");
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
