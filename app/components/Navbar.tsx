'use client';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 shadow-lg bg-gray-600 text-white">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <h1 className="text-xl font-bold">Token Ghar</h1>
      </div>
      <div className="flex items-center gap-2">
      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm">0x123...account-address-by-fecthing</span>
      </div>
    </nav>
  );
}
