import React, { useState, useEffect } from 'react';

import chainsProvider from '@/utils/chainsProvider';

const DetectProvider = ({
  xfiObject,
}: {
  xfiObject: any;
}) => {
  return (
    <>
      <div className="text-[20px] font-semibold">
        XDEFI Injected Chains Providers
      </div>
      {xfiObject && (
        <>
          <div className="text-[16px]">
            -<span className="mx-1 italic">window.ethereum</span>{' '}
            <span data-testid="window.ethereum-detect-status">
              {xfiObject ? 'detected' : 'not detected'}
            </span>
          </div>
          <div className="text-[16px]">
            -<span className="mx-1 italic">window.xfi</span>{' '}
            <span data-testid="window.xfi-detect-status">
              {xfiObject ? 'detected' : 'not detected'}
            </span>
          </div>
          <table className="table-auto w-full mt-3">
            <thead>
              <tr>
                <th className="border px-4 py-2">Provider</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {chainsProvider.map((chain) => {
                const provider = chain === 'ethereum'
                  ? 'window.ethereum'
                  : `window.xfi.${chain}`;
                return (
                  <tr key={chain}>
                    <td className="border px-4 py-2">
                      {provider}
                    </td>
                    <td
                      className="border px-4 py-2"
                      data-testid={`${provider}-detect-status`}>
                      {xfiObject[chain] ? 'detected' : 'not detected'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default DetectProvider;
