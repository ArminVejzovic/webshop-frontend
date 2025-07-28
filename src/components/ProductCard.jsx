import React, { useState } from 'react';

const ProductCard = ({ article, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer" onClick={onClick} > 
      {imageError || !article.image_url ? (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
          No Image
        </div>
      ) : (
        <img
          src={article.image_url}
          alt={article.name}
          className="w-full h-48 object-cover"
          onError={() => setImageError(true)}
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{article.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.description}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-blue-600 font-bold">${article.price}</span>
          <button className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
