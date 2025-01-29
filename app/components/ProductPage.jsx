'use client';
import { useState } from "react";

export default function ProductsPage() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const handleAddProduct = () => {
    alert(`Product Added: ${productName}, ${productDescription}, $${productPrice}`);
    setProductName("");
    setProductDescription("");
    setProductPrice("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Add / Sell Product</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input 
          type="text" 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          value={productDescription} 
          onChange={(e) => setProductDescription(e.target.value)} 
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Price ($)</label>
        <input 
          type="number" 
          value={productPrice} 
          onChange={(e) => setProductPrice(e.target.value)} 
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
      </div>

      <button 
        onClick={handleAddProduct} 
        className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600 transition"
      >
        Add Product
      </button>
    </div>
  );
}
