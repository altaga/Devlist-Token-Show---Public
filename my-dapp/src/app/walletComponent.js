"use client"
import "@/app/styles/styles.css";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useMemo } from "react";

export default function WalletComponent({ children }) {
  const wallets = useMemo(() => [], []);
  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_RPC_SOLANA}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}