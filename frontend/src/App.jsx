import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import Onboarding from "./pages/Onboarding";
import CheckIn from "./pages/CheckIn";
import Reward from "./pages/Reward";
import Journal from "./pages/Journal";

function RequireAuth({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <div className="phone-frame">
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route
          path="/checkin"
          element={
            <RequireAuth>
              <CheckIn />
            </RequireAuth>
          }
        />
        <Route
          path="/reward"
          element={
            <RequireAuth>
              <Reward />
            </RequireAuth>
          }
        />
        <Route
          path="/journal"
          element={
            <RequireAuth>
              <Journal />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}
