export function postedFormatter(date) {
  const now = new Date();
  const posted = new Date(date);
  const diffMs = now - posted;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays < 7) return `${diffDays} hari yang lalu`;

  return posted.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function truncateText(text, maxLength) {
  const safeText = text || '';
  const safeMax = maxLength || 160;
  const plain = safeText.replace(/<[^>]+>/g, '');
  if (plain.length <= safeMax) return plain;
  return `${plain.slice(0, safeMax).trim()}…`;
}

export function getInitials(name) {
  const safeName = name || '';
  return safeName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

// derives a vote status ('up' | 'down' | 'none') for the logged-in user
// ✅ Fix: userId tidak punya default value → taruh duluan sebelum param yang punya default
export function getVoteStatus(userId, upVotesBy, downVotesBy) {
  const safeUp = upVotesBy || [];
  const safeDown = downVotesBy || [];
  if (!userId) return 'none';
  if (safeUp.includes(userId)) return 'up';
  if (safeDown.includes(userId)) return 'down';
  return 'none';
}
