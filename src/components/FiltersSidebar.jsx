import React, { useState } from 'react';

const FiltersSidebar = ({ articles, onFilter }) => {
  const [search, setSearch] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = articles.filter((a) =>
        a.name && a.name.toLowerCase().startsWith(value.toLowerCase())
    );
    onFilter(filtered);
	};
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filter Products</h2>
      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={handleSearchChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default FiltersSidebar;
