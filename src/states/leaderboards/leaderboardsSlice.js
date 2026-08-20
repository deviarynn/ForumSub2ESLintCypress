import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchLeaderboards = createAsyncThunk('leaderboards/fetchLeaderboards', async () => {
  const leaderboards = await api.getLeaderboards();
  return leaderboards;
});

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default leaderboardsSlice.reducer;
