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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

     if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.address
    ) {
      setErrorMessage("Please fill in all the fields.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

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
      processed_at: null
    };

    try {
      const res = await fetch(import.meta.env.VITE_API_URL_ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error("Error sending order.");

      setSuccessMessage("Order successfully sent. Thank you!");
      

      setTimeout(() => {
        setSuccessMessage("");
        setIsOpen(false);
        handleClear();
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong while sending the order.");
      setTimeout(() => setErrorMessage(""), 3000);
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
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.id} className="py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Price per piece: ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 justify-end mt-1">
                          <button onClick={() => handleQuantity(item.id, -1)} className="px-2 cursor-pointer">−</button>
                          <button onClick={() => handleQuantity(item.id, 1)} className="px-2 cursor-pointer">+</button>
                          <TrashIcon
                            className="h-5 w-5 text-red-500 cursor-pointer"
                            onClick={() => handleRemove(item.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 mb-6 text-right text-lg font-bold text-green-700">
                Total: ${totalPrice.toFixed(2)}
              </div>

              <div className="mt-4">
                <h3 className="font-bold mb-2">Customer Information:</h3>

                <label className="block text-sm font-medium mb-1">
                  First Name <span className="text-red-600">*</span>
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="border p-2 w-full mb-2"
                />

                <label className="block text-sm font-medium mb-1">
                  Last Name <span className="text-red-600">*</span>
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="border p-2 w-full mb-2"
                />

                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="border p-2 w-full mb-2"
                />

                <label className="block text-sm font-medium mb-1">
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  required
                  className="border p-2 w-full mb-2"
                />

                <label className="block text-sm font-medium mb-1">
                  Address <span className="text-red-600">*</span>
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  required
                  className="border p-2 w-full mb-4"
                />

                {errorMessage && (
                  <div className="text-red-600 font-semibold mb-3">{errorMessage}</div>
                )}

                {successMessage && (
                  <div className="text-green-600 font-semibold mb-3">{successMessage}</div>
                )}
        
                <button
                  onClick={handleOrderSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded cursor-pointer"
                >
                  Submit order
                </button>
                <button
                  onClick={handleClear}
                  className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded cursor-pointer"
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
