import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/auth/Signup"
import Login from "./pages/auth/Login"
import Activate from "./pages/auth/Activate"
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/auth/activate/:token" element={<Activate />}/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;