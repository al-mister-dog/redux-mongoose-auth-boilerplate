import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Activate from "./pages/auth/Activate";
import Dashboard from "./pages/user/Dashboard";
import Private from "./pages/Private"
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
        <Route path="/private" element={<RequireAuth><Private /></RequireAuth>} />
      </Routes>
    </Router>
  );
};

function RequireAuth({children}) {
  let location = useLocation();

  if (!isAuth()) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default AppRoutes;
