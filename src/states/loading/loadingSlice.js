import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    count: 0,
  },
  reducers: {
    requestStarted: (state) => {
      state.count += 1;
    },
    requestFinished: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
  },
});

export const { requestStarted, requestFinished } = loadingSlice.actions;
export default loadingSlice.reducer;
export const selectIsLoading = (state) => state.loading.count > 0;
