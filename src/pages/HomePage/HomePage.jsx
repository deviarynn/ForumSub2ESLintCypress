import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreads, setCategoryFilter } from '../../states/threads/threadsSlice';
import { fetchUsers } from '../../states/users/usersSlice';
import { selectAllCategories, selectVisibleThreads } from '../../states/threads/selectors';
import ThreadList from '../../components/ThreadList/ThreadList';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import './HomePage.css';

function HomePage() {
  const dispatch = useDispatch();
  const { status, selectedCategory } = useSelector((state) => state.threads);
  const categories = useSelector(selectAllCategories);
  const threads = useSelector(selectVisibleThreads);

  useEffect(() => {
    dispatch(fetchThreads());
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="home-page">
      <div className="home-page__intro">
        <h1>Diskusi terbaru</h1>
        <p>Telusuri topik yang sedang dibicarakan, atau mulai threadmu sendiri.</p>
      </div>

      {categories.length > 1 && (
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={(category) => dispatch(setCategoryFilter(category))}
        />
      )}

      {status === 'succeeded' && <ThreadList threads={threads} />}
      {status === 'failed' && <p className="home-page__error">Gagal memuat thread. Coba muat ulang halaman.</p>}
    </div>
  );
}

export default HomePage;
