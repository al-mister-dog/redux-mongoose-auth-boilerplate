import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  userSelector,
  clearState,
} from "../../features/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuth } from "../../utils/cookies";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
} from "@material-ui/core";

export default function LogIn() {
  const dispatch = useDispatch();
  const { isFetching, isSuccess, isError, errorMessage } =
    useSelector(userSelector);
  const [helperText, setHelperText] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
    validateLogin();
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    validateLogin();
  };

  const validateLogin = () => {
    if (validEmail.test(email) && password.length > 4) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const handleKeypressLogin = (e) => {
    if (e.code === "Enter") {
      onClickLogin();
    }
  };

  const onClickLogin = async () => {
    const data = { email, password };
    dispatch(loginUser(data));
  };

  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isError) {
      setHelperText(errorMessage);
      dispatch(clearState());
    }

    if (isSuccess) {
      dispatch(clearState());
      if (isAuth() && isAuth().role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isError, isSuccess]);
  return (
    <>
      <Box>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            data-testid="email"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onKeyPress={handleKeypressLogin}
            onChange={handleChangeEmail}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onKeyPress={handleKeypressLogin}
            onChange={handleChangePassword}
          />
          <FormControlLabel
            control={<Checkbox data-testid="checkbox" value="remember" color="primary" />}
            label="Remember me"
          />
          <Typography
            variant="body1"
            style={{
              textAlign: "center",
              margin: "35px 0 5px 0",
              fontWeight: "bold",
            }}
          >
            {helperText}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            disabled={isDisabled}
            onClick={onClickLogin}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/password" style={{ textDecoration: "none" }}>
              <Typography
                align="left"
                variant="body2"
                style={{ marginTop: "5px" }}
              >
                Forgot password?
              </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Typography variant="body2" style={{ marginTop: "5px" }}>
                  {"Don't have an account? Sign Up"}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
