/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { readContract } from "wagmi/actions";
import abi from "../contract-abi.json";
import { signTypedData, getAccount } from "@wagmi/core";
import { config } from "../utils/config";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import {
  isSolanaWallet,
  isSignedMessage,
  IEmbeddedWalletSolanaSigner,
} from "@dynamic-labs/solana";


const useMessageSignature = () => {
  function zeroAddress() {
    return "0x0000000000000000000000000000000000000000";
  }

  async function getContractNonce(address: string) {
    return await readContract(config, {
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "nonces",
      args: [address],
    });
  }

  async function requestSelf(
    from: string,
    validUntil: number,
    to = zeroAddress()
  ) {
    return {
      from,
      to,
      nonce: Number(await getContractNonce(from)),
      validUntil,
    };
  }
  const { connector } = getAccount(config);
  const { primaryWallet } = useDynamicContext();



  async function getVerifiedSignature(
    from: `0x${string}`,
    chainId: number,
    validUntil: any,
    to = process.env.NEXT_PUBLIC_EXECUTOR_SIGNER_ADDRESS as `0x${string}`,
    self = true // not needed for now
  ) {
    if (!primaryWallet) return;

    const domain = {
      name: "DEXP2P" as any, // todo: get from sc
      version: "1" as any, // todo: get from sc
      chainId: chainId as any,
      verifyingContract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as any,
    };

    const types = {
      VerifiedRequest: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "validUntil", type: "uint256" },
      ],
    };

    const message = {
      from,
      to,
      nonce: Number(await getContractNonce(self ? from : to!)),
      validUntil,
    };

    if (isEthereumWallet(primaryWallet)) {
      const typedData = {
        primaryType: "VerifiedRequest",
        domain,
        types,
        message,
      };
      const walletClient: any = await primaryWallet.getWalletClient();

      //console.log("check this out >>>" + JSON.stringify(walletClient));

      // sign typed data
      const signature = await walletClient.signTypedData(typedData);
      return signature;
    }
  }



  async function getVerifiedSignatureSolana() {
    if (!primaryWallet) return;

    if (isSolanaWallet(primaryWallet)) {
      const signer = await primaryWallet.getSigner();

      //console.log("check this out solana >>>" + JSON.stringify(signer));

      if (!signer) return;

      const signedMessage = await signer.signMessage(
        new TextEncoder().encode("example")
      );
      //console.log("see signature>>>>>>>>>> " + JSON.stringify(signedMessage.signature));
      if (!signedMessage) return;

      /* const signature: Uint8Array = isSignedMessage(signedMessage)
        ? signedMessage.signature
        : signedMessage; */


      return signedMessage.signature;
    }
  }

  return { requestSelf, getVerifiedSignature, getVerifiedSignatureSolana };
};

export default useMessageSignature;
