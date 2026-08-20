import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../states/auth/authSlice';
import Avatar from '../Avatar/Avatar';
import './Header.css';

function Header() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logoutUser());
    navigate('/');
  }

  return (
    <header className="site-header">
      <div className="container site-header__row">
        <Link to="/" className="site-header__brand">
          <span className="site-header__mark" aria-hidden="true" />
          Ruang Bahas
        </Link>

        <nav className="site-header__nav">
          <Link to="/leaderboards">Peringkat</Link>
          {user ? (
            <>
              <Link to="/new" className="btn btn--primary btn--sm">Buat thread</Link>
              <div className="site-header__user">
                <Avatar name={user.name} src={user.avatar} size={32} />
                <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm">Masuk</Link>
              <Link to="/register" className="btn btn--primary btn--sm">Daftar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
