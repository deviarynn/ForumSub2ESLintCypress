import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../Avatar/Avatar';
import VoteButton from '../VoteButton/VoteButton';
import { toggleThreadVote } from '../../states/threads/threadsSlice';
import { selectThreadOwner } from '../../states/threads/selectors';
import { postedFormatter, truncateText, getVoteStatus } from '../../utils';
import './ThreadItem.css';

function ThreadItem({ thread }) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  const owner = useSelector((state) => selectThreadOwner(state, thread.ownerId));
  const voteStatus = getVoteStatus(userId, thread.upVotesBy, thread.downVotesBy);

  function handleVote(voteType) {
    dispatch(toggleThreadVote({ threadId: thread.id, voteType }));
  }

  return (
    <article className="thread-card">
      <div className="thread-card__rail" aria-hidden="true">
        <span className="thread-card__node" />
      </div>
      <div className="thread-card__body">
        <div className="thread-card__meta">
          <span className="thread-card__category">
            #
            {thread.category}
          </span>
          <span className="thread-card__dot">·</span>
          <span>{postedFormatter(thread.createdAt)}</span>
        </div>

        <Link to={`/threads/${thread.id}`} className="thread-card__title">
          {thread.title}
        </Link>

        <p className="thread-card__excerpt">{truncateText(thread.body)}</p>

        <div className="thread-card__footer">
          <div className="thread-card__owner">
            <Avatar name={owner.name} src={owner.avatar} size={24} />
            <span>{owner.name}</span>
          </div>

          <div className="thread-card__stats">
            <VoteButton
              upCount={thread.upVotesBy.length}
              downCount={thread.downVotesBy.length}
              voteStatus={voteStatus}
              disabled={!userId}
              onUpVote={() => handleVote('up')}
              onDownVote={() => handleVote('down')}
            />
            <Link to={`/threads/${thread.id}`} className="thread-card__comments">
              {thread.totalComments}
              {' '}
              komentar
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ThreadItem;
