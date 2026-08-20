/**
 * Test Suite: threadsSlice reducer
 *
 * Skenario:
 * 1. setCategoryFilter → mengubah selectedCategory di state
 * 2. fetchThreads.pending → status menjadi 'loading'
 * 3. fetchThreads.fulfilled → items terisi dan status 'succeeded'
 * 4. fetchThreads.rejected → status 'failed' dan error tersimpan
 * 5. addThread.fulfilled → thread baru ditambah di awal items
 * 6. applyOptimisticVote (up) → upVotesBy bertambah userId
 * 7. applyOptimisticVote (down) → downVotesBy bertambah, upVotesBy dihapus
 * 8. applyOptimisticVote (neutral) → keduanya tidak mengandung userId
 * 9. restoreVote → vote dikembalikan ke state sebelumnya
 */

import { describe, it, expect } from 'vitest';
import threadsReducer, {
  setCategoryFilter,
  fetchThreads,
  addThread,
} from '../states/threads/threadsSlice';

const makeThread = (overrides = {}) => ({
  id: 'thread-1',
  title: 'Test Thread',
  body: 'Body test',
  category: 'general',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
  ...overrides,
});

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  selectedCategory: 'all',
};

describe('threadsSlice reducer', () => {
  it('1. harus mengembalikan initial state', () => {
    const state = threadsReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('2. setCategoryFilter harus mengubah selectedCategory', () => {
    const state = threadsReducer(initialState, setCategoryFilter('react'));
    expect(state.selectedCategory).toBe('react');
  });

  it('3. fetchThreads.pending harus mengubah status menjadi loading', () => {
    const state = threadsReducer(initialState, { type: fetchThreads.pending.type });
    expect(state.status).toBe('loading');
  });

  it('4. fetchThreads.fulfilled harus mengisi items dan status succeeded', () => {
    const threads = [makeThread({ id: 'thread-1' }), makeThread({ id: 'thread-2' })];
    const state = threadsReducer(initialState, {
      type: fetchThreads.fulfilled.type,
      payload: threads,
    });
    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe('thread-1');
  });

  it('5. fetchThreads.rejected harus menyimpan error dan status failed', () => {
    const state = threadsReducer(initialState, {
      type: fetchThreads.rejected.type,
      error: { message: 'Network Error' },
    });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Network Error');
  });

  it('6. addThread.fulfilled harus menambah thread baru di awal items', () => {
    const existing = makeThread({ id: 'thread-old' });
    const stateWithItems = { ...initialState, items: [existing] };
    const newThread = makeThread({ id: 'thread-new', title: 'New Thread' });

    const state = threadsReducer(stateWithItems, {
      type: addThread.fulfilled.type,
      payload: newThread,
    });

    expect(state.items[0].id).toBe('thread-new');
    expect(state.items).toHaveLength(2);
  });

  it('7. applyOptimisticVote up harus menambahkan userId ke upVotesBy', () => {
    const stateWithItems = {
      ...initialState,
      items: [makeThread({ id: 'thread-1', upVotesBy: [], downVotesBy: [] })],
    };
    const state = threadsReducer(stateWithItems, {
      type: 'threads/applyOptimisticVote',
      payload: { threadId: 'thread-1', userId: 'user-1', voteType: 'up' },
    });
    expect(state.items[0].upVotesBy).toContain('user-1');
    expect(state.items[0].downVotesBy).not.toContain('user-1');
  });

  it('8. applyOptimisticVote down harus memindah userId ke downVotesBy', () => {
    const stateWithItems = {
      ...initialState,
      items: [makeThread({ id: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] })],
    };
    const state = threadsReducer(stateWithItems, {
      type: 'threads/applyOptimisticVote',
      payload: { threadId: 'thread-1', userId: 'user-1', voteType: 'down' },
    });
    expect(state.items[0].downVotesBy).toContain('user-1');
    expect(state.items[0].upVotesBy).not.toContain('user-1');
  });

  it('9. applyOptimisticVote neutral harus menghapus userId dari keduanya', () => {
    const stateWithItems = {
      ...initialState,
      items: [makeThread({ id: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] })],
    };
    const state = threadsReducer(stateWithItems, {
      type: 'threads/applyOptimisticVote',
      payload: { threadId: 'thread-1', userId: 'user-1', voteType: 'neutral' },
    });
    expect(state.items[0].upVotesBy).not.toContain('user-1');
    expect(state.items[0].downVotesBy).not.toContain('user-1');
  });

  it('10. restoreVote harus mengembalikan vote ke state sebelumnya', () => {
    const stateWithItems = {
      ...initialState,
      items: [makeThread({ id: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] })],
    };
    const previousVote = { upVotesBy: [], downVotesBy: [] };
    const state = threadsReducer(stateWithItems, {
      type: 'threads/restoreVote',
      payload: { threadId: 'thread-1', previousVote },
    });
    expect(state.items[0].upVotesBy).toHaveLength(0);
  });
});
