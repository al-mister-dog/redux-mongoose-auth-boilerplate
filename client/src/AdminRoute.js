import { Navigate, useLocation, Route } from "react-router-dom";
import { isAuth } from "./utils/cookies";

const AdminRoute = ({ children, ...rest }) => {
  let location = useLocation();
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth() && isAuth().role === "admin" ? (
          children
        ) : (
          <Navigate to="/login" state={{ from: location }} replace />
        )
      }
    />
  );
};

export default AdminRoute;