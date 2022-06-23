import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { injected } from '../component/wallet/connector'
import { useWeb3React} from '@web3-react/core'
import { useEffect, useState } from 'react'
import Web3 from 'web3'

declare global {
  interface Window {
    ethereum?: any;
    APP_WEB3?: any;
  }
}

const Home: NextPage = () => {

  useEffect(()=>{
    recreateWeb3()
  },[])

  const {account} = useWeb3React()
  const [connectionName, setConnectionName] = useState<string>("Injected")
  const [address, setAddress] = useState<string|null>(null)
  
  interface ConnDetailsInterface{
    address: string,
connectionName: 
  }

  const recreateWeb3 = async() => {
    let connectionDetails = JSON.parse(window.localStorage.getItem("CONNECTION_DETAILS"))
    console.log(window.localStorage.getItem("CONNECTION_DETAILS"), "HALO")
    if (connectionName === "Injected"){
      await switchOrAddNetworkToMetamask()
      let mainConnection = await injected.activate()
      window.APP_WEB3 = new Web3(Web3.givenProvider)
      if (mainConnection.account){
        setAddress(mainConnection.account)
      }
      window.localStorage.removeItem("CONNECTION_DETAILS")
      console.log(account, "ACCT")
    }
  }

  const switchOrAddNetworkToMetamask = async () => {
    try{
      await window.ethereum.request({
        method:'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }]
      })
    }catch(err){
      console.log(err)
    }
  }

  const connect = async () => {
    if (connectionName === "Injected"){
      await switchOrAddNetworkToMetamask()
      let mainConnection = await injected.activate()
      window.APP_WEB3 = new Web3(Web3.givenProvider)
      if (mainConnection.account){
        setAddress(mainConnection.account)
      }
      window.localStorage.setItem("CONNECTION_DETAILS", JSON.stringify({address: mainConnection.account, connectionName: "Injected"}))
      console.log(account, "ACCT")
    }
  }

  const disconnect = async () => {
    window.localStorage.removeItem("CONNECTION_DETAILS")
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Web3 connector</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <button onClick={connect}>
            connect metamask
          </button>

          {address? <span>Connected with <b>{address}</b></span>: <span>Not connected</span>}

          <button onClick={disconnect}>
            Disconnect
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
       
      </footer>
    </div>
  )
}

export default Home
