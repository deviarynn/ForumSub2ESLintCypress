import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../Avatar/Avatar';
import VoteButton from '../VoteButton/VoteButton';
import { toggleCommentVote } from '../../states/threadDetail/threadDetailSlice';
import { postedFormatter, getVoteStatus } from '../../utils';
import './CommentItem.css';

function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  const voteStatus = getVoteStatus(userId, comment.upVotesBy, comment.downVotesBy);

  function handleVote(voteType) {
    dispatch(toggleCommentVote({ threadId, commentId: comment.id, voteType }));
  }

  return (
    <li className="comment-item">
      <Avatar name={comment.owner.name} src={comment.owner.avatar} size={32} />
      <div className="comment-item__body">
        <div className="comment-item__meta">
          <span className="comment-item__name">{comment.owner.name}</span>
          <span className="comment-item__dot">·</span>
          <span>{postedFormatter(comment.createdAt)}</span>
        </div>
        <p className="comment-item__content">{comment.content}</p>
        <VoteButton
          upCount={comment.upVotesBy.length}
          downCount={comment.downVotesBy.length}
          voteStatus={voteStatus}
          disabled={!userId}
          onUpVote={() => handleVote('up')}
          onDownVote={() => handleVote('down')}
        />
      </div>
    </li>
  );
}

export default CommentItem;
