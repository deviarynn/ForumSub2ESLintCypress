import CommentItem from '../CommentItem/CommentItem';
import './CommentList.css';

function CommentList({ comments, threadId }) {
  if (comments.length === 0) {
    return <p className="comment-list__empty">Belum ada komentar. Mulai diskusi!</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} threadId={threadId} />
      ))}
    </ul>
  );
}

export default CommentList;
