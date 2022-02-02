import { useSelector, useDispatch } from "react-redux";
import {
  updateUser,
  userSelector,
  clearState,
} from "../features/user/userSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuth, getCookie, logout } from "../utils/cookies";
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
  { name: "role", type: "text", label: "Role", disabled: true },
  { name: "username", type: "text", label: "Username", disabled: false },
  { name: "email", type: "text", label: "Email", disabled: true },
  { name: "password", type: "password", label: "Password", disabled: false },
  { name: "passwordRepeat", type: "password", label: "Repeat Password", disabled: false },
];

export default function Private() {
  const { isFetching, isSuccess, successMessage, isError, errorMessage } =
    useSelector(userSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdated, setIsUpdated] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [helperTextColor, setHelperTextColor] = useState("");
  const [updateValues, setUpdateValues] = useState({
    role: "",
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const [errors, setErrors] = useState({
    role: false,
    username: false,
    email: false,
    password: false,
    passwordRepeat: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    role: "",
    username: "",
    email: "",
    password: "",
    passwordRepeat: "Please include number",
  });

  const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const validPassword = /^(?=.*[a-z])(?=.*\d).*$/;

  const token = getCookie("token");
  const checkErrors = {
    role(name, event) {
      return;
    },
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
      if (event.target.value !== updateValues.password) {
        setErrors({ ...errors, [name]: true });
        setErrorMessages({ ...errorMessages, [name]: "passwords must match" });
      } else {
        setErrors({ ...errors, [name]: false });
        setErrorMessages({ ...errorMessages, [name]: "" });
      }
    },
  };

  const handleChange = (name) => (event) => {
    setUpdateValues({ ...updateValues, [name]: event.target.value });
    setErrors({ ...updateValues, [name]: false });
    setErrorMessages({ ...updateValues, [name]: "" });
    checkErrors[name](name, event);
  };

  const handleKeypressLogin = (e) => {
    if (e.code === "Enter") {
      onClickUpdate();
    }
  };
  const onClickUpdate = () => {
    submitUserInfo();
  };

  const submitUserInfo = () => {
    const { username, password } = updateValues;
    dispatch(updateUser({ token, username, password }));
  };
  
  const loadProfile = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log("PROFILE", response);
        const { role, name, email } = response.data;
        setUpdateValues({ ...updateValues, role, username: name, email });
      })
      .catch((err) => {
        console.log("PROFILE", err);
        if (err.response.status === 401) {
          logout(() => {
            navigate("/");
          });
        }
      });
  }; 

  useEffect(() => {
    if (isFetching) {
      dispatch(clearState());
      // setHelperText(fetchMessage);
      console.log("fetching");
    }
    if (isSuccess) {
      dispatch(clearState());
      setHelperText(successMessage);
      setHelperTextColor("black");
      setIsUpdated(true);
      navigate('/dashboard')
    }
    if (isError) {
      dispatch(clearState());
      setHelperText(errorMessage);
      setHelperTextColor("red");
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    loadProfile();
  }, []);
  

  const fieldsAreValid =
    Object.values(errors).every((error) => error === false)

  return (
    <>
      <Box>
        <Typography component="h1" variant="h5">
          Update Admin Profile
        </Typography>
        <Box noValidate sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {formFields.map((field) => {
              const { name, type, label, disabled } = field;
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
                    value={updateValues[name]}
                    disabled={disabled}
                    onChange={handleChange(name)}
                    onKeyPress={handleKeypressLogin}
                  />
                </Grid>
              );
            })}
          </Grid>
          {isFetching && <LinearProgress />}
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
            type="submit"
            fullWidth
            variant="contained"
            disabled={!fieldsAreValid || isUpdated}
            onClick={onClickUpdate}
          >
            Update
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
