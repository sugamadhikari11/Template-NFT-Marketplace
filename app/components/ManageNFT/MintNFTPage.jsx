"use client";

import { useState } from "react";
import { pinata } from "@/utils/config";

export default function Home() {
  const [file, setFile] = useState();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      setUploading(true);
      const keyRequest = await fetch("../api/files");
      const keyData = await keyRequest.json();
      const upload = await pinata.upload.file(file).key(keyData.JWT);
      const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash);
      setUrl(ipfsUrl);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e) => {
    setFile(e.target?.files?.[0]);
  };

  return (
    <main className="w-full min-h-screen flex flex-col pt-20 items-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center border border-gray-300">
        <h1 className="text-xl font-semibold mb-4">Upload File to Pinata</h1>
        <input 
          type="file" 
          onChange={handleChange} 
          className="w-full mb-4 p-2 border border-gray-300 rounded-md" 
        />
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
