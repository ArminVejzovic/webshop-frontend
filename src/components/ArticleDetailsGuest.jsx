import React, { useEffect, useRef, useState } from 'react';

const ArticleDetailsGuest = ({ article, onClose }) => {
  const modalRef = useRef();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl cursor-pointer"
        >
          &times;
        </button>

        {article.image_url && !imageError ? (
          <img
            src={article.image_url}
            alt={article.name}
            className="w-full h-60 object-cover rounded mb-4"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-60 bg-gray-200 flex items-center justify-center text-gray-600 mb-4 rounded">
            No Image
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800">{article.name}</h2>
        <p className="text-gray-700 mt-2">{article.description}</p>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-semibold text-blue-600">${article.price}</span>
          <span className="text-sm text-gray-600">In stock: {article.quantity}</span>
        </div>

        <button
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ArticleDetailsGuest;
