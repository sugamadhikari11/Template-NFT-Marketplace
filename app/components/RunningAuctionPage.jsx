'use client';

export default function RunningAuctionPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Running Auctions</h2>
      <p className="text-gray-500">These are the NFTs currently being auctioned.</p>
      <div className="mt-6">
        {/* Replace with actual auction data */}
        <div className="p-4 bg-gray-800 text-white rounded shadow">
          <h3 className="text-lg font-semibold">NFT #123</h3>
          <p>Current Bid: 2.5 ETH</p>
          <p>Time Left: 3h 25m</p>
        </div>
      </div>
    </div>
  );
}
