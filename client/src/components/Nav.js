import { Link, useNavigate } from "react-router-dom";
import { isAuth, logout } from "../utils/cookies";
import { useSelector, useDispatch } from "react-redux";
import { userSelector, clearUser } from "../features/user/userSlice";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

export default function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector(userSelector)

  return (
    <>
      <Box style={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              style={{ marginRight: "25px" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Website
            </Typography>

            {isAuth() && (
              <>
              <Link
                  to={isAuth().role === "admin" ? "/admin" : "/dashboard"}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button color="inherit">{isAuth().name}</Button>
                </Link>
              <Button
                color="inherit"
                onClick={() => {
                  logout(() => {
                    dispatch(clearUser())
                    navigate("/");
                  });
                }}
              >
                Logout
              </Button>
              </>
              
            )}
            {!isAuth() && (
              <>
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button color="inherit">Login</Button>
                </Link>
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button color="inherit">Signup</Button>
                </Link>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
