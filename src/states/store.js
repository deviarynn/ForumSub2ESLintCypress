import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import usersReducer from './users/usersSlice';
import threadsReducer from './threads/threadsSlice';
import threadDetailReducer from './threadDetail/threadDetailSlice';
import leaderboardsReducer from './leaderboards/leaderboardsSlice';
import loadingReducer from './loading/loadingSlice';
import loadingMiddleware from './loading/loadingMiddleware';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    leaderboards: leaderboardsReducer,
    loading: loadingReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loadingMiddleware),
});

export default store;
