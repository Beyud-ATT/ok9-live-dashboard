import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { login as loginAPI } from "../services/authAPI";
import { toast } from "react-toastify";
import { logoutHelper } from "../utils/helper";
import { useNavigate } from "react-router";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") !== null
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const logout = useCallback(async () => {
    try {
      logoutHelper();
      setIsAuthenticated(false);
    } catch (error) {
      toast.error(error.message);
      console.error("Error in logout:", error);
      throw error;
    }
  }, []);

  const handleAuthUser = useCallback(
    async (res, message) => {
      if (res.status === 200) {
        const { token, refreshToken, userId, userCode, displayName, userType } =
          res.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userCode", userCode);
        localStorage.setItem("displayName", displayName);
        localStorage.setItem("userType", userType);
        setIsAuthenticated(true);
        navigate("/");
        if (message) {
          toast.success(message);
        }

        return;
      }
    },
    [navigate]
  );

  const handleUnauthenticated = useCallback(
    async (res) => {
      if (res.status === 401) {
        if (res.data.error === -4) {
          await logout();
        }
        setIsAuthenticated(false);

        return;
      }
    },
    [logout]
  );

  const login = useCallback(
    async (data) => {
      try {
        const res = await loginAPI(data);
        await handleAuthUser(res, res.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
        console.error("Error in login:", error);
        handleUnauthenticated(error.response);
        throw error;
      }
    },
    [handleAuthUser, handleUnauthenticated]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        handleAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
