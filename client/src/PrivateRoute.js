import { Navigate, useLocation, Route } from "react-router-dom";
import { isAuth } from "./utils/cookies";

const PrivateRoute = ({ children, ...rest }) => {
  let location = useLocation();
  return (
    <>
    <Route
      {...rest}
      render={(props) =>
        isAuth() ? (
          children
        ) : (
          <Navigate to="/login" state={{ from: location }} replace />
        )
      }
    />
    </>
    
  );
};

export default PrivateRoute;
