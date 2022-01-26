import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Nav from "./components/Nav";
import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Activate from "./pages/auth/Activate";
import Dashboard from "./pages/user/Dashboard";
import Private from "./pages/Private";
import Admin from "./pages/Admin";

import { isAuth } from "./utils/cookies";

const AppRoutes = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/activate/:token" element={<Activate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/private"
          element={
            <RequireAuth>
              <Private />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdminAuth>
              <Admin />
            </RequireAdminAuth>
          }
        />
      </Routes>
    </Router>
  );
};

function RequireAuth({ children }) {
  let location = useLocation();
  if (!isAuth()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function RequireAdminAuth({ children }) {
  let location = useLocation();
  if (isAuth() && isAuth().role === "admin") {
    return children;
  } else {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
}

export default AppRoutes;
