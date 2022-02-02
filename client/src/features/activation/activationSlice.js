import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/auth.service";

export const activateAccount = createAsyncThunk(
  "activation/activateAccount",
  async ({ token }, thunkAPI) => {
    try {
      const response = await authService.activateAccount(token);

      if (response.status === 200) {
        return response.data.message;
      } else {
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const activationSlice = createSlice({
  name: "activation",
  initialState: {
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
  },
  extraReducers: {
    [activateAccount.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.successMessage = payload;
    },
    [activateAccount.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.errorMessage = payload;
    },
    [activateAccount.pending]: (state) => {
      state.isFetching = true;
    },
  },
});

export const { clearState } = activationSlice.actions;

export const activationSelector = (state) => state.activation;

export default activationSlice.reducer;
