import { Link } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <span className="not-found-page__code">404</span>
      <h1>Halaman tidak ditemukan</h1>
      <p>Thread atau halaman yang kamu cari sudah tidak ada, atau alamatnya salah.</p>
      <Link to="/" className="btn btn--primary btn--md">Kembali ke beranda</Link>
    </div>
  );
}

export default NotFoundPage;
