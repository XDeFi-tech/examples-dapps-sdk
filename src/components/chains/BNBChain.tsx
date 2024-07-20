import React, { useState, useEffect } from 'react';

const BNBChain = ({ account }: { account: string }) => {
  const [txData, setTxData] = useState({
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

  const [transferResp, setTransferResp] = useState<Object>({});

  const requestTransfer = () => {
    const { from, to, asset, amount, memo } = txData;
    window.xfi.binance.request(
      {
        method: 'transfer',
        params: [
          {
            asset,
            from: account,
            recipient: to,
            amount,
            memo,
          },
        ],
      },
      (error: any, result: any) => {
        setTransferResp({ error, result });
      }
    );
  };

  return (
    <div className="mt-3">
      <div className="overflow-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th
                colSpan={3}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                Transfer/Deposit Request
              </th>
            </tr>
            <tr>
              <td colSpan={3} className="border px-4 py-2 italic">
                Note: Binance won't be supported in Summer 2024
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan={4} className="border px-4 py-2">
                Asset
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Chain</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                  value={txData.asset.chain}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      asset: {
                        ...txData.asset,
                        chain: e.target.value,
                      },
                    })
                  }
                  placeholder="chain"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Symbol</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                  value={txData.asset.symbol}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      asset: {
                        ...txData.asset,
                        symbol: e.target.value,
                      },
                    })
                  }
                  placeholder="Symbol"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Ticker</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                  value={txData.asset.ticker}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      asset: {
                        ...txData.asset,
                        ticker: e.target.value,
                      },
                    })
                  }
                  placeholder="Ticker"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2" colSpan={2}>
                From Address
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-200 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                  value={account}
                  placeholder="From Address"
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2" colSpan={2}>
                To Address
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                  value={txData.to}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      to: e.target.value,
                    })
                  }
                  placeholder="To Address"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2" colSpan={2}>
                Amount
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                  value={txData.amount.amount}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      amount: {
                        ...txData.amount,
                        amount: Number(e.target.value),
                      },
                    })
                  }
                  placeholder="Amount (smallest unit value)"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2" colSpan={2}>
                Decimals
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                  value={txData.amount.decimals}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      amount: {
                        ...txData.amount,
                        decimals: Number(e.target.value),
                      },
                    })
                  }
                  placeholder="Decimals"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2" colSpan={2}>
                Memo (optional)
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                  value={txData.memo}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      memo: e.target.value,
                    })
                  }
                  placeholder="Memo (optional)"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 text-center" colSpan={3}>
                <button
                  className="bg-slate-800 text-white px-2 py-1 rounded"
                  onClick={requestTransfer}
                >
                  Submit
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={3}
                className="border my-4 bg-[#F6F6F7] text-[#24292E]"
              >
                <div className="px-5 border-b border-[#e2e2e3]">
                  <span className="inline-block border-b-2 border-blue-600 text-[14px] leading-[48px]">
                    Response
                  </span>
                </div>
                <pre className="p-5">{JSON.stringify(transferResp, null, 2)}</pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-3 text-center">More features coming soon...</div>
    </div>
  );
};

export default BNBChain;
