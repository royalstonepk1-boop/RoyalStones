export default function CategoryFilter({ categories, onSelect }) {
    return (
      <select
        className="border p-2"
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    );
  }
  