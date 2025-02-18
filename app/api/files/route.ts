import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "../../../utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const name = data.get("name") as string || "Mystic NFT";
    const description = data.get("description") as string || "This NFT is created by Mystic";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // **Step 1: Upload Image First**
    const imageUpload = await pinata.upload.file(file);
    if (!imageUpload || !imageUpload.IpfsHash) {
      return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }

    const imageCID = imageUpload.IpfsHash; // Store CID for deletion if needed
    // **Step 2: Create Metadata JSON with IPFS URI**

    const metadata = {
      name,
      description,
      image: `ipfs://${imageCID}`, // Use IPFS URI for the image
      attributes: [] // Add any additional attributes here if needed
    };


    // **Step 3: Upload Metadata JSON**

    const jsonUpload = await pinata.upload.json(metadata);

    if (!jsonUpload || !jsonUpload.IpfsHash) {

      // **If metadata upload fails, delete the uploaded image**

      await pinata.unpin([imageCID]).catch(() => {

        console.log("Failed to remove image from IPFS");

      });


      return NextResponse.json({ error: "Metadata upload failed, image deleted" }, { status: 500 });

    }


    // **Step 4: Return both HTTP URLs and IPFS URIs**

    const imageUrl = await pinata.gateways.convert(imageCID); // HTTP URL for display

    const metadataUrl = await pinata.gateways.convert(jsonUpload.IpfsHash); // HTTP URL for metadata


    return NextResponse.json({ 
      imageUrl, 
      metadataUrl, 
      ipfsMetadataUri: `ipfs://${jsonUpload.IpfsHash}` // IPFS URI for minting
    }, { status: 200 });


  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );

  }

}