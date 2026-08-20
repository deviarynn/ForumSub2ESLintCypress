import './VoteButton.css';

function VoteButton({
  upCount, downCount, voteStatus, onUpVote, onDownVote, disabled,
}) {
  return (
    <div className="vote-group">
      <button
        type="button"
        className={`vote-btn vote-btn--up ${voteStatus === 'up' ? 'is-active' : ''}`}
        onClick={onUpVote}
        disabled={disabled}
        aria-pressed={voteStatus === 'up'}
        title={disabled ? 'Masuk untuk memberi vote' : 'Upvote'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4l8 10h-5v6H9v-6H4z" fill="currentColor" />
        </svg>
        <span>{upCount}</span>
      </button>
      <button
        type="button"
        className={`vote-btn vote-btn--down ${voteStatus === 'down' ? 'is-active' : ''}`}
        onClick={onDownVote}
        disabled={disabled}
        aria-pressed={voteStatus === 'down'}
        title={disabled ? 'Masuk untuk memberi vote' : 'Downvote'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 20l-8-10h5V4h6v6h5z" fill="currentColor" />
        </svg>
        <span>{downCount}</span>
      </button>
    </div>
  );
}

export default VoteButton;
