import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearAuthError } from '../../states/auth/authSlice';
import './AuthPage.css';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      navigate('/login');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Buat akun baru</h1>
        <p className="auth-card__subtitle">Gabung dan mulai diskusi dengan komunitas.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="name">
            Nama
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Nama lengkap"
            />
          </label>

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
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
            />
          </label>

          {error && <p className="auth-form__error">{error}</p>}

          <button type="submit" className="btn btn--primary btn--md btn--block" disabled={status === 'loading'}>
            {status === 'loading' ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="auth-card__footer">
          Sudah punya akun?
          {' '}
          <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
