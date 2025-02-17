"use client";

import { useState } from "react";
import { pinata } from "@/utils/config";

export default function Home() {
  const [file, setFile] = useState();
  const [nftName, setNftName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    if (!file || !nftName || !description) {
      alert("Please fill all fields");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", nftName);
    formData.append("description", description);

    try {
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      const response = await uploadRequest.json();

      if (response.imageUrl && response.metadataUrl) {
        setImageUrl(response.imageUrl);
      } else {
        alert(response.error || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Trouble uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFile(e.target?.files?.[0]);
  };

  return (
    <main className="w-full min-h-screen flex flex-col pt-20 items-center p-6">
      <div className="p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center border border-gray-300">
        <h1 className="text-xl font-semibold mb-4"> Mint & Upload File to Pinata</h1>
        <input 
          type="file" 
          onChange={handleChange} 
          className="w-full mb-4 p-2 border border-gray-300 rounded-md" 
        />
        <input type="text" placeholder="NFT Name" value={nftName} onChange={(e) => setNftName(e.target.value)} className="border p-2" />
        <textarea placeholder="NFT Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2"></textarea>
        <div className="w-full flex justify-center">
          <button 
            type="button" 
            disabled={uploading} 
            onClick={uploadFile} 
            className={`w-3/4 py-2 rounded-md text-white font-semibold transition ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        {url && (
          <div className="mt-4 w-full text-center">
            <p className="text-sm text-gray-600">Uploaded Image:</p>
            <img src={url} alt="Image from Pinata" className="mt-2 rounded-lg shadow-md max-h-48 mx-auto" />
          </div>
        )}
      </div>
    </main>
  );
}
