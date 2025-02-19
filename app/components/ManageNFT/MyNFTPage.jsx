import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useGetAllNFTsByUser from "../../hooks/useGetAllNFTsByUSER";

const MyNFTs = () => {
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    if (!window.ethereum) return;

    const loadProvider = async () => {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();

      setProvider(web3Provider);
      setUserAddress(address);
    };

    loadProvider();
  }, []);

  const { nfts, loading, error } = useGetAllNFTsByUser(provider, userAddress);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Auction NFTs</h2>

      {loading && <p>Loading NFTs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="border p-4 rounded-lg">
            {nft.image && <img src={nft.image} alt={nft.description} className="w-full h-40 object-cover rounded-md" />}
            <h3 className="text-lg font-semibold mt-2">{nft.description}</h3>
            <p className="text-xs text-gray-400">Token ID: {nft.tokenId}</p>
            <p className="text-sm font-bold">Price: {nft.initialPrice} ETH</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNFTs;
