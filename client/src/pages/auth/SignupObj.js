import { useSelector, useDispatch } from "react-redux";
import {
  signupUser,
  userSelector,
  clearState,
} from "../../features/user/userSlice";
// import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button, TextField, Grid, Box, Typography } from "@material-ui/core";

const formFields = [
  { name: "username", label: "Username" },
  { name: "email", label: "Email" },
  { name: "password", label: "Password" },
  { name: "passwordRepeat", label: "Repeat Password" },
];
export default function SignUp() {
  const { isFetching, isSuccess, successMessage, isError, errorMessage } =
    useSelector(userSelector);
  const dispatch = useDispatch();
  const [helperText, setHelperText] = useState("");

  const [signupValues, setSignupValues] = useState({
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
    passwordRepeat: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    username: "",
    email: "",
    password: "",
    passwordRepeat: "Please include number",
  });

  const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const validPassword = /^(?=.*[a-z])(?=.*\d).*$/;

  const checkErrors = {
    username(name, event) {
      if (event.target.value.length < 3) {
        setErrors({ ...errors, [name]: true });
        setErrorMessages({
          ...errorMessages,
          [name]: "Must be at least 3 characters",
        });
      } else {
        setErrors({ ...errors, [name]: false });
        setErrorMessages({ ...errorMessages, [name]: "" });
      }
    },
    email(name, event) {
      if (!validEmail.test(event.target.value)) {
        setErrors({ ...errors, [name]: true });
        setErrorMessages({ ...errorMessages, [name]: "Must be valid email" });
      } else {
        setErrors({ ...errors, [name]: false });
        setErrorMessages({ ...errorMessages, [name]: "" });
      }
    },
    password(name, event) {
      if (!validPassword.test(event.target.value)) {
        setErrors({ ...errors, [name]: true });
        setErrorMessages({ ...errorMessages, [name]: "must include number" });
      } else if (event.target.value.length < 6) {
        setErrors({ ...errors, [name]: true });
        setErrorMessages({
          ...errorMessages,
          [name]: "must be at least 6 characters",
        });
      } else {
        setErrors({ ...errors, [name]: false });
        setErrorMessages({ ...errorMessages, [name]: "" });
      }
    },
    passwordRepeat(name, event) {
      if (event.target.value !== signupValues.password) {
        setErrors({ ...errors, [name]: true });
        setErrorMessages({ ...errorMessages, [name]: "passwords must match" });
      } else {
        setErrors({ ...errors, [name]: false });
        setErrorMessages({ ...errorMessages, [name]: "" });
      }
    },
  };

  const handleChange = (name) => (event) => {
    setSignupValues({ ...signupValues, [name]: event.target.value });
    setErrors({ ...signupValues, [name]: false });
    setErrorMessages({ ...signupValues, [name]: "" });
    checkErrors[name](name, event);
  };

  const handleKeypressSignup = (e) => {
    if (e.code === "Enter") {
      onClickSignup();
    }
  };
  const onClickSignup = () => {
    submitUserInfo();
  };

  const submitUserInfo = () => {
    const { username, email, password } = signupValues;
    console.log({username, email, password})
    // dispatch(signupUser({ username, email, password }));
  };

  // useEffect(() => {
  //   return () => {
  //     dispatch(clearState());
  //   };
  // }, []);

  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(clearState());
  //     setHelperText(successMessage);
  //   }
  //   if (isError) {
  //     dispatch(clearState());
  //     setHelperText(errorMessage);
  //   }
  // }, [isSuccess, isError]);

  const fieldsAreValid =
    Object.values(errors).every((error) => error === false) &&
    Object.values(signupValues).every((value) => value);

  return (
    <>
      <Box>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          noValidate
          sx={{ mt: 2 }}
        >
          <Grid container spacing={2}>
            {formFields.map((field) => {
              const { name, label } = field;
              return (
                <Grid item xs={12} key={name}>
                  <TextField
                    required
                    fullWidth
                    error={errors[name] ? true : false}
                    helperText={errorMessages[name]}
                    id={name}
                    label={label}
                    type={name === "passwordRepeat" ? "password" : name}
                    value={signupValues[name]}
                    onKeyPress={handleKeypressSignup}
                    onChange={handleChange(name)}
                  />
                </Grid>
              );
            })}
          </Grid>
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
            type="submit"
            fullWidth
            variant="contained"
            disabled={!fieldsAreValid}
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
    </>
  );
}
