import { useMetamask } from '../../hooks/web3/useMetamask';

export default function Navbar({ darkMode, setCurrentPage }) {
  const { userAddress, connect, disconnect, connectionStatus, networkError } = useMetamask();

  return (
    <nav className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} p-4 shadow-md flex items-center justify-between`}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setCurrentPage("landing")}
      >
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <h1 className="text-xl font-bold">Token Ghar</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>

        {userAddress && (
          <p className="text-sm">
            {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </p>
        )}

        {userAddress && networkError && (
          <p className="text-sm text-red-400">Please switch to the Hardhat network.</p>
        )}

        {userAddress ? (
          <button onClick={disconnect} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all">
            Disconnect
          </button>
        ) : (
          <button onClick={connect} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all">
            Connect MetaMask
          </button>
        )}
      </div>

    </nav>
  );
}
