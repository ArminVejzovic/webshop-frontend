import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import FiltersSidebar from '../components/FiltersSidebar';
import ShoppingCart from '../components/ShoppingChart';
import ArticleDetailsGuest from '../components/ArticleDetailsGuest';

const WebshopGuestDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("default");
	const [selectedArticle, setSelectedArticle] = useState(null);
	const [showDetailsModal, setShowDetailsModal] = useState(false);

	const handleOpenDetails = (article) => {
		setSelectedArticle(article);
		setShowDetailsModal(true);
	};

	const handleCloseDetails = () => {
		setSelectedArticle(null);
		setShowDetailsModal(false);
	};


  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL_ARTICLES}`);
      const availableArticles = response.data.filter(article => article.quantity > 0);
      setArticles(availableArticles);
      setFilteredArticles(availableArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleFilter = (filtered) => {
    setFilteredArticles(filtered);
  };

  const getSortedArticles = (articles) => {
    let sorted = [...articles];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-gray-800">Webshop</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <ShoppingCart />
        </div>
      </header>

      <div className="flex flex-col md:flex-row px-4 lg:px-12 py-6 gap-6">
        {showFilters && (
          <div className="md:w-1/4 w-full">
            <FiltersSidebar articles={articles} onFilter={handleFilter} />
          </div>
        )}

        <div className={`${showFilters ? 'md:w-3/4' : 'w-full'} flex flex-col gap-4`}>
          <div className="flex justify-end mb-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Sort by Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {getSortedArticles(filteredArticles).map(article => (
              <ProductCard key={article.id} article={article} onClick={() => handleOpenDetails(article)} />
            ))}
          </div>
        </div>
      </div>

			{showDetailsModal && (
				<ArticleDetailsGuest article={selectedArticle} onClose={handleCloseDetails} />
			)}			

    </div>
  );
};

export default WebshopGuestDashboard;
