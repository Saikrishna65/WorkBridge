import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppContextProvider, useAppContext } from "./context/AppContext";
import AuthForm from "./pages/AuthForm";
import Home from "./pages/Home";
import CompleteProfile from "./pages/CompleteProfile";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { loading } = useAppContext();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute role={"user"}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/auth" element={<AuthForm />} />
      <Route
        path="/freelancer/complete-profile"
        element={
          <ProtectedRoute role={"freelancer"}>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
