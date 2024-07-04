import React, { useState, useEffect } from 'react';
import { Window as KeplrWindow } from '@keplr-wallet/types';

import chainsSupported from '@/utils/chainsSupported';

declare global {
  interface Window extends KeplrWindow {
    xfi: any;
  }
}

const CosmosChain = ({ chain }: { chain: string }) => {
  const [chainId, setChainId] = useState<any>('cosmoshub-4');
  const [account, setAccount] = useState<any>({});

  const getAccount = async () => {
    if (window.xfi && window.xfi.keplr) {
      const offlineSigner = window.xfi.keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      setAccount(accounts[0]);
    }
  };

  useEffect(() => {
    const chainSelected = chainsSupported.find((c) => c.chain === chain);
    if (chainSelected) {
      setChainId(chainSelected.chainId);
    }
  }, [chain]);

  return (
    <div className="mt-3">
      <div className="overflow-auto">
        <table className="table-auto w-full">
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
                  onClick={getAccount}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Get
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
                  <span className="inline-block border-b-2 border-blue-600 text-[14px] leading-[48px]">
                    Response
                  </span>
                </div>
                <pre className="p-5">{JSON.stringify(account, null, 2)}</pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-3 text-center">More features coming soon...</div>
    </div>
  );
};

export default CosmosChain;
