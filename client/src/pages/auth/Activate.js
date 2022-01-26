import { useDispatch, useSelector } from "react-redux";
import {
  activateAccount,
  activationSelector,
  clearState,
} from "../../features/activation/activationSlice";
import { Box, Typography, LinearProgress } from "@material-ui/core";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";

const signup = "signup";
const login = "login";
const fetching = "fetching";

export default function Activate() {
  const dispatch = useDispatch();
  const { isFetching, isSuccess, successMessage, isError, errorMessage } =
    useSelector(activationSelector);
  const [message, setMessage] = useState("");
  const [component, setcomponent] = useState("");

  let params = useParams();

  useEffect(() => {
    attemptActivation();
  }, []);

  useEffect(() => {
    if (isError) {
      setMessage(errorMessage);
      setcomponent(signup);
      dispatch(clearState());
    }
    if (isSuccess) {
      setMessage(successMessage);
      setcomponent(login);
      dispatch(clearState());
    }
    if (isFetching) {
      setcomponent(fetching)
    }
  }, [isSuccess, isError]);

  const attemptActivation = () => {
    const token = params.token;
    dispatch(activateAccount({ token }));
  };
  if (component === fetching) {
    return (
      <>
        <LinearProgress />
      </>
    );
  }
  return (
    <>
      <Box>
        <Typography>{message}</Typography>
        {component === signup && <Signup />}
        {component === login && <Login />}
      </Box>
    </>
  );
}
