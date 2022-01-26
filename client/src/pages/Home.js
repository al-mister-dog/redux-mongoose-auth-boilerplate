import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuth } from "../utils/cookies";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth()) {
      navigate("/dashboard");
    }
  }, []);

  return <h1>welcome</h1>;
};

export default Home;
