import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Button, TextField, Grid, Box, Typography, LinearProgress } from "@material-ui/core";

export default function ForgotPassword() {
  const [isFetching, setIsFetching] = useState(false)
  const [helperText, setHelperText] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
    validatePasswordRequest(event.target.value);
  };

  const validatePasswordRequest = (val) => {
    if (validEmail.test(val)) {
      setIsDisabled(false);
      setError(false);
      setErrorMessage("");
    } else {
      setIsDisabled(true);
      setError(true);
      setErrorMessage("Must be valid email");
    }
  };

  const handleKeypressLogin = (e) => {
    if (e.code === "Enter") {
      onClickSubmit();
    }
  };

  const onClickSubmit = async () => {
    try {
      setIsFetching(true)
      const response = await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API}/auth/forgot-password`,
        data: { email: email },
      });
      setHelperText(response.data.message);
      setIsDisabled(true)
      setIsFetching(false)
    } catch (error) {
      setIsFetching(false)
      if (error.response.status === 422) {
        setHelperText(error.response.data.errors);
      } else {
        setHelperText(error.response.data.error);
      }
    }
  };

  return (
    <>
      <Box>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            data-testid="email"
            margin="normal"
            required
            fullWidth
            id="email"
            error={error ? true : false}
            helperText={errorMessage}
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onKeyPress={handleKeypressLogin}
            onChange={handleChangeEmail}
          />
          {isFetching && <LinearProgress />}
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
            id="login-btn"
            variant="contained"
            disabled={isDisabled}
            onClick={onClickSubmit}
          >
            Submit
          </Button>
          <Grid container>
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
