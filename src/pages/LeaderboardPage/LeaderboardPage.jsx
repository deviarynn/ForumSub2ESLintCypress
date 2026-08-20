import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboards } from '../../states/leaderboards/leaderboardsSlice';
import Avatar from '../../components/Avatar/Avatar';
import './LeaderboardPage.css';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.leaderboards);

  useEffect(() => {
    dispatch(fetchLeaderboards());
  }, [dispatch]);

  return (
    <div className="leaderboard-page">
      <h1>Peringkat</h1>
      <p className="leaderboard-page__subtitle">Kontributor paling aktif di Ruang Bahas.</p>

      {status === 'succeeded' && (
        <ol className="leaderboard-list">
          {list.map((entry, index) => (
            <li key={entry.user.id} className="leaderboard-row">
              <span className="leaderboard-row__rank">{index + 1}</span>
              <Avatar name={entry.user.name} src={entry.user.avatar} size={40} />
              <div className="leaderboard-row__info">
                <span className="leaderboard-row__name">{entry.user.name}</span>
                <span className="leaderboard-row__email">{entry.user.email}</span>
              </div>
              <span className="leaderboard-row__score">{entry.score}</span>
            </li>
          ))}
        </ol>
      )}

      {status === 'failed' && <p className="leaderboard-page__error">Gagal memuat peringkat.</p>}
    </div>
  );
}

export default LeaderboardPage;
