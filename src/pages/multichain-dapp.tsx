import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import DefaultLayout from '@/layouts/default';
import BNBChain from '@/components/multichain-dapp/BNBChain';
import BaseChain from '@/components/multichain-dapp/BaseChain';
import ThorChain from '@/components/multichain-dapp/ThorChain';

declare global {
  interface Window {
    xfi: any;
  }
}

const MultichainDappExample: NextPage = () => {
  const [xfiObject, setXfiObject] = useState<any>(null);
  const [currentNetwork, setCurrentNetwork] = useState<any>('');
  const [account, setAccount] = useState<any>('');
  const [lastResult, setLastResult] = useState<any>(null);
  const [selectedChain, setSelectedChain] = useState<any>(undefined);

  const chains = [
    {
      key: 'binance',
      name: 'Binance',
      status: 'not detected',
    },
    {
      key: 'bitcoin',
      name: 'Bitcoin',
      status: 'not detected',
    },
    {
      key: 'bitcoincash',
      name: 'Bitcoin Cash',
      status: 'not detected',
    },
    {
      key: 'dogecoin',
      name: 'Dogecoin',
      status: 'not detected',
    },
    {
      key: 'litecoin',
      name: 'Litecoin',
      status: 'not detected',
    },
    {
      key: 'thorchain',
      name: 'Thorchain',
      status: 'not detected',
    },
    {
      key: 'solana',
      name: 'Solana',
      status: 'not detected',
    },
    {
      key: 'tron',
      name: 'Tron',
      status: 'not detected',
    },
  ];

  const [binanceInput, setBinanceInput] = useState({
    asset: {
      chain: 'BNB',
      symbol: 'BNB',
      ticker: 'BNB',
    },
    from: '',
    to: '',
    amount: {
      amount: 2,
      decimals: 8,
    },
    memo: 'memo',
  });

  const [bitcoinbasedInput, setBitcoinbasedInput] = useState({
    from: '',
    to: '',
    feeRate: 5,
    amount: {
      amount: 123,
      decimals: 8,
    },
    memo: 'memo',
  });

  const [thorbasedInput, setThorbasedInput] = useState({
    asset: {
      chain: 'THOR',
      symbol: 'RUNE',
      ticker: 'RUNE',
    },
    from: '',
    recipient: '',
    type: 'deposit',
    amount: {
      amount: 123,
      decimals: 8,
    },
    memo: 'memo',
  });

  const checkXfiObject = () => {
    if ('xfi' in window) {
      setXfiObject(window.xfi);

      try {
        setCurrentNetwork(window.xfi.bitcoin?.network);
      } catch (e) {
        console.error(e);
      }

      chains.forEach((chain) => {
        if (window.xfi && window.xfi[chain.key]) {
          const provider = window.xfi[chain.key];
          provider.on('chainChanged', (obj: any) => {
            setCurrentNetwork(obj.network || obj._network);
          });

          provider.on('accountsChanged', (obj: any) => {
            console.log(`accountsChanged::${chain.key}`, obj);
          });
        }
      });
    }
  };

  useEffect(() => {
    setTimeout(checkXfiObject, 1000);
  }, []);

  const resetInputs = () => {
    setBinanceInput({
      asset: {
        chain: 'BNB',
        symbol: 'BNB',
        ticker: 'BNB',
      },
      from: '',
      to: '',
      amount: {
        amount: 2,
        decimals: 8,
      },
      memo: 'memo',
    });
    setBitcoinbasedInput({
      from: '',
      to: '',
      feeRate: 5,
      amount: {
        amount: 123,
        decimals: 8,
      },
      memo: 'memo',
    });
    setThorbasedInput({
      asset: {
        chain: 'THOR',
        symbol: 'RUNE',
        ticker: 'RUNE',
      },
      from: '',
      recipient: '',
      type: 'deposit',
      amount: {
        amount: 123,
        decimals: 8,
      },
      memo: 'memo',
    });
  };

  useEffect(() => {
    resetInputs();
  }, [selectedChain]);

  const request = async (chain: string, method: string, params: any) => {
    try {
      await xfiObject[chain].request(
        {
          method,
          params: params ?? [],
        },
        (error: any, result: any) => {
          setAccount(result[0]);
          setLastResult({ result });
        }
      );
    } catch (error) {
      console.error(error);
      setLastResult({ error });
    }
  };

  const requestTron = async () => {
    try {
      if (!window.xfi.tron) throw new Error('Tron Provider not found!');
      const account = (await window.xfi.tron.tronWeb.createRandom()).address;
      setAccount(account);
    } catch (error: any) {
      setLastResult({ error: `Error: ${error.message}` });
    }
  };

  const requestSolana = async () => {
    try {
      const account = (await window.xfi.solana.connect()).publicKey.toString();
      setAccount(account);
    } catch (error: any) {
      setLastResult({ error: `Error: ${error.message}` });
    }
  };

  const submitBitcoinBased = () => {
    const { from, to, feeRate, amount, memo } = bitcoinbasedInput;
    request(selectedChain, 'transfer', [
      { from, recipient: to, feeRate, amount, memo },
    ]);
  };

  const submitBinance = () => {
    const { from, to, asset, amount, memo } = binanceInput;
    request(selectedChain, 'transfer', [
      { asset, from, recipient: to, amount, memo },
    ]);
  };

  const submitThorBased = () => {
    const { from, amount, memo, asset, type, recipient } = thorbasedInput;
    request(selectedChain, type, [
      { asset, from, recipient: recipient || undefined, amount, memo },
    ]);
  };

  return (
    <DefaultLayout>
      <h2 className="text-center text-3xl font-semibold">Multichain Dapp Example</h2>
      <div>
        <span className="font-medium italic">Reference documentation:</span>{' '}
        <Link
          className="text-blue-500 underline"
          href="https://developers.xdefi.io/developers/extension-wallet"
        >
          XDEFI Dev Docs
        </Link>
      </div>
      <div className="mt-3 text-[22px] font-medium">
        XDEFI Injected Chains Providers:
        <span className="mx-1 italic">window.xfi</span>
        {xfiObject ? 'detected' : 'not detected'}
      </div>

      {xfiObject && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="">
            <div className="text-[20px] font-medium">I. Accounts request</div>
            <div className="text-[16px]">
              - Account: <span className="italic">{account}</span>
            </div>
            <div className="text-[16px]">
              - Current network:{' '}
              <span className="italic">{currentNetwork}</span>
            </div>
            <table className="table-auto mt-3">
              <thead>
                <tr>
                  <th className="border px-4 py-2">xfi Object</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Network</th>
                  <th className="border px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {chains.map((chain) => (
                  <tr key={chain.key}>
                    <td className="border px-4 py-2">window.xfi.{chain.key}</td>
                    <td className="border px-4 py-2">
                      {xfiObject[chain.key] ? 'detected' : 'not detected'}
                    </td>
                    <td className="border px-4 py-2">
                      {xfiObject[chain.key]?.network}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-[#2770CB] text-white px-2 py-1 rounded"
                        onClick={() =>
                          chain.key === 'solana'
                            ? requestSolana()
                            : chain.key === 'tron'
                            ? requestTron()
                            : request(chain.key, 'request_accounts', [])
                        }
                      >
                        Accounts request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="">
            <div className="text-[20px] font-medium">
              II. Transfer/Deposit request
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="">Chain </span>
              <select
                id="chain-select"
                name="chain-select"
                className="bg-gray-50 text-gray-900 p-1 border border-gray-300 rounded focus:outline-none"
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value as string)}
              >
                <option value={undefined}>Select chain</option>
                {chains.map((chain) => (
                  <option key={chain.key} value={chain.key}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {selectedChain === 'binance' && (
                <BNBChain
                  binanceInput={binanceInput}
                  setBinanceInput={setBinanceInput}
                  submitBinance={submitBinance}
                />
              )}
              {selectedChain &&
                ['bitcoin', 'bitcoincash', 'dogecoin', 'litecoin'].includes(
                  selectedChain
                ) && (
                  <BaseChain
                    bitcoinbasedInput={bitcoinbasedInput}
                    setBitcoinbasedInput={setBitcoinbasedInput}
                    submitBitcoinBased={submitBitcoinBased}
                  />
                )}
              {selectedChain === 'thorchain' && (
                <ThorChain
                  thorbasedInput={thorbasedInput}
                  setThorbasedInput={setThorbasedInput}
                  submitThorBased={submitThorBased}
                />
              )}
              {selectedChain === 'solana' && (
                <div className="text-center italic">Coming Soon!</div>
              )}
            </div>
          </div>
        </div>
      )}
      {lastResult && (
        <div className="text-center italic mt-3">
          Last Result: {JSON.stringify(lastResult)}
        </div>
      )}
    </DefaultLayout>
  );
};

export default MultichainDappExample;
