import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import LoadingBar from './components/Loading/LoadingBar';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ThreadDetailPage from './pages/ThreadDetailPage/ThreadDetailPage';
import NewThreadPage from './pages/NewThreadPage/NewThreadPage';
import LeaderboardPage from './pages/LeaderboardPage/LeaderboardPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { loadAuthUser } from './states/auth/authSlice';
import './App.css';

function RequireAuth({ children }) {
  const user = useSelector((state) => state.auth.user);
  const isPreloading = useSelector((state) => state.auth.isPreloading);
  if (isPreloading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const dispatch = useDispatch();
  const isPreloading = useSelector((state) => state.auth.isPreloading);

  useEffect(() => {
    dispatch(loadAuthUser());
  }, [dispatch]);

  if (isPreloading) {
    return <LoadingBar />;
  }

  return (
    <div className="app-shell">
      <LoadingBar />
      <Header />
      <main className="container app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
          <Route
            path="/new"
            element={(
              <RequireAuth>
                <NewThreadPage />
              </RequireAuth>
            )}
          />
          <Route path="/leaderboards" element={<LeaderboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
