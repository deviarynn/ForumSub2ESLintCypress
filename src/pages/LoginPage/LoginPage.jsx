import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearAuthError } from '../../states/auth/authSlice';
import './AuthPage.css';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Masuk ke Ruang Bahas</h1>
        <p className="auth-card__subtitle">Lanjutkan diskusi yang sudah kamu ikuti.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="nama@email.com"
            />
          </label>

          <label htmlFor="password">
            Kata sandi
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="auth-form__error">{error}</p>}

          <button type="submit" className="btn btn--primary btn--md btn--block" disabled={status === 'loading'}>
            {status === 'loading' ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="auth-card__footer">
          Belum punya akun?
          {' '}
          <Link to="/register">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
