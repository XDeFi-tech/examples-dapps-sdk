import React, { useState, useEffect } from 'react';
import { Window as KeplrWindow } from '@keplr-wallet/types';

import chainsSupported from '@/utils/chainsSupported';
import { COSMOS_MANIFESTS } from '@/utils/cosmosManifest';
import bs58 from 'bs58';

declare global {
  interface Window extends KeplrWindow {
    xfi: any;
    keplr: any;
  }
}

const CosmosChain = ({ chain }: { chain: string }) => {
  const [manifest, setManifest] = useState<any>({});
  const [chainId, setChainId] = useState<any>('cosmoshub-4');
  const [key, setKey] = useState<any>({});
  const [balance, setBalance] = useState<any>(0);
  const [signAminoResp, setSignAminoResp] = useState<any>({});
  const [signDirectResp, setSignDirectResp] = useState<any>({});
  const [sendTxResp, setSendTxResp] = useState<any>({});

  const getKey = async () => {
    if (window.xfi && window.xfi.keplr) {
      const key = await window.keplr?.getKey(chainId);
      setKey({
        ...key,
        pubKey: bs58.encode(Buffer.from(key.pubKey)),
      });
      // or
      // const offlineSigner = window.xfi.keplr.getOfflineSigner(chainId);
      // const accounts = await offlineSigner.getAccounts();
      // setKey({
      //   ...accounts[0],
      // });
    }
  };

  const getBalance = async () => {
    const account = await window.keplr?.getKey(chainId);
    const uri = `${manifest.lcdURL}/cosmos/bank/v1beta1/balances/${account?.bech32Address}?pagination.limit=1000`;
    try {
      const data = await fetch(uri).then((res) => res.json());
      const balance = data.balances.find(
        (b: any) => b.denom === manifest.denom
      );
      if (balance) {
        const amount =
          parseFloat(balance.amount) / Math.pow(10, manifest.decimals);
        setBalance(`${amount}${manifest.denom}`);
      } else {
        setBalance(`0 ${manifest.denom}`);
      }
    } catch (e) {
      setBalance('Error fetching balance, please try again later');
    }
  };

  const signAmino = async () => {
    const offlineSigner = window.xfi.keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();

    // This is a sample signDoc for MsgSend
    const signDoc = {
      chain_id: chainId,
      account_number: '0',
      sequence: '0',
      fee: {
        amount: [{ denom: manifest.denom, amount: '1000' }],
        gas: '200000',
      },
      msgs: [
        {
          type: 'cosmos-sdk/MsgSend',
          value: {
            from_address: accounts[0].address,
            to_address: accounts[0].address,
            amount: [{ denom: manifest.denom, amount: '1000000' }],
          },
        },
      ],
      memo: '',
    };

    const signResp = await window.keplr?.signAmino(
      chainId,
      accounts[0].address,
      signDoc
    );
    // or
    // const signResp = await offlineSigner.signAmino(
    //   accounts[0].address,
    //   signDoc
    // );

    setSignAminoResp(signResp);
  };

  // TODO: Implement signDirect
  const signDirect = async () => {
    const response = await window.keplr?.signDirect();

    setSignDirectResp(response);
  };

  const sendTx = async () => {
    const offlineSigner = window.xfi.keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();

    const signDoc = {
      chain_id: chainId,
      account_number: '0',
      sequence: '0',
      fee: {
        amount: [{ denom: manifest.denom, amount: '1000' }],
        gas: '200000',
      },
      msgs: [
        {
          type: 'cosmos-sdk/MsgSend',
          value: {
            from_address: accounts[0].address,
            to_address: accounts[0].address,
            amount: [{ denom: manifest.denom, amount: '1000000' }],
          },
        },
      ],
      memo: '',
    };

    const response = await window.keplr?.sendTx(
      chainId,
      accounts[0].address,
      signDoc
    );

    setSendTxResp(response);
  };

  useEffect(() => {
    setManifest(COSMOS_MANIFESTS[chain]);
    setKey({});
    setBalance(0);
    setSignAminoResp({});
    setSignDirectResp({});
    setSendTxResp({});

    const chainSelected = chainsSupported.find((c) => c.chain === chain);
    if (chainSelected) {
      setChainId(chainSelected.chainId);
    }
  }, [chain]);

  return (
    <div className="mt-3">
      <div className="overflow-auto">
        <table
          className="table-auto w-full"
          data-testid="get-address-table"
        >
          <thead>
            <tr>
              <th
                colSpan={2}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                Get Address/Public Key
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={getKey}
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  data-testid="send-request-button"
                >
                  Send Request
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={2}
                className="border my-4 bg-[#F6F6F7] text-[#24292E]"
              >
                <div className="px-5 border-b border-[#e2e2e3]">
                  <span className="inline-block border-b-2 border-[#05C92F] text-[14px] leading-[48px]">
                    Response
                  </span>
                </div>
                <pre
                  className="p-5"
                  data-testid="response-data"
                >
                  {JSON.stringify(key, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="overflow-auto">
        <table
          className="table-auto w-full mt-3"
          data-testid="get-balance-table"
        >
          <thead>
            <tr>
              <th
                colSpan={2}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                Get Balance
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={getBalance}
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  data-testid="send-request-button"
                >
                  Send Request
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={2}
                className="border my-4 bg-[#F6F6F7] text-[#24292E]"
              >
                <div className="px-5 border-b border-[#e2e2e3]">
                  <span className="inline-block border-b-2 border-[#05C92F] text-[14px] leading-[48px]">
                    Response
                  </span>
                </div>
                <pre
                  className="p-5 uppercase"
                  data-testid="response-data"
                >
                  {balance}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="overflow-auto">
        <table
          className="table-auto w-full mt-3"
          data-testid="sign-amino-table"
        >
          <thead>
            <tr>
              <th
                colSpan={2}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                Sign Amino
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={signAmino}
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  data-testid="send-request-button"
                >
                  Send Request
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={2}
                className="border my-4 bg-[#F6F6F7] text-[#24292E]"
              >
                <div className="px-5 border-b border-[#e2e2e3]">
                  <span className="inline-block border-b-2 border-[#05C92F] text-[14px] leading-[48px]">
                    Response
                  </span>
                </div>
                <pre
                  className="p-5"
                  data-testid="response-data"
                >
                  {JSON.stringify(signAminoResp, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="overflow-auto">
        <table className="table-auto w-full mt-3">
          <thead>
            <tr>
              <th
                colSpan={2}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                Sign Direct / Protobuf
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-center">Coming soon...</td>
            </tr>
            {/* <tr>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={signDirect}
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                >
                  Send Request
                </button>
              </td>
            </tr> */}
          </tbody>
          {/* <tfoot>
            <tr>
              <td
                colSpan={2}
                className="border my-4 bg-[#F6F6F7] text-[#24292E]"
              >
                <div className="px-5 border-b border-[#e2e2e3]">
                  <span className="inline-block border-b-2 border-[#05C92F] text-[14px] leading-[48px]">
                    Response
                  </span>
                </div>
                <pre className="p-5">
                  {JSON.stringify(signDirectResp, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot> */}
        </table>
      </div>
      <div className="overflow-auto">
        <table className="table-auto w-full mt-3">
          <thead>
            <tr>
              <th
                colSpan={2}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                Request Transaction Broadcasting
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-center">Coming soon...</td>
            </tr>
            {/* <tr>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={sendTx}
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                >
                  Send Request
                </button>
              </td>
            </tr> */}
          </tbody>
          {/* <tfoot>
            <tr>
              <td
                colSpan={2}
                className="border my-4 bg-[#F6F6F7] text-[#24292E]"
              >
                <div className="px-5 border-b border-[#e2e2e3]">
                  <span className="inline-block border-b-2 border-[#05C92F] text-[14px] leading-[48px]">
                    Response
                  </span>
                </div>
                <pre className="p-5">{JSON.stringify(sendTxResp, null, 2)}</pre>
              </td>
            </tr>
          </tfoot> */}
        </table>
      </div>
    </div>
  );
};

export default CosmosChain;
