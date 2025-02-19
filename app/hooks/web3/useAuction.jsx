import { useState, useCallback } from "react";
import { useMetamask } from "./useMetamask";
import { useContract } from "./useContract";
import auctionABI from "../contracts/AuctionAbi.json";
import nftABI from "../contracts/NFTAbi.json";

const auctionAddress = process.env.NEXT_PUBLIC_AUCTION_ADDRESS;

export function useAuction() {
    const { provider, account } = useMetamask();
    const auctionContract = useContract(provider, account, auctionAddress, auctionABI.abi);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nfts, setNFTs] = useState([]);

    const approveAndAddNFT = useCallback(
        async (nftAddress, tokenId, description, initialPrice) => {
            try {
                if (!auctionContract) throw new Error("Auction contract not initialized.");
                if (!nftAddress || !tokenId || !description || !initialPrice) {
                    throw new Error("All fields are required.");
                }

                setLoading(true);
                setError(null);

                const nftContract = new ethers.Contract(nftAddress, nftABI.abi, provider.getSigner());
                const approvalTx = await nftContract.approve(auctionAddress, tokenId);
                await approvalTx.wait();

                const priceInWei = ethers.parseUnits(initialPrice, "ether");
                const auctionTx = await auctionContract.addNFT(nftAddress, tokenId, description, priceInWei);
                await auctionTx.wait();

                setLoading(false);
                return auctionTx;
            } catch (err) {
                setError(err.message);
                setLoading(false);
                throw err;
            }
        },
        [auctionContract, provider]
    );

    const fetchNFTsByUser = useCallback(
        async (userAddress) => {
            try {
                if (!auctionContract || !userAddress) return;
                setLoading(true);
                setError(null);

                const userNFTs = await auctionContract.getAllNFTsByUser(userAddress);

                const formattedNFTs = await Promise.all(
                    userNFTs.map(async (nft) => {
                        const metadataUri = nft.metadataUri?.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
                        let image = null;

                        if (metadataUri) {
                            try {
                                const response = await fetch(metadataUri);
                                const metadata = await response.json();
                                image = metadata.image?.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
                            } catch (err) {
                                console.error("Error fetching metadata:", err);
                            }
                        }

                        return {
                            id: nft.nftId.toString(),
                            tokenId: nft.tokenId.toString(),
                            nftAddress: nft.nftAddress,
                            owner: nft.owner,
                            description: nft.description,
                            image,
                            initialPrice: ethers.formatEther(nft.initialPrice),
                            status: mapStatus(parseInt(nft.status)),
                        };
                    })
                );

                setNFTs(formattedNFTs);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        },
        [auctionContract]
    );

    const startAuction = useCallback(
        async (nftTokenId, startingPrice, duration) => {
            try {
                if (!auctionContract) throw new Error("Auction contract not initialized.");

                setLoading(true);
                setError(null);

                const tx = await auctionContract.startAuction(nftTokenId, startingPrice, duration);
                await tx.wait();

                setLoading(false);
                return tx;
            } catch (err) {
                setError(err.message);
                setLoading(false);
                throw err;
            }
        },
        [auctionContract]
    );

    const endAuction = useCallback(
        async (nftTokenId) => {
            try {
                if (!auctionContract) throw new Error("Auction contract not initialized.");

                setLoading(true);
                setError(null);

                const tx = await auctionContract.endAuction(nftTokenId);
                await tx.wait();

                setLoading(false);
                return tx;
            } catch (err) {
                setError(err.message);
                setLoading(false);
                throw err;
            }
        },
        [auctionContract]
    );

    const mapStatus = (status) => {
        switch (status) {
            case 0:
                return "Pending";
            case 1:
                return "Active";
            case 2:
                return "Ended";
            case 3:
                return "Revoked";
            default:
                return "Unknown";
        }
    };

    return {
        approveAndAddNFT,
        fetchNFTsByUser,
        startAuction,
        endAuction,
        nfts,
        loading,
        error,
    };
}
