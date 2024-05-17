import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import DefaultLayout from '@/layouts/default';
import DetectProvider from '@/components/DetectProvider';
import BNBChain from '@/components/chains/BNBChain';
import BaseChain from '@/components/chains/BaseChain';
import ThorChain from '@/components/chains/ThorChain';

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

  useEffect(() => {
    const checkXfiObject = () => {
      if ('xfi' in window) {
        setXfiObject(window.xfi);

        try {
          setCurrentNetwork(window.xfi.bitcoin?.network);
        } catch (e) {
          console.error(e);
        }

        chainsProvider.forEach((chain) => {
          if (window.xfi && window.xfi[chain]) {
            const provider = window.xfi[chain];
            if (provider.on) {
              provider.on('chainChanged', (obj: any) => {
                setCurrentNetwork(obj.network || obj._network);
              });

              provider.on('accountsChanged', (obj: any) => {
                console.log(`accountsChanged::${chain}`, obj);
              });
            }
          }
        });
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

  useEffect(() => {
    const chainData = chainsSupported.find(
      (chain) => chain.chain === selectedChain
    );
    if (chainData) {
      if (chainData.chain === 'solana') {
        connectSolana();
        return;
      }
      if (chainData.chain === 'near') {
        connectNear();
        return;
      }
      if (chainData.baseChain === 'CosmosChain') {
        connentKeplr(chainData.chainId);
      } else if (chainData.baseChain === 'EVM') {
        connectEthereum();
      } else {
        connectBaseChain(chainData.chain);
      }
    }
  }, [selectedChain]);

  return (
    <DefaultLayout>
      <h2 className="text-center text-3xl font-semibold">DApp Example</h2>
      <div className="mt-3">
        <span className="font-medium italic">* Reference documentation:</span>{' '}
        <Link
          className="text-blue-500 underline"
          href="https://developers.xdefi.io/developers/extension-wallet"
        >
          XDEFI Dev Docs
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-5">
        {xfiObject && (
          <>
            <div className="col-span-1">
              <DetectProvider
                xfiObject={xfiObject}
                currentNetwork={currentNetwork}
              />
            </div>
            <div className="col-span-2">
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
              <div>
                {selectedChain && (
                  <>
                    <div className="text-[16px] mt-2">
                      - account: <span className="italic">{account}</span>
                    </div>
                    <div className="text-[18px] text-center font-semibold mt-2">
                      Transfer/Deposit
                    </div>
                    {[
                      'bitcoin',
                      'bitcoincash',
                      'dogecoin',
                      'litecoin',
                    ].includes(selectedChain) && (
                      <BaseChain account={account} chain={selectedChain} />
                    )}
                    {selectedChain === 'binance' && (
                      <BNBChain account={account} />
                    )}
                    {['thorchain', 'mayachain'].includes(selectedChain) && (
                      <ThorChain account={account} chain={selectedChain} />
                    )}
                    {chainsSupported.find(
                      (chain) =>
                        chain.chain === selectedChain && chain.baseChain
                    ) && <div className="text-center italic">Coming Soon!</div>}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default DAppExample;
