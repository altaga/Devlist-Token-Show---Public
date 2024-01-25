'use client'

import { TOKEN_2022_PROGRAM_ID, getMultipleAccounts, getTokenMetadata } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const { connected } = useWallet();
  const { connection } = useConnection()
  const searchParams = useSearchParams()
  const [metadataList, setMetadataList] = useState([]);
  const getAllTokens = useCallback(async (address) => {
    const walletToQuery = new PublicKey(address);
    const accounts = await connection.getParsedTokenAccountsByOwner(
      walletToQuery,
      {
        programId: TOKEN_2022_PROGRAM_ID,
      }
    );
    const processedAccounts = accounts.value.map((data) => data.pubkey)
    const mintAccounts = await getMultipleAccounts(connection, processedAccounts, 'finalized', TOKEN_2022_PROGRAM_ID)
    const processedMintAccounts = mintAccounts.map((data) => data.mint)
    const metadatas = await Promise.all(processedMintAccounts.map((account) => getTokenMetadata(connection, account)))
    const arweaveURIDatas = await Promise.all(metadatas.map((data) => fetch(data.uri)))
    const processedArweaveURIDatas = await Promise.all(arweaveURIDatas.map((data) => data.json()))
    const finalData = processedArweaveURIDatas.map((data, index) => {
      return {
        ...data,
        address,
        mint: processedMintAccounts[index].toBase58()
      }
    })
    console.log(finalData)
    setMetadataList(finalData)
  }, [connection, setMetadataList])

  useEffect(() => {
    getAllTokens(searchParams.get('publicKey'))
  }, [getAllTokens, searchParams])

  useEffect(() => {
    console.log(searchParams.get('publicKey'))
    if (searchParams.get('publicKey') === null || searchParams.get('publicKey') === '') {
      window.location.href = `/`
    }
  }, [searchParams])

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw" }}>
      {
        connected ? <div style={{ position: "absolute", top: "30px", right: "30px", width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <WalletMultiButton />
        </div>
          :
          <div style={{ position: "absolute", top: "5vh", right: "30px", width: "100%", display: "flex", justifyContent: "flex-end" }}>
            <h2 style={{ color: "white", textAlign: "center", fontWeight: "bold", marginBottom: "1rem" }}>
              <div>{"Address : " + searchParams.get('publicKey')}</div>
            </h2>
          </div>
      }
      <div style={{ width: "90vw", overflowX: "scroll", flexDirection: "row", display: "flex", gap: "50px", justifyContent: "center" }}>
        {
          metadataList.map((data, index) => {
            return <div key={index} style={{ height: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0 0 10px rgba(255,255, 255, 1)", color: "black" }}>
              <h4 style={{ marginBottom: "10px" }}>
                <div>{"Name : " + data.name}</div>
              </h4>
              <h4 style={{ marginBottom: "10px" }}>
                <div>{"Symbol : " + data.symbol}</div>
              </h4>
              <h4 style={{ marginBottom: "10px" }}>
                <div>{"Description : " + data.description}</div>
              </h4>
              <h4 style={{ marginBottom: "10px" }}>
                {"External Url : "}
                <Link style={{ textDecoration: "underline", color: "blue" }} href={`${data.external_url}`}>{data.external_url}</Link>
              </h4>
              {
                data?.image && <Image priority alt="token image" style={{ borderRadius: "10px", border: "1px solid black", margin: "10px" }} src={data.image} width={200} height={200} />
              }
              <h4 >
                {"Address : "}
                <Link style={{ textDecoration: "underline", color: "blue" }} href={`https://solana.fm/address/${data.address}`}>{data.address}</Link>
              </h4>
              <h4 >
                {"Mint Address : "}
                <Link style={{ textDecoration: "underline", color: "blue" }} href={`https://solana.fm/address/${data.mint}`}>{data.mint}</Link>
              </h4>
            </div>
          })
        }
      </div>

    </div>
  );
}
