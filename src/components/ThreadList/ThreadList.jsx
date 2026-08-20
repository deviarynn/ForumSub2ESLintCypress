import ThreadItem from '../ThreadItem/ThreadItem';
import './ThreadList.css';

function ThreadList({ threads }) {
  if (threads.length === 0) {
    return (
      <div className="thread-list__empty">
        <p>Belum ada thread di kategori ini.</p>
        <span>Jadilah yang pertama memulai diskusi.</span>
      </div>
    );
  }

  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} />
      ))}
    </div>
  );
}

export default ThreadList;
