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
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import { isAuth } from "./utils/cookies";

const AppRoutes = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={
            <RequireLogin>
              <Signup />
            </RequireLogin>
          }
        />
        <Route
          path="/login"
          element={
            <RequireLogin>
              <Login />
            </RequireLogin>
          }
        />
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
        <Route
          path="/auth/password/forgot"
          element={
            <RequireLogin>
              <ForgotPassword />
            </RequireLogin>
          }
        />
        <Route path="/auth/password/reset/:token" element={<ResetPassword />} />
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

function RequireLogin({ children }) {
  let location = useLocation();

  if (isAuth()) {
    return <Navigate to={-1} state={{ from: location }} replace />;
  }
  return children;
}

export default AppRoutes;
