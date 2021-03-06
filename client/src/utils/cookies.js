import cookie from "js-cookie";

export const setCookie = (key, value) => {
  //eg token: 'asdadasd'
  if (window !== undefined) {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};
export const removeCookie = (key) => {
  if (window !== undefined) {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

export const getCookie = (key, value) => {
  if (window !== undefined) {
    return cookie.get(key);
  }
};

export const setInLocalStorage = (key, value) => {
  if (window !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key) => {
  if (window !== undefined) {
    localStorage.removeItem(key);
  }
};

//authenticate user by passing data to cookie and local storage during signin
export const authenticate = (data) => {
  setCookie("token", data.token);
  setInLocalStorage("user", data.user);
};

//access user from localstorage
export const isAuth = () => {
  if (window !== undefined) {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

export const logout = (callback) => {
  removeCookie("token");
  removeLocalStorage("user");
  callback();
};

export const updateUserCookie = (data) => {
  if (window !== undefined) {
    let auth = JSON.parse(localStorage.getItem("user"));
    auth = data;
    localStorage.setItem("user", JSON.stringify(auth));
  }
};
