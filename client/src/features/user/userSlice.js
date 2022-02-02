import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import { authenticate, updateUserCookie } from "../../utils/cookies";

export const signupUser = createAsyncThunk(
  "users/signupUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await authService.signup(username, email, password);
      const data = response.data;

      if (response.status === 200) {
        return { data };
      } else {
        console.log(data);
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "users/login",
  async ({ email, password }, thunkAPI) => {
    console.log(email, password)
    try {
      const response = await authService.login(email, password);
      console.log({ response: response });
      let data = await response.data;
      if (response.status === 200) {
        console.log(data.token);
        authenticate(data);
        return data.user;
      } else {
        console.log("response is something else");
        console.log(data);
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      console.log(error);
      console.log("Error", error.response.data);
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);
 
export const updateUser = createAsyncThunk(
  "users/update",
  async ({ token, username, password, role }, state, thunkAPI) => {
    try {
      const response = await userService.update(token, username, password);
      console.log({ response: response });
      let data = await response.data;
      if (response.status === 200) {
        updateUserCookie(data)
        return data;
      } else {
        console.log("response is something else");
        console.log(data);
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      console.log(error);
      console.log("Error", error.response.data);
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const logout = createAsyncThunk("users/logout", async () => {
  authService.logout();
});

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: "",
    isFetching: false,
    isSuccess: false,
    isError: false,
    successMessage: "",
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;

      return state;
    },
    clearUser: (state) => {
      state.user = "";
      return state;
    },
  },
  extraReducers: {
    [signupUser.fulfilled]: (state, { payload }) => {
      console.log("fulfilled signupUser");
      console.log({ payload: payload });
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.successMessage = payload.data.message;
    },
    [signupUser.pending]: (state) => {
      console.log("pending signupUser");
      state.isFetching = true;
    },
    [signupUser.rejected]: (state, { payload }) => {
      console.log("rejected signupUser");
      console.log({ payload: payload });
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.errorMessage = payload.error;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      console.log("fulfilled loginUser");
      console.log(payload);
      state.user = payload;
      state.isFetching = false;
      state.isSuccess = true;
      state.isError = false;
      return state;
    },
    [loginUser.rejected]: (state, { payload }) => {
      console.log("rejected loginUser. payload", payload);
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.errorMessage = payload;
    },
    [loginUser.pending]: (state) => {
      console.log("pending loginUser");
      state.isFetching = true;
    },
    [updateUser.fulfilled]: (state, { payload }) => {
      console.log("fulfilled updateUser");
      console.log({ payload: payload });
      state.user = payload;
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.successMessage = "user updated";
    },
    [updateUser.pending]: (state) => {
      console.log("pending updateUser");
      state.isFetching = true;
    },
    [updateUser.rejected]: (state, { payload }) => {
      console.log("rejected updateUser");
      console.log({ payload: payload });
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.errorMessage = payload.error;
    },
  },
});

export const { clearState, clearUser } = userSlice.actions;

export const userSelector = (state) => state.user;

export default userSlice.reducer;
