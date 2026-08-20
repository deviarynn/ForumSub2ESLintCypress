/**
 * Test Suite: Thunk Functions
 *
 * Skenario fetchThreads thunk:
 * 1. fetchThreads sukses → dispatch fulfilled dengan data threads
 * 2. fetchThreads gagal → dispatch rejected ketika API error
 *
 * Skenario loginUser thunk:
 * 3. loginUser sukses → dispatch fulfilled dengan data user
 * 4. loginUser gagal → dispatch rejected ketika API error
 *
 * Skenario addThread thunk:
 * 5. addThread sukses → dispatch fulfilled dengan thread baru
 *
 * Skenario fetchThreadDetail thunk:
 * 6. fetchThreadDetail sukses → dispatch fulfilled dengan detail thread
 * 7. fetchThreadDetail gagal → dispatch rejected
 *
 * Skenario addComment thunk:
 * 8. addComment sukses → dispatch fulfilled dengan komentar baru
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer, { fetchThreads, addThread } from '../states/threads/threadsSlice';
import authReducer, { loginUser } from '../states/auth/authSlice';
import threadDetailReducer, { fetchThreadDetail, addComment } from '../states/threadDetail/threadDetailSlice';
import api from '../utils/api';

vi.mock('../utils/api');

function makeStore() {
  return configureStore({
    reducer: {
      threads: threadsReducer,
      auth: authReducer,
      threadDetail: threadDetailReducer,
    },
  });
}

const mockThreads = [
  {
    id: 'thread-1',
    title: 'Thread Test',
    body: 'Body',
    category: 'general',
    createdAt: '2024-01-01',
    ownerId: 'user-1',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
  },
];

const mockDetail = {
  id: 'thread-1',
  title: 'Thread Test',
  body: 'Body lengkap',
  category: 'general',
  createdAt: '2024-01-01',
  owner: { id: 'user-1', name: 'Devi', avatar: '' },
  upVotesBy: [],
  downVotesBy: [],
  comments: [],
};

describe('Thunk Functions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('1. fetchThreads sukses → state items terisi', async () => {
    api.getAllThreads.mockResolvedValue(mockThreads);
    const store = makeStore();

    await store.dispatch(fetchThreads());

    const { threads } = store.getState();
    expect(threads.status).toBe('succeeded');
    expect(threads.items).toHaveLength(1);
    expect(threads.items[0].id).toBe('thread-1');
  });

  it('2. fetchThreads gagal → status failed dan error tersimpan', async () => {
    api.getAllThreads.mockRejectedValue(new Error('Server Error'));
    const store = makeStore();

    await store.dispatch(fetchThreads());

    const { threads } = store.getState();
    expect(threads.status).toBe('failed');
    expect(threads.error).toBe('Server Error');
  });

  it('3. loginUser sukses → user tersimpan di state', async () => {
    const mockUser = {
      id: 'user-1', name: 'Devi', email: 'devi@test.com', avatar: '',
    };
    api.login.mockResolvedValue('token-abc');
    api.putAccessToken.mockReturnValue(undefined);
    api.getOwnProfile.mockResolvedValue(mockUser);

    const store = makeStore();
    await store.dispatch(loginUser({ email: 'devi@test.com', password: 'pass123' }));

    const { auth } = store.getState();
    expect(auth.status).toBe('succeeded');
    expect(auth.user).toEqual(mockUser);
  });

  it('4. loginUser gagal → status failed dan error tersimpan', async () => {
    api.login.mockRejectedValue(new Error('Invalid credentials'));

    const store = makeStore();
    await store.dispatch(loginUser({ email: 'wrong@test.com', password: 'wrong' }));

    const { auth } = store.getState();
    expect(auth.status).toBe('failed');
    expect(auth.error).toBe('Invalid credentials');
  });

  it('5. addThread sukses → thread baru ada di awal items', async () => {
    const newThread = { ...mockThreads[0], id: 'thread-new', title: 'New Thread' };
    api.createThread.mockResolvedValue(newThread);

    const store = makeStore();
    await store.dispatch(addThread({ title: 'New Thread', body: 'Body', category: 'general' }));

    const { threads } = store.getState();
    expect(threads.items[0].id).toBe('thread-new');
  });

  it('6. fetchThreadDetail sukses → detail tersimpan di state', async () => {
    api.getThreadDetail.mockResolvedValue(mockDetail);

    const store = makeStore();
    await store.dispatch(fetchThreadDetail('thread-1'));

    const { threadDetail } = store.getState();
    expect(threadDetail.status).toBe('succeeded');
    expect(threadDetail.detail.id).toBe('thread-1');
  });

  it('7. fetchThreadDetail gagal → status failed', async () => {
    api.getThreadDetail.mockRejectedValue(new Error('Not found'));

    const store = makeStore();
    await store.dispatch(fetchThreadDetail('thread-xxx'));

    const { threadDetail } = store.getState();
    expect(threadDetail.status).toBe('failed');
    expect(threadDetail.error).toBe('Not found');
  });

  it('8. addComment sukses → komentar baru ada di awal comments', async () => {
    const mockComment = {
      id: 'comment-1',
      content: 'Komentar baru',
      createdAt: '2024-01-01',
      owner: { id: 'user-1', name: 'Devi', avatar: '' },
      upVotesBy: [],
      downVotesBy: [],
    };
    api.createComment.mockResolvedValue(mockComment);

    const store = configureStore({
      reducer: { threadDetail: threadDetailReducer },
      preloadedState: { threadDetail: { detail: mockDetail, status: 'succeeded', error: null } },
    });

    await store.dispatch(addComment({ threadId: 'thread-1', content: 'Komentar baru' }));

    const { threadDetail } = store.getState();
    expect(threadDetail.detail.comments[0].id).toBe('comment-1');
  });
});
