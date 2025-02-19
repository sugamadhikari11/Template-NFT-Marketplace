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

        {connectionStatus && <p className="text-green-500">{connectionStatus}</p>}

        {networkError && (
          <p className="text-red-500">
            ⚠️ Wrong network! Please switch to Hardhat (Chain ID: 31337).
          </p>
        )}

        {userAddress ? (
          <div className="flex items-center gap-3">
            <p>Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
            <button 
              onClick={disconnect} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={connect} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {connectionStatus ? connectionStatus : "Connect MetaMask"}
          </button>
        )}
      </div>
    </nav>
  );
}
