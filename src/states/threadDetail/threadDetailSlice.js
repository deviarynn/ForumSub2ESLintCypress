import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ✅ Thunk tanpa slice.actions dideklarasi dulu
export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetchThreadDetail',
  async (threadId) => {
    const detailThread = await api.getThreadDetail(threadId);
    return detailThread;
  },
);

export const addComment = createAsyncThunk(
  'threadDetail/addComment',
  async ({ threadId, content }) => {
    const comment = await api.createComment({ threadId, content });
    return comment;
  },
);

function applyVote(target, userId, voteType) {
  const upVotesBy = target.upVotesBy.filter((id) => id !== userId);
  const downVotesBy = target.downVotesBy.filter((id) => id !== userId);
  if (voteType === 'up') upVotesBy.push(userId);
  if (voteType === 'down') downVotesBy.push(userId);
  return { ...target, upVotesBy, downVotesBy };
}

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    detail: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearThreadDetail: (state) => {
      state.detail = null;
      state.status = 'idle';
    },
    applyOptimisticCommentVote: (state, action) => {
      const { commentId, userId, voteType } = action.payload;
      state.detail.comments = state.detail.comments.map((comment) => (
        comment.id === commentId ? applyVote(comment, userId, voteType) : comment
      ));
    },
    restoreCommentVote: (state, action) => {
      const { commentId, previousVote } = action.payload;
      state.detail.comments = state.detail.comments.map((comment) => (
        comment.id === commentId ? { ...comment, ...previousVote } : comment
      ));
    },
    applyOptimisticThreadVote: (state, action) => {
      const { userId, voteType } = action.payload;
      state.detail = applyVote(state.detail, userId, voteType);
    },
    restoreThreadVote: (state, action) => {
      state.detail = { ...state.detail, ...action.payload.previousVote };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.status = 'loading';
        state.detail = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detail = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.detail.comments = [action.payload, ...state.detail.comments];
      });
  },
});

// ✅ Thunk yang butuh slice.actions dideklarasi SETELAH slice
export const toggleThreadDetailVote = createAsyncThunk(
  'threadDetail/toggleThreadDetailVote',
  async ({ threadId, voteType }, { getState, dispatch, rejectWithValue }) => {
    const { auth, threadDetail } = getState();
    const userId = auth.user?.id;
    if (!userId) return rejectWithValue('unauthenticated');

    const { detail } = threadDetail;
    const previousVote = {
      upVotesBy: [...detail.upVotesBy],
      downVotesBy: [...detail.downVotesBy],
    };
    const isUp = detail.upVotesBy.includes(userId);
    const isDown = detail.downVotesBy.includes(userId);
    const goingToVote = (voteType === 'up' && isUp) || (voteType === 'down' && isDown)
      ? 'neutral'
      : voteType;

    dispatch(
      threadDetailSlice.actions.applyOptimisticThreadVote({ userId, voteType: goingToVote }),
    );

    try {
      if (goingToVote === 'up') await api.upVoteThread(threadId);
      else if (goingToVote === 'down') await api.downVoteThread(threadId);
      else await api.neutralizeThreadVote(threadId);
      return { threadId };
    } catch (error) {
      dispatch(threadDetailSlice.actions.restoreThreadVote({ previousVote }));
      return rejectWithValue(error.message);
    }
  },
);

export const toggleCommentVote = createAsyncThunk(
  'threadDetail/toggleCommentVote',
  async ({ threadId, commentId, voteType }, { getState, dispatch, rejectWithValue }) => {
    const { auth, threadDetail } = getState();
    const userId = auth.user?.id;
    if (!userId) return rejectWithValue('unauthenticated');

    const comment = threadDetail.detail.comments.find((item) => item.id === commentId);
    const previousVote = {
      upVotesBy: [...comment.upVotesBy],
      downVotesBy: [...comment.downVotesBy],
    };
    const isUp = comment.upVotesBy.includes(userId);
    const isDown = comment.downVotesBy.includes(userId);
    const goingToVote = (voteType === 'up' && isUp) || (voteType === 'down' && isDown)
      ? 'neutral'
      : voteType;

    dispatch(
      threadDetailSlice.actions.applyOptimisticCommentVote({
        commentId,
        userId,
        voteType: goingToVote,
      }),
    );

    try {
      if (goingToVote === 'up') await api.upVoteComment(threadId, commentId);
      else if (goingToVote === 'down') await api.downVoteComment(threadId, commentId);
      else await api.neutralizeCommentVote(threadId, commentId);
      return { commentId };
    } catch (error) {
      dispatch(threadDetailSlice.actions.restoreCommentVote({ commentId, previousVote }));
      return rejectWithValue(error.message);
    }
  },
);

export const { clearThreadDetail } = threadDetailSlice.actions;
export default threadDetailSlice.reducer;
