import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const ShoppingCart = () => {
  return (
    <button className="relative group">
      <ShoppingCartIcon className="h-6 w-6 text-gray-800" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
        0
      </span>
    </button>
  );
};

export default ShoppingCart;
