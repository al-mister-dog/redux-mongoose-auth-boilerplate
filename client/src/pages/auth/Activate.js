import { useDispatch, useSelector } from "react-redux";
import { activateAccount, userSelector, clearState } from "../../features/user/userSlice";
import { Box, Typography, Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Signup from "./Signup"
import Login from "./Login"


const signup = "signup"
const login = "login"

const Activate = ({ match }) => {
  const dispatch = useDispatch();
  const { isFetching, isSuccess, successMessage, isError, errorMessage } =
    useSelector(userSelector);
    const navigate = useNavigate()
  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true,
  });
  const [message, setMessage] = useState("");
  const [component, setcomponent] = useState("");
  const [btn, setBtn] = useState("")

  let params = useParams();
  useEffect(() => {
    attemptActivation();
  }, []);
  useEffect(() => {
    if (isError) {
      setMessage(errorMessage)
      setcomponent(signup)
      setBtn(signup)
      dispatch(clearState())
    }
    if (isSuccess) {
      setMessage(successMessage)
      setcomponent(login)
      setBtn(login)
      dispatch(clearState())
    }
  }, [isSuccess, isError]);

  const { name, token, show } = values;

  const attemptActivation = () => {
    // setValues({ ...values, buttonText: "Submitting" });
    const token = params.token;
    dispatch(activateAccount({ token }));
  };

  return (
    <>
      <Box>
        <Typography>{message}</Typography>
        {btn === signup && <Button onClick={() => navigate("/signup")}>Sign Up</Button>}
        {btn === login && <Button onClick={() => navigate("/login")}>Log In</Button>}
        {/* {component === signup && <Signup />}
        {component === login && <Login />} */}
      </Box>
    </>
  );
};

export default Activate;
