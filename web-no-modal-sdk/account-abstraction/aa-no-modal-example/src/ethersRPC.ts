/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountAbstractionProvider } from "@web3auth/account-abstraction-provider";
import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

const getChainId = async (provider: IProvider): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    // Get the connected Chain's ID
    const networkDetails = await ethersProvider.getNetwork();
    return networkDetails.chainId.toString();
  } catch (error) {
    return error;
  }
}

const getAccounts = async (provider: IProvider): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    // Get user's Ethereum public address
    const address = signer.getAddress();

    return await address;
  } catch (error) {
    return error;
  }
}

const getBalance = async (provider: IProvider): Promise<string> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    // Get user's Ethereum public address
    const address = signer.getAddress();

    // Get user's balance in ether
    const balance = ethers.formatEther(
      await ethersProvider.getBalance(address)
    );

    return balance;
  } catch (error) {
    return error as string;
  }
}

const sendTransaction = async (provider: IProvider): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";
    const amount = ethers.parseEther("0.0001");

    // Submit transaction to the blockchain
    const tx = await signer.sendTransaction({
      to: destination,
      value: amount,
    });

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    return receipt;
  } catch (error) {
    return error as string;
  }
}

const sendBatchTransaction = async (provider: AccountAbstractionProvider): Promise<any> => {
  try {
    const bundlerClient = provider.bundlerClient!;
    const smartAccount = provider.smartAccount!;

    const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";
    const destination2 = "0xcEB7380d00A4750863a241BF74C7469f1C61F5F7"

    const amount = ethers.parseEther("0.00001");

    // Submit transaction to the blockchain
    const userOpHash = await bundlerClient.sendUserOperation({
      account: smartAccount,
      calls: [
        // Approve USDC on Sepolia chain for Pimlico's ERC 20 Paymaster
        // {
        //   to: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        //   abi: parseAbi(["function approve(address,uint)"]),
        //   functionName: "approve",
        //   args: ["0x0000000000000039cd5e8aE05257CE51C473ddd1", maxUint256],
        // },
        {
          to: destination,
          value: amount,
          data: '0x',
        },
        {
          to: destination2,
          value: amount,
          data: '0x',
        }
      ]
    })

    // Retrieve transaction hash
    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });
    
    return receipt.receipt.transactionHash;
  } catch (error) {
    return error as string;
  }
}

const signTransaction = async (provider: IProvider): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";

    const amount = ethers.parseEther("0.001");

    // Sign the transaction
    const signature = await signer.signTransaction({
      to: destination,
      value: amount,
    });

    return signature;
  } catch (error) {
    return error as string;
  }
}

const signMessage = async (provider: IProvider): Promise<any> => {
  try {
    // For ethers v5
    // const ethersProvider = new ethers.providers.Web3Provider(provider);
    const ethersProvider = new ethers.BrowserProvider(provider);

    // For ethers v5
    // const signer = ethersProvider.getSigner();
    const signer = await ethersProvider.getSigner();
    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await signer.signMessage(originalMessage);

    return signedMessage;
  } catch (error) {
    return error as string;
  }
}

export default { getChainId, getAccounts, getBalance, sendTransaction, signMessage, signTransaction, sendBatchTransaction };