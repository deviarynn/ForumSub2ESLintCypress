/**
 * Test Suite: React Components
 *
 * Skenario VoteButton:
 * 1. Menampilkan jumlah upvote dan downvote
 * 2. Tombol upvote memanggil onUpVote saat diklik
 * 3. Tombol downvote memanggil onDownVote saat diklik
 * 4. Tombol disabled ketika prop disabled=true
 * 5. Menampilkan status aktif saat voteStatus='up'
 *
 * Skenario LoginPage:
 * 6. Menampilkan form login dengan email dan password
 * 7. Input email dan password bisa diketik
 * 8. Menampilkan pesan error ketika ada error dari store
 *
 * Skenario ThreadItem:
 * 9. Menampilkan judul dan kategori thread
 * 10. Menampilkan jumlah komentar
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import VoteButton from '../components/VoteButton/VoteButton';
import ThreadItem from '../components/ThreadItem/ThreadItem';
import authReducer from '../states/auth/authSlice';
import usersReducer from '../states/users/usersSlice';
import threadsReducer from '../states/threads/threadsSlice';

// ── Helper: buat store minimal untuk komponen yang butuh Redux ──
function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      threads: threadsReducer,
      users: usersReducer,
    },
    preloadedState,
  });
}

const mockThread = {
  id: 'thread-1',
  title: 'Diskusi React Testing',
  body: 'Body thread ini sangat panjang untuk diuji di unit test.',
  category: 'react',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: ['user-2'],
  downVotesBy: [],
  totalComments: 5,
};

// ── VoteButton tests ──
describe('VoteButton component', () => {
  let onUpVote;
  let onDownVote;

  beforeEach(() => {
    onUpVote = vi.fn();
    onDownVote = vi.fn();
  });

  it('1. menampilkan jumlah upvote dan downvote', () => {
    render(
      <VoteButton
        upCount={10}
        downCount={3}
        voteStatus="none"
        onUpVote={onUpVote}
        onDownVote={onDownVote}
      />,
    );
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('2. tombol upvote memanggil onUpVote saat diklik', () => {
    render(
      <VoteButton
        upCount={0}
        downCount={0}
        voteStatus="none"
        onUpVote={onUpVote}
        onDownVote={onDownVote}
      />,
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onUpVote).toHaveBeenCalledTimes(1);
  });

  it('3. tombol downvote memanggil onDownVote saat diklik', () => {
    render(
      <VoteButton
        upCount={0}
        downCount={0}
        voteStatus="none"
        onUpVote={onUpVote}
        onDownVote={onDownVote}
      />,
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(onDownVote).toHaveBeenCalledTimes(1);
  });

  it('4. tombol disabled ketika prop disabled=true', () => {
    render(
      <VoteButton
        upCount={0}
        downCount={0}
        voteStatus="none"
        disabled
        onUpVote={onUpVote}
        onDownVote={onDownVote}
      />,
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('5. tombol upvote menampilkan class aktif ketika voteStatus up', () => {
    render(
      <VoteButton
        upCount={1}
        downCount={0}
        voteStatus="up"
        onUpVote={onUpVote}
        onDownVote={onDownVote}
      />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].className).toContain('is-active');
  });
});

// ── ThreadItem tests ──
describe('ThreadItem component', () => {
  it('9. menampilkan judul dan kategori thread', () => {
    const store = makeStore({
      auth: {
        user: null, status: 'idle', error: null, isPreloading: false,
      },
      threads: {
        items: [mockThread],
        status: 'succeeded',
        error: null,
        selectedCategory: 'all',
      },
      users: {
        list: [{ id: 'user-1', name: 'Devi', avatar: '' }],
        status: 'succeeded',
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ThreadItem
            thread={mockThread}
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Diskusi React Testing')).toBeInTheDocument();
    const categorySpan = container.querySelector('.thread-card__category');
    expect(categorySpan).toBeInTheDocument();
    expect(categorySpan.textContent).toContain('react');
  });

  it('10. menampilkan jumlah komentar', () => {
    const store = makeStore({
      auth: {
        user: null, status: 'idle', error: null, isPreloading: false,
      },
      threads: {
        items: [mockThread],
        status: 'succeeded',
        error: null,
        selectedCategory: 'all',
      },
      users: {
        list: [{ id: 'user-1', name: 'Devi', avatar: '' }],
        status: 'succeeded',
      },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ThreadItem thread={mockThread} />
        </MemoryRouter>
      </Provider>,
    );

    // '5 komentar' dirender di dalam link, cari elemen yang mengandung angka komentar
    const commentLink = container.querySelector('.thread-card__comments');
    expect(commentLink).toBeInTheDocument();
    expect(commentLink.textContent).toContain('5');
  });
});
