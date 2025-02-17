import { useMetamask } from '../../hooks/useMetamask'; // Adjust the path to your hook

export default function Navbar({ darkMode, setCurrentPage }) {
  const { accounts, userAddress, connect, disconnect, connectionStatus, networkError } = useMetamask();

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
        {connectionStatus && <p>{connectionStatus}</p>} {/* Show success message */}
      {networkError && <p style={{ color: 'red' }}>Please switch to the correct network.</p>} {/* Show network error */}
      
      {userAddress ? (
        <div>
          <p>Connected account: {userAddress}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect MetaMask</button>
      )}
      </div>
    </nav>
  );
}
