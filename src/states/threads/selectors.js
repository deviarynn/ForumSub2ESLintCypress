export function selectAllCategories(state) {
  const categories = state.threads.items.map((thread) => thread.category).filter(Boolean);
  return ['all', ...new Set(categories)];
}

export function selectVisibleThreads(state) {
  const { items, selectedCategory } = state.threads;
  if (selectedCategory === 'all') return items;
  return items.filter((thread) => thread.category === selectedCategory);
}

// The /threads list endpoint only returns an ownerId, not the full owner
// profile, so we join it here with the /users list already in the store.
export function selectThreadOwner(state, ownerId) {
  return state.users.list.find((user) => user.id === ownerId) || { name: 'Pengguna', avatar: null };
}
