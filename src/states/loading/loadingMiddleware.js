import { requestStarted, requestFinished } from './loadingSlice';

// Any createAsyncThunk action ends with /pending, /fulfilled, or /rejected.
// This middleware watches for that pattern so every API call in the app
// automatically toggles the global loading indicator, no matter which
// slice it belongs to.
const loadingMiddleware = (storeAPI) => (next) => (action) => {
  if (typeof action.type === 'string') {
    if (action.type.endsWith('/pending')) {
      storeAPI.dispatch(requestStarted());
    } else if (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')) {
      storeAPI.dispatch(requestFinished());
    }
  }
  return next(action);
};

export default loadingMiddleware;
