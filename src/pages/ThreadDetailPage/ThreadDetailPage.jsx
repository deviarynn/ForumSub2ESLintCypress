import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchThreadDetail, addComment, toggleThreadDetailVote, clearThreadDetail,
} from '../../states/threadDetail/threadDetailSlice';
import Avatar from '../../components/Avatar/Avatar';
import VoteButton from '../../components/VoteButton/VoteButton';
import CommentList from '../../components/CommentList/CommentList';
import { postedFormatter, getVoteStatus } from '../../utils';
import './ThreadDetailPage.css';

function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const { detail, status } = useSelector((state) => state.threadDetail);
  const userId = useSelector((state) => state.auth.user?.id);
  const isLoggedIn = Boolean(useSelector((state) => state.auth.user));
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchThreadDetail(threadId));
    return () => dispatch(clearThreadDetail());
  }, [dispatch, threadId]);

  async function handleSubmitComment(event) {
    event.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    await dispatch(addComment({ threadId, content: commentText.trim() }));
    setIsSubmitting(false);
    setCommentText('');
  }

  if (status === 'loading' || status === 'idle') return null;

  if (status === 'failed' || !detail) {
    return (
      <div className="thread-detail__error">
        <p>Thread tidak ditemukan.</p>
        <Link to="/">Kembali ke daftar thread</Link>
      </div>
    );
  }

  const voteStatus = getVoteStatus(userId, detail.upVotesBy, detail.downVotesBy);

  return (
    <article className="thread-detail">
      <div className="thread-detail__meta">
        <span className="thread-detail__category">
          #
          {detail.category}
        </span>
        <span>·</span>
        <span>{postedFormatter(detail.createdAt)}</span>
      </div>

      <h1 className="thread-detail__title">{detail.title}</h1>

      <div className="thread-detail__owner">
        <Avatar name={detail.owner.name} src={detail.owner.avatar} size={36} />
        <span>{detail.owner.name}</span>
      </div>

      <div className="thread-detail__body">{detail.body}</div>

      <div className="thread-detail__vote-row">
        <VoteButton
          upCount={detail.upVotesBy.length}
          downCount={detail.downVotesBy.length}
          voteStatus={voteStatus}
          disabled={!userId}
          onUpVote={() => dispatch(toggleThreadDetailVote({ threadId: detail.id, voteType: 'up' }))}
          onDownVote={() => dispatch(toggleThreadDetailVote({ threadId: detail.id, voteType: 'down' }))}
        />
      </div>

      <section className="thread-detail__comments">
        <h2>
          {detail.comments.length}
          {' '}
          Komentar
        </h2>

        {isLoggedIn ? (
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Tulis komentarmu..."
              rows={3}
              required
            />
            <button type="submit" className="btn btn--primary btn--sm" disabled={isSubmitting}>
              {isSubmitting ? 'Mengirim...' : 'Kirim komentar'}
            </button>
          </form>
        ) : (
          <p className="thread-detail__login-hint">
            <Link to="/login">Masuk</Link>
            {' '}
            untuk ikut berkomentar.
          </p>
        )}

        <CommentList comments={detail.comments} threadId={detail.id} />
      </section>
    </article>
  );
}

export default ThreadDetailPage;
