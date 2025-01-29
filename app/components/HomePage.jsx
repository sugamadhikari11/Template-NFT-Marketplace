'use client';

export default function HomePage() {
  return (
    <div className="space-y-8 mb-10">
      {/* New Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">New Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-gray-700 text-white p-4 rounded-lg shadow-xl transform transition hover:scale-105">
              <h3 className="text-lg font-bold">New Product {index + 1}</h3>
              <p className="text-sm">Description of new product {index + 1}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Popular Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-gray-700 text-white p-4 rounded-lg shadow-xl transform transition hover:scale-105">
              <h3 className="text-lg font-bold">Popular Product {index + 1}</h3>
              <p className="text-sm">Description of popular product {index + 1}</p>
            </div>
          ))}
        </div>
      </section>

      {/* All Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-700 text-white p-4 rounded-lg shadow-xl transform transition hover:scale-105">
              <h3 className="text-lg font-bold">Product {index + 1}</h3>
              <p className="text-sm">Description of product {index + 1}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
