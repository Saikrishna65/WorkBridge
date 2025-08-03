import { Routes, Route, useNavigate } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import AuthForm from "./pages/AuthForm";
import Home from "./pages/Home";
import CompleteProfile from "./pages/CompleteProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import FreelancerDetails from "./pages/FreelancerDetails";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import { useEffect } from "react";
import AssignProject from "./pages/AssignProject";
import RelevantProjects from "./pages/RelevantProjects";

const App = () => {
  const { loading, user } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role === "freelancer" && user.profileCompleted) {
      navigate("/freelancer/dashboard");
    }
    if (!loading && user?.role === "freelancer" && !user.profileCompleted) {
      navigate("/freelancer/complete-profile");
    }
  }, [loading, user, navigate]);

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
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute role={"user"}>
            <ClientDashboard />
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
      <Route
        path="/freelancer/:id"
        element={
          <ProtectedRoute role={"user"}>
            <FreelancerDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assign/:freelancerId"
        element={
          <ProtectedRoute role={"user"}>
            <AssignProject />
          </ProtectedRoute>
        }
      />

      <Route
        path="/freelancer/dashboard"
        element={
          <ProtectedRoute role={"freelancer"}>
            <FreelancerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
