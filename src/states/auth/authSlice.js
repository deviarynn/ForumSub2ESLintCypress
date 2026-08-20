import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }) => {
    const user = await api.register({ name, email, password });
    return user;
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }) => {
    const token = await api.login({ email, password });
    api.putAccessToken(token);
    const user = await api.getOwnProfile();
    return user;
  },
);

// used on app start to restore session from a stored token
export const loadAuthUser = createAsyncThunk(
  'auth/loadAuthUser',
  async (_, { rejectWithValue }) => {
    if (!api.getAccessToken()) return rejectWithValue('no token');
    try {
      const user = await api.getOwnProfile();
      return user;
    } catch (error) {
      api.removeAccessToken();
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    isPreloading: true,
  },
  reducers: {
    logoutUser: (state) => {
      api.removeAccessToken();
      state.user = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadAuthUser.pending, (state) => {
        state.isPreloading = true;
      })
      .addCase(loadAuthUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isPreloading = false;
      })
      .addCase(loadAuthUser.rejected, (state) => {
        state.user = null;
        state.isPreloading = false;
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
