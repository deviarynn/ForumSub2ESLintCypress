/**
 * Test Suite: authSlice reducer
 *
 * Skenario:
 * 1. Initial state harus benar
 * 2. loginUser.pending → status loading, error null
 * 3. loginUser.fulfilled → user tersimpan, status succeeded
 * 4. loginUser.rejected → status failed, error tersimpan
 * 5. logoutUser → user menjadi null
 * 6. clearAuthError → error menjadi null
 * 7. loadAuthUser.pending → isPreloading true
 * 8. loadAuthUser.fulfilled → user tersimpan, isPreloading false
 * 9. loadAuthUser.rejected → user null, isPreloading false
 * 10. registerUser.pending → status loading
 */

import { describe, it, expect } from 'vitest';
import authReducer, {
  logoutUser,
  clearAuthError,
  loginUser,
  loadAuthUser,
  registerUser,
} from '../states/auth/authSlice';

const mockUser = {
  id: 'user-1', name: 'Devi', email: 'devi@test.com', avatar: '',
};

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  isPreloading: true,
};

describe('authSlice reducer', () => {
  it('1. harus mengembalikan initial state yang benar', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ wrong: 'state' });
  });

  it('2. loginUser.pending harus set status loading dan error null', () => {
    const state = authReducer(
      { ...initialState, error: 'old error' },
      { type: loginUser.pending.type },
    );
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('3. loginUser.fulfilled harus menyimpan user dan status succeeded', () => {
    const state = authReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: mockUser,
    });
    expect(state.status).toBe('succeeded');
    expect(state.user).toEqual(mockUser);
  });

  it('4. loginUser.rejected harus menyimpan error dan status failed', () => {
    const state = authReducer(initialState, {
      type: loginUser.rejected.type,
      error: { message: 'Invalid credentials' },
    });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Invalid credentials');
  });

  it('5. logoutUser harus mengosongkan user', () => {
    const loggedInState = { ...initialState, user: mockUser };
    const state = authReducer(loggedInState, logoutUser());
    expect(state.user).toBeNull();
  });

  it('6. clearAuthError harus mengosongkan error', () => {
    const errorState = { ...initialState, error: 'Some error' };
    const state = authReducer(errorState, clearAuthError());
    expect(state.error).toBeNull();
  });

  it('7. loadAuthUser.pending harus set isPreloading true', () => {
    const state = authReducer(
      { ...initialState, isPreloading: false },
      { type: loadAuthUser.pending.type },
    );
    expect(state.isPreloading).toBe(true);
  });

  it('8. loadAuthUser.fulfilled harus menyimpan user dan isPreloading false', () => {
    const state = authReducer(initialState, {
      type: loadAuthUser.fulfilled.type,
      payload: mockUser,
    });
    expect(state.user).toEqual(mockUser);
    expect(state.isPreloading).toBe(false);
  });

  it('9. loadAuthUser.rejected harus set user null dan isPreloading false', () => {
    const state = authReducer(
      { ...initialState, user: mockUser, isPreloading: true },
      { type: loadAuthUser.rejected.type },
    );
    expect(state.user).toBeNull();
    expect(state.isPreloading).toBe(false);
  });

  it('10. registerUser.pending harus set status loading', () => {
    const state = authReducer(initialState, { type: registerUser.pending.type });
    expect(state.status).toBe('loading');
  });
});
