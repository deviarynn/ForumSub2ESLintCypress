import './CategoryFilter.css';

function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="category-filter" role="tablist" aria-label="Filter kategori thread">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={selected === category}
          className={`category-chip ${selected === category ? 'is-active' : ''}`}
          onClick={() => onSelect(category)}
        >
          {category === 'all' ? 'Semua' : `#${category}`}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
