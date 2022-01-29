import axios from "axios";

const update = (token, username, password) => {
  return axios({
    method: "PUT",
    url: `${process.env.REACT_APP_API}/user/update`,
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
