import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ✅ Deklarasikan thunk DULU karena extraReducers butuh action type-nya
export const fetchThreads = createAsyncThunk('threads/fetchThreads', async () => {
  const threads = await api.getAllThreads();
  return threads;
});

export const addThread = createAsyncThunk(
  'threads/addThread',
  async ({ title, body, category }) => {
    const thread = await api.createThread({ title, body, category });
    return thread;
  },
);

function applyVote(thread, userId, voteType) {
  const upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
  const downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
  if (voteType === 'up') upVotesBy.push(userId);
  if (voteType === 'down') downVotesBy.push(userId);
  return { ...thread, upVotesBy, downVotesBy };
}

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    selectedCategory: 'all',
  },
  reducers: {
    setCategoryFilter: (state, action) => {
      state.selectedCategory = action.payload;
    },
    applyOptimisticVote: (state, action) => {
      const { threadId, userId, voteType } = action.payload;
      state.items = state.items.map((thread) => (
        thread.id === threadId ? applyVote(thread, userId, voteType) : thread
      ));
    },
    restoreVote: (state, action) => {
      const { threadId, previousVote } = action.payload;
      state.items = state.items.map((thread) => (
        thread.id === threadId ? { ...thread, ...previousVote } : thread
      ));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addThread.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      });
  },
});

// ✅ toggleThreadVote dideklarasi setelah slice karena butuh slice.actions
export const toggleThreadVote = createAsyncThunk(
  'threads/toggleThreadVote',
  async ({ threadId, voteType }, { getState, dispatch, rejectWithValue }) => {
    const { auth, threads } = getState();
    const userId = auth.user?.id;
    if (!userId) return rejectWithValue('unauthenticated');

    const thread = threads.items.find((item) => item.id === threadId);
    const previousVote = {
      upVotesBy: [...thread.upVotesBy],
      downVotesBy: [...thread.downVotesBy],
    };
    const isUp = thread.upVotesBy.includes(userId);
    const isDown = thread.downVotesBy.includes(userId);
    const goingToVote = (voteType === 'up' && isUp) || (voteType === 'down' && isDown)
      ? 'neutral'
      : voteType;

    dispatch(threadsSlice.actions.applyOptimisticVote({ threadId, userId, voteType: goingToVote }));

    try {
      if (goingToVote === 'up') await api.upVoteThread(threadId);
      else if (goingToVote === 'down') await api.downVoteThread(threadId);
      else await api.neutralizeThreadVote(threadId);
      return { threadId };
    } catch (error) {
      dispatch(threadsSlice.actions.restoreVote({ threadId, previousVote }));
      return rejectWithValue(error.message);
    }
  },
);

export const { setCategoryFilter } = threadsSlice.actions;
export default threadsSlice.reducer;
