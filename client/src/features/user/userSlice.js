import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/auth.service";

export const signupUser = createAsyncThunk(
  "users/signupUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await authService.signup(username, email, password);
      let data = await response.json();
      console.log("data", data);

      if (response.status === 200) {
        // localStorage.setItem('token', data.token);
        return { ...data, username: username, email: email };
      } else {
        console.log("response is something else");
        console.log(data);
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      console.log("Error", error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "users/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await authService.login(email, password);
      let data = await response.json();
      console.log("response", data);
      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        return data;
      } else {
        console.log("response is something else");
        console.log(data);
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      console.log("Error", error.response.data);
      thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserByToken = createAsyncThunk(
  "users/fetchUserByToken",
  async ({ token }, thunkAPI) => {
    try {
      const response = await authService.fetchUserByToken(token)
      let data = await response.json();
      console.log("data", data, response.status);

      if (response.status === 200) {
        return { ...data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      console.log("Error", error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "users/logout", async () => {
    authService.logout()
  }
)

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: "",
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;

      return state;
    },
  },
  extraReducers: {
    [signupUser.fulfilled]: (state, { payload }) => {
      console.log("fulfilled signupUser");
      console.log("payload", payload);
      state.isFetching = false;
      state.isSuccess = true;
    },
    [signupUser.pending]: (state) => {
      console.log("pending signupUser");
      state.isFetching = true;
    },
    [signupUser.rejected]: (state, { payload }) => {
      console.log("rejected signupUser");
      const message = payload.validationErrors.error.msg;
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = message;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      console.log("fulfilled loginUser");
      console.log(payload);
      state.user = payload
      state.isFetching = false;
      state.isSuccess = true;
      return state;
    },
    [loginUser.rejected]: (state, { payload }) => {
      console.log("rejected loginUser. payload", payload);
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [loginUser.pending]: (state) => {
      console.log("pending loginUser");
      state.isFetching = true;
    },
    [fetchUserByToken.pending]: (state) => {
      console.log("pending fetchUserByToken");
      state.isFetching = true;
    },
    [fetchUserByToken.fulfilled]: (state, { payload }) => {
      state.user = payload
      state.isFetching = false;
      state.isSuccess = true;

      state.email = payload.email;
      state.username = payload.name;
    },
    [fetchUserByToken.rejected]: (state) => {
      state.isFetching = false;
      state.isError = true;
    },
  },
});

export const { clearState } = userSlice.actions;

export const userSelector = (state) => state.user;

export default userSlice.reducer;
