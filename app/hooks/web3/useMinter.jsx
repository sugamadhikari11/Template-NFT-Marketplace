import { useState } from "react";
import { useContract } from "./useContract"; // Import the useContract hook
import minterABI from "../../contracts/MinterAbi.json";
import { CONTRACT_ADDRESS } from "../../../utils/config";

export const useMinter = (provider, account) => {
    const contract = useContract(provider, account, CONTRACT_ADDRESS, minterABI.abi);

    const [mintState, setMintState] = useState({
        loading: false,
        error: null,
        txHash: null,
        tokenId: null,
        nftAddress: null,
    });

    const mintNFT = async (metadataUrl, recipientAddress) => {
        if (!contract || !metadataUrl || !recipientAddress) {
            setMintState((s) => ({ ...s, error: "Missing required parameters or contract not initialized" }));
            return;
        }

        setMintState({ loading: true, error: null, txHash: null, tokenId: null, nftAddress: null });

        try {
            const tx = await contract.mintNFT(metadataUrl, recipientAddress);
            setMintState((s) => ({ ...s, txHash: tx.hash }));

            const receipt = await tx.wait();

            // Extract tokenId from transaction logs
            const event = receipt.logs.find((log) => log.fragment.name === "NFTMinted" && log.address === CONTRACT_ADDRESS);
            const tokenId = event?.args?.tokenId?.toString();

            setMintState((s) => ({ ...s, tokenId, nftAddress: CONTRACT_ADDRESS }));
            return { tx, tokenId, nftAddress: CONTRACT_ADDRESS };
        } catch (error) {
            setMintState((s) => ({
                ...s,
                error: error.reason || error.message || "Minting failed",
            }));
        } finally {
            setMintState((s) => ({ ...s, loading: false }));
        }
    };

    return { mintNFT, ...mintState };
};
