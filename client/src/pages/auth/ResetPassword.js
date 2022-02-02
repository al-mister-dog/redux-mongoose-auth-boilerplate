import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import axios from "axios";

const formFields = [
  { name: "password", type: "password", label: "Password" },
  { name: "passwordRepeat", type: "password", label: "Repeat Password" },
];

export default function ResetPassword() {
  let params = useParams();

  const fetchValues = {
    isFetching: false,
    isSuccess: false,
    successMessage: "",
    isError: false,
    errorMessage: "",
  };
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [helperTextColor, setHelperTextColor] = useState("");
  const [passwordValues, setpasswordValues] = useState({
    password: "",
    passwordRepeat: "",
  });
  const [errors, setErrors] = useState({
    password: false,
    passwordRepeat: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    password: "",
    passwordRepeat: "Please include number",
  });

  const validPassword = /^(?=.*[a-z])(?=.*\d).*$/;

  const checkErrors = {
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
      if (event.target.value !== passwordValues.password) {
        setErrors({ ...errors, [name]: true });
        setErrorMessages({ ...errorMessages, [name]: "passwords must match" });
      } else {
        setErrors({ ...errors, [name]: false });
        setErrorMessages({ ...errorMessages, [name]: "" });
      }
    },
  };

  const handleChange = (name) => (event) => {
    setpasswordValues({ ...passwordValues, [name]: event.target.value });
    setErrors({ ...passwordValues, [name]: false });
    setErrorMessages({ ...passwordValues, [name]: "" });
    checkErrors[name](name, event);
  };

  const handleKeypressSignup = (e) => {
    if (e.code === "Enter") {
      onClickResetPassword();
    }
  };
  const onClickResetPassword = () => {
    submitResetPassword();
  };

  const navigate = useNavigate();
  const submitResetPassword = async () => {
    try {
      await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API}/auth/reset-password`,
        data: { id: id, newPassword: passwordValues.password },
      });
      navigate("/login");
    } catch (error) {
      setHelperText("Something went wrong. Please try again")
    }
  };

  // useEffect(() => {
  //   if (isFetching) {
  //     dispatch(clearState());
  //     // setHelperText(fetchMessage);

  //   }
  //   if (isSuccess) {
  //     dispatch(clearState());
  //     setHelperText(successMessage);
  //     setHelperTextColor("black");
  //     setIsSignedUp(true);
  //   }
  //   if (isError) {
  //     dispatch(clearState());
  //     setHelperText(errorMessage);
  //     setHelperTextColor("red");
  //   }
  // }, [isSuccess, isError]);

  useEffect(() => {
    authorizePasswordReset();
  }, []);

  async function authorizePasswordReset() {
    let resetPasswordLink = params.token;
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/auth/authorize-reset-password`,
      headers: { resetPasswordLink },
    });
    setUsername(response.data.name);
    setId(response.data.id);
  }

  const fieldsAreValid =
    Object.values(errors).every((error) => error === false) &&
    Object.values(passwordValues).every((value) => value);

  return (
    <>
      <Box>
        <Typography component="h1" variant="h5">
          Hi, {username} please change password
        </Typography>
        <Box noValidate sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {formFields.map((field) => {
              const { name, type, label } = field;
              return (
                <Grid item xs={12} key={name}>
                  <TextField
                    required
                    fullWidth
                    error={errors[name] ? true : false}
                    helperText={errorMessages[name]}
                    id={name}
                    type={type}
                    label={label}
                    value={passwordValues[name]}
                    onChange={handleChange(name)}
                    onKeyPress={handleKeypressSignup}
                  />
                </Grid>
              );
            })}
          </Grid>
          {/* {isFetching && <LinearProgress />} */}
          <Typography
            variant="body1"
            style={{
              textAlign: "center",
              margin: "35px 0 5px 0",
              fontWeight: "bold",
              color: helperTextColor,
            }}
          >
            {helperText}
          </Typography>
          <Button
            id="signup-btn"
            type="submit"
            fullWidth
            variant="contained"
            disabled={!fieldsAreValid || isSignedUp}
            onClick={onClickResetPassword}
          >
            Reset
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item style={{ marginTop: "20px" }}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Typography variant="body2">
                  Already have an account? Log in
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
