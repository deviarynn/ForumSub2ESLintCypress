import { useSelector } from 'react-redux';
import { selectIsLoading } from '../../states/loading/loadingSlice';
import './LoadingBar.css';

function LoadingBar() {
  const isLoading = useSelector(selectIsLoading);

  if (!isLoading) return null;

  return (
    <div className="loading-bar" role="status" aria-label="Memuat data">
      <div className="loading-bar__track" />
    </div>
  );
}

export default LoadingBar;
