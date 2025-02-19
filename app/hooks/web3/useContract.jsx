import { useState, useEffect } from "react";
import { ethers } from "ethers";

export function useContract(provider, account, contractAddress, contractABI) {
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const initializeContract = async () => {
            if (provider && account && contractAddress && contractABI) {
                const signer = await provider.getSigner();
                const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
                setContract(contractInstance);
            }
        };
        initializeContract();
    }, [provider, account, contractAddress, contractABI]);

    return contract;
}
