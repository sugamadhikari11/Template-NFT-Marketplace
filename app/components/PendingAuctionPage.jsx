'use client';

export default function PendingAuctionPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Auctions</h2>
      <p className="text-gray-500">These NFTs are awaiting approval or auction start.</p>
      <div className="mt-6">
        {/* Replace with actual pending auction data */}
        <div className="p-4 bg-gray-800 text-white rounded shadow">
          <h3 className="text-lg font-semibold">NFT #456</h3>
          <p>Waiting for approval...</p>
        </div>
      </div>
    </div>
  );
}
