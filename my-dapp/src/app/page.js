'use client'

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const inputRef = useRef();
  const { publicKey } = useWallet();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (publicKey) {
      setAddress(publicKey.toBase58());
    }
  }, [publicKey, setAddress]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0 0 10px rgba(255,255, 255, 1)" }}>
        <h2 style={{ color: "black", textAlign: "center", fontWeight: "bold", marginBottom: "1rem" }}>
          <div>{"Connect your wallet"}</div>
        </h2>
        <WalletMultiButton />
        <br />
        <h2 style={{ color: "black", textAlign: "center", fontWeight: "bold", marginBottom: "1rem" }}>
          or Write your Wallet
        </h2>
        <input disabled={publicKey ? true : false} ref={inputRef} placeholder="Wallet address" style={{ backgroundColor: "white", padding: "10px", borderRadius: "10px", color: "black", textAlign: "center", width: "30vw" }} />
        <br />
        <button style={{ backgroundColor: "#512da8", color: "white", fontWeight: "bold", fontSize: "16px", padding: "10px", borderRadius: "4px", marginTop: "10px", border: "none" }} onClick={() => {
          const temp = inputRef.current.value === "" ? address : inputRef.current.value
          window.location.href = `/address?publicKey=${temp}`
        }}>
          Search all Tokens
        </button>
      </div>
    </div>
  );
}
