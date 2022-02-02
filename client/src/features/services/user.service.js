import axios from "axios";
import { isAuth } from "../../utils/cookies";

const update = (token, username, password) => {
  let adminParam = ""
  if (isAuth().role === "admin") {
    adminParam = "/admin"
  }
  
  return axios({
    method: "PUT",
    url: `${process.env.REACT_APP_API}/user${adminParam}/update`,
    data: { name: username, password },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const userService = {
  update,
};

export default userService;
