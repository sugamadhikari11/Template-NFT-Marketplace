'use client';

export default function Navbar({darkMode}) {
  return (
    <nav className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} p-4 shadow-md flex items-center justify-between`}>
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
