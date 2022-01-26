import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import activationReducer from '../features/activation/activationSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    activation: activationReducer,
  },
});
