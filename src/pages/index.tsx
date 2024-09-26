import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import DefaultLayout from '@/layouts/default';
import DetectProvider from '@/components/DetectProvider';
import BinanceChain from '@/components/chains/Binance';
import BitcoinChain from '@/components/chains/Bitcoin';
import BitcoinCashChain from '@/components/chains/BitcoinCash';
import CosmosChain from '@/components/chains/Cosmos';
import DogecoinChain from '@/components/chains/Dogecoin';
import EVMChain from '@/components/chains/EVMs';
import LitecoinChain from '@/components/chains/Litecoin';
import SolanaChain from '@/components/chains/Solana';
import ThorChain from '@/components/chains/ThorChain';
import TronChain from '@/components/chains/Tron';

import chainsProvider from '@/utils/chainsProvider';
import chainsSupported from '@/utils/chainsSupported';

declare global {
  interface Window {
    xfi: any;
    ethereum: any;
  }
}

const DAppExample: NextPage = () => {
  const [xfiObject, setXfiObject] = useState<any>(null);
  const [currentNetwork, setCurrentNetwork] = useState<any>('');
  const [account, setAccount] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<any>(undefined);
  const [isInstallWallet, setIsInstallWallet] = useState(true);

  useEffect(() => {
    const checkXfiObject = () => {
      if ('xfi' in window) {
        setXfiObject(window.xfi);

        try {
          setCurrentNetwork(window.xfi.ethereum.chainId);
        } catch (e) {
          console.error(e);
        }

        chainsProvider.forEach((chain) => {
          if (window.xfi && window.xfi[chain]) {
            const provider = window.xfi[chain];
            if (provider.on) {
              provider.on('chainChanged', (obj: any) => {
                setCurrentNetwork(obj);
              });

              provider.on('accountsChanged', (obj: any) => {
                setAccount(obj[0]);
              });
            }
          }
        });
      } else {
        setIsInstallWallet(false);
      }
    };

    setTimeout(checkXfiObject, 1000);
  }, []);

  const connentKeplr = async (chainId: any) => {
    try {
      await window.xfi.keplr.enable(chainId);
      const offlineSigner = window.xfi.keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      setAccount(accounts[0].address);
    } catch (error) {
      setAccount('');
    }
  };

  const connectEthereum = async () => {
    try {
      await window.ethereum.request({ method: 'eth_accounts' });
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      setAccount(accounts[0]);
    } catch (error) {
      setAccount('');
    }
  };

  const connectBaseChain = async (chain: string) => {
    try {
      await window.xfi[chain].request(
        {
          method: 'request_accounts',
          params: [],
        },
        (error: any, result: any) => {
          if (error) {
            setAccount('');
          } else {
            setAccount(result[0]);
          }
        }
      );
    } catch (error) {
      setAccount('');
    }
  };

  const connectSolana = async () => {
    try {
      const account = (await window.xfi.solana.connect()).publicKey.toString();
      setAccount(account);
    } catch (error) {
      setAccount('');
    }
  };

  const connectNear = async () => {
    try {
      await window.xfi.near.connect();
      const account = await window.xfi.near.accounts;

      setAccount(account[0].accountId);
    } catch (error) {
      setAccount('');
    }
  };

  const connectTron = async () => {
    try {
      const account = await window.xfi.tron.request({
        method: 'eth_requestAccounts',
      });
      setAccount(account[0]);
    } catch (error) {
      setAccount('');
    }
  };

  useEffect(() => {
    const tokenData = chainsSupported.find(
      (chain) => chain.chain === selectedChain
    );

    if (tokenData) {
      if (tokenData.chain === 'solana') {
        connectSolana();
        return;
      }
      if (tokenData.chain === 'near') {
        connectNear();
        return;
      }
      if (tokenData.chain === 'tron') {
        connectTron();
        return;
      }
      if (tokenData.baseChain === 'CosmosChain') {
        connentKeplr(tokenData.chainId);
      } else if (tokenData.baseChain === 'EVM') {
        connectEthereum();
      } else {
        connectBaseChain(tokenData.chain);
      }
    }
  }, [selectedChain]);

  return (
    <DefaultLayout>
      <h2 className="text-center text-2xl md:text-3xl font-semibold">
        Multichain DApp Example
      </h2>
      <ul className="mt-3">
        <li>
          <span className="font-medium italic">* Repository: </span>
          <Link
            className="text-[#05C92F] underline"
            href="https://github.com/XDeFi-tech/examples-dapps-sdk"
          >
            GitHub
          </Link>
        </li>
        <li>
          <span className="font-medium italic">
            * Reference documentation:{' '}
          </span>
          <Link
            className="text-[#05C92F] underline"
            href="https://developers.xdefi.io/developers/extension-wallet"
          >
            Ctrl Dev Docs
          </Link>
        </li>
        <li>
          <span className="font-medium italic">* To get support: </span>
          <Link
            className="text-[#05C92F] underline"
            href="https://discord.com/channels/826110375639646228/837305087197315082"
          >
            Discord
          </Link>
        </li>
      </ul>
      <div className="mt-3 grid grid-cols-3 gap-5">
        {!isInstallWallet && (
          <div className="col-span-3 text-center">
            No extension installed. Please{' '}
            <a
              href="https://ctrl.xyz/"
              target="_blank"
              className="text-[#05C92F] underline"
            >
              install Ctrl Wallet
            </a>
          </div>
        )}
        {xfiObject && (
          <>
            <div className="col-span-3 md:col-span-1">
              <DetectProvider xfiObject={xfiObject} />
            </div>
            <div className="col-span-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="">Chain </span>
                <select
                  id="chain-select"
                  name="chain-select"
                  className="bg-gray-50 text-gray-900 p-1 border border-gray-300 rounded focus:outline-none"
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value as string)}
                >
                  <option value={undefined}>Select chain</option>
                  {chainsSupported.map((chain) => (
                    <option key={chain.chain} value={chain.chain}>
                      {chain.name}{' '}
                      {chain.baseChain ? `(${chain.baseChain})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              {selectedChain && (
                <>
                  <div className="text-[16px] mt-2">
                    - current account:{' '}
                    <span
                      className="italic"
                      data-testid="current-account"
                    >
                      {account}
                    </span>
                  </div>
                  {selectedChain === 'binance' && (
                    <BinanceChain account={account} />
                  )}
                  {selectedChain === 'bitcoin' && (
                    <BitcoinChain account={account} />
                  )}
                  {selectedChain === 'bitcoincash' && (
                    <BitcoinCashChain account={account} />
                  )}
                  {chainsSupported.find(
                    (chain) =>
                      chain.chain === selectedChain &&
                      chain.baseChain === 'CosmosChain'
                  ) && <CosmosChain chain={selectedChain} />}
                  {selectedChain === 'dogecoin' && (
                    <DogecoinChain account={account} />
                  )}
                  {chainsSupported.find(
                    (chain) =>
                      chain.chain === selectedChain && chain.baseChain === 'EVM'
                  ) && (
                    <>
                      <div className="text-[16px] mt-2">
                        - current network:{' '}
                        <span
                          className="italic"
                          data-testid="current-network"
                        >
                          {currentNetwork}
                        </span>
                      </div>
                      <EVMChain
                        account={account}
                        token={selectedChain}
                        currentNetwork={currentNetwork}
                      />
                    </>
                  )}
                  {selectedChain === 'litecoin' && (
                    <LitecoinChain account={account} />
                  )}
                  {['near', 'terra'].includes(selectedChain) && (
                    <div className="mt-3 text-center italic">
                      To Deprecated in Summer 2024!
                    </div>
                  )}
                  {selectedChain === 'solana' && <SolanaChain />}
                  {['thorchain', 'mayachain'].includes(selectedChain) && (
                    <ThorChain account={account} chain={selectedChain} />
                  )}
                  {selectedChain === 'tron' && <TronChain />}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default DAppExample;
