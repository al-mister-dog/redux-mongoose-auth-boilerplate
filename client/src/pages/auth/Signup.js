import { useSelector, useDispatch } from "react-redux";
import { signupUser, userSelector, clearState } from "../../redux/app/features/userSlice";
// import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  Paper,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  makeStyles,
} from "@material-ui/core";

// import owl from "../__owl.jpeg";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#fdfbf7",
    maxWidth: "70vw",
    maxHeight: "80vh",
    margin: "auto",
    marginTop: "2rem",
    padding: "25px",
    display: "flex",
    "@media (max-width: 620px)": {
      minHeight: "70vh",
      width: "100vw",
      padding: "5px",
      flexDirection: "column",
      maxHeight: "200vh",
    },
  },
  welcome: {
    width: "50%",
    "@media (max-width: 620px)": {
      padding: "10px",
      // display: "flex",
      // alignItems: "center",
      width: "90%",
      margin: "auto",
    },
  },
  img: {
    "@media (max-width: 620px)": {
      width: "10rem",
    },
  },
  title: {
    "@media (max-width: 620px)": {
      // fontSize: "1.5rem"
      display: "none",
    },
  },
  auth: {
    width: "50%",
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "@media (max-width: 620px)": {
      marginTop: 4,
      width: "90%",
      margin: "auto",
    },
  },
}));

export default function SignUp() {
  const dispatch = useDispatch();

  const { isFetching, isSuccess, isError, errorMessage } =
    useSelector(userSelector);
  const [errorMsg, setErrorMsg] = useState("");

  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [errorName, setErrorName] = useState(false);
  const [errorNameMessage, setErrorNameMessage] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorEmailMessage, setErrorEmailMessage] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorPasswordMessage, setErrorPasswordMessage] = useState(
    "Please include number"
  );
  const [errorPasswordRepeat, setErrorPasswordRepeat] = useState(false);
  const [errorPasswordRepeatMessage, setErrorPasswordRepeatMessage] =
    useState("");
  const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const validPassword = /^(?=.*[a-z])(?=.*\d).*$/;

  const handleChangeName = (event) => {
    setUsername(event.target.value);
    setErrorName(false);
    setErrorNameMessage("");
    if (event.target.value.length < 3) {
      setErrorName(true);
      setErrorNameMessage("Must be at least 3 characters");
    } else {
      setErrorName(false);
      setErrorNameMessage("");
    }
  };
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
    setErrorEmail(false);
    setErrorEmailMessage("");
    if (!validEmail.test(event.target.value)) {
      setErrorEmail(true);
      setErrorEmailMessage("Must be valid email");
    } else {
      setErrorEmail(false);
      setErrorEmailMessage("");
    }
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    setErrorPassword(false);
    setErrorPasswordMessage("");
    if (!validPassword.test(event.target.value)) {
      setErrorPassword(true);
      setErrorPasswordMessage("must include number");
    } else if (event.target.value.length < 6) {
      setErrorPassword(true);
      setErrorPasswordMessage("must be at least 6 characters");
    } else {
      setErrorPassword(false);
      setErrorPasswordMessage("");
    }
  };
  const handleChangePasswordRepeat = (event) => {
    setPasswordRepeat(event.target.value);
    setErrorPasswordRepeat(false);
    setErrorPasswordRepeatMessage("");
    if (event.target.value !== password) {
      setErrorPasswordRepeat(true);
      setErrorPasswordRepeatMessage("passwords must match");
    } else {
      setErrorPasswordRepeat(false);
      setErrorPasswordRepeatMessage("");
    }
  };
  const handleKeypressSignup = (e) => {
    if (e.code === "Enter") {
      onClickSignup();
    }
  };
  const onClickSignup = () => {
    checkFields();
  };
  const checkFields = () => {
    if (!username) {
      setErrorName(true);
      setErrorNameMessage("Please enter this field");
    }
    if (!email) {
      setErrorEmail(true);
      setErrorEmailMessage("Please enter this field");
    }
    if (!password) {
      setErrorPassword(true);
      setErrorPasswordMessage("Please enter this field");
    }
    if (!passwordRepeat) {
      setErrorPasswordRepeat(true);
      setErrorPasswordRepeatMessage("Please enter this field");
    }
    if (username && email && password && passwordRepeat) {
      submitUserInfo();
    }
  };
  const submitUserInfo = () => {
    const data = { username, email, password };
    dispatch(signupUser(data));
  };

  // let navigate = useNavigate();
  // useEffect(() => {
  //   return () => {
  //     dispatch(clearState());
  //   };
  // }, []);

  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(clearState());
  //     navigate("/login");
  //   }
  //   if (isError) {
  //     dispatch(clearState());
  //     setErrorMsg(errorMessage);
  //   }
  // }, [isSuccess, isError]);

  return (
    <>
      <Paper className={classes.paper}>
        <Box className={classes.welcome}>
          {/* <img className={classes.img} src={owl} alt="owl" /> */}
          <Typography variant="h3" className={classes.title}>
            Trial of the Pyx
          </Typography>
        </Box>
        <Box className={classes.auth}>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            // component="form"
            noValidate
            // onSubmit={handleSubmit}
            sx={{ mt: 2 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  auto-complete="given-name"
                  error={errorName && true}
                  helperText={errorNameMessage}
                  id="username"
                  label="Username"
                  value={username}
                  onKeyPress={handleKeypressSignup}
                  onChange={handleChangeName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  autoComplete="email"
                  error={errorEmail && true}
                  helperText={errorEmailMessage}
                  id="email"
                  label="Email Address"
                  value={email}
                  onKeyPress={handleKeypressSignup}
                  onChange={handleChangeEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={errorPassword && true}
                  helperText={errorPasswordMessage}
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onKeyPress={handleKeypressSignup}
                  onChange={handleChangePassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  error={errorPasswordRepeat && true}
                  helperText={errorPasswordRepeatMessage}
                  id="password-repeat"
                  label="Retype Password"
                  type="password"
                  value={passwordRepeat}
                  onKeyPress={handleKeypressSignup}
                  onChange={handleChangePasswordRepeat}
                />
              </Grid>
            </Grid>
            <Typography
              variant="body1"
              style={{
                textAlign: "center",
                margin: "35px 0 5px 0",
                fontWeight: "bold",
              }}
            >
              {errorMsg}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={onClickSignup}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item style={{ marginTop: "20px" }}>
                {/* <Link to="/login"> */}
                  <Typography variant="body2">
                    Already have an account? Log in
                  </Typography>
                {/* </Link> */}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
