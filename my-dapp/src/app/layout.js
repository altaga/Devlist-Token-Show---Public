import dynamic from "next/dynamic";
import { Kanit } from "next/font/google";
import "./globals.css";

const WalletComponent = dynamic(() => import("./walletComponent"), { ssr: false })

const inter = Kanit({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Token-2022 Visualizer",
  description: "Created by Altaga",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletComponent>
          {children}
        </WalletComponent>
        <div style={{ position: "absolute", bottom: "5vh", width: "100vw", display: "flex", textAlign: "center", justifyContent: "center", }}>
          <h2 style={{ color: "#ffffffaa", textAlign: "center", fontWeight: "bold", marginBottom: "1rem" }}>
            This dapp aims to show all Token-2022 within a wallet, including their metadata.
          </h2>
        </div>
      </body>
    </html>
  );
}
