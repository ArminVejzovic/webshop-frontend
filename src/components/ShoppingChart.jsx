import React, { useEffect, useState } from 'react';
import { ShoppingCartIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState(getCart());
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const updateLocalStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleRemove = (id) => {
    updateLocalStorage(cart.filter(item => item.id !== id));
  };

  const handleQuantity = (id, delta) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    updateLocalStorage(updated);
  };

  const handleClear = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async () => {
    const items = cart.flatMap(item => Array(item.quantity).fill(item.id)).join(", ");

    const order = {
      items,
      customer_firstname: form.firstName,
      customer_lastname: form.lastName,
      customer_email: form.email,
      customer_phone: form.phone,
      customer_address: form.address,
      status: "Processing",
      created_at: new Date().toLocaleString(),
    };

    try {
      const res = await fetch(import.meta.env.VITE_API_URL_ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error("Error sending order.");

      alert("Order successfully sent. Thank you!");
      handleClear();
      setIsOpen(false);
    } catch (err) {
      console.error("Greška:", err);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const sync = () => setCart(getCart());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <button className="relative group" onClick={() => setIsOpen(true)}>
        <ShoppingCartIcon className="h-6 w-6 text-gray-800 cursor-pointer" />
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {totalQuantity}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-lg z-50 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Shopping Chart</h2>
            <button onClick={() => setIsOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-800 cursor-pointer" />
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-600">Shopping chart is empty</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="border-b py-2 flex justify-between items-center">
                    <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                        ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    </div>
                    <div className="flex items-center gap-2">
                    <button onClick={() => handleQuantity(item.id, -1)} className="px-2">−</button>
                    <button onClick={() => handleQuantity(item.id, 1)} className="px-2">+</button>
                    <TrashIcon
                        className="h-5 w-5 text-red-500 cursor-pointer"
                        onClick={() => handleRemove(item.id)}
                    />
                    </div>
                </div>
                ))}

                <div className="mt-4 mb-6 text-right">
                <p className="text-lg font-semibold">
                    Total: <span className="text-green-700">${totalPrice.toFixed(2)}</span>
                </p>
            </div>

              <div className="mt-4">
                <h3 className="font-bold mb-2">Customer Information:</h3>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="border p-2 w-full mb-2"
                />
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="border p-2 w-full mb-2"
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border p-2 w-full mb-2"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="border p-2 w-full mb-2"
                />
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="border p-2 w-full mb-4"
                />

                <button
                  onClick={handleOrderSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                >
                  Submit order
                </button>
                <button
                  onClick={handleClear}
                  className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded"
                >
                  Clear chart
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ShoppingCart;
