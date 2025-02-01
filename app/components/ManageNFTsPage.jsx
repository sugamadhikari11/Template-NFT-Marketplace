'use client';

export default function ManageNFTsPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage My NFTs</h2>
      <p className="text-gray-500">Here you can add, edit, and manage your NFTs for auction.</p>
      <div className="mt-6 flex gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Add NFT</button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded">Edit NFT</button>
      </div>
    </div>
  );
}
