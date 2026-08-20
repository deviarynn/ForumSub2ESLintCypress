import { getInitials } from '../../utils';
import './Avatar.css';

function Avatar({ name, src, size = 40 }) {
  const style = { width: size, height: size, fontSize: size * 0.4 };

  if (src) {
    return (
      <img
        className="avatar"
        style={style}
        src={src}
        alt={name}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  }

  return (
    <span className="avatar avatar--fallback" style={style}>
      {getInitials(name)}
    </span>
  );
}

export default Avatar;
