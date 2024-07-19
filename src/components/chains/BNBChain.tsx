import React, { useState, useEffect } from 'react';

const BNBChain = ({ account }: { account: string }) => {
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

  const submitBinance = () => {
    const { from, to, asset, amount, memo } = binanceInput;
    console.log({ from, to, asset, amount, memo });
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
        setResponse({ error, result });
      }
    );
  };

  const [response, setResponse] = useState<Object>({});

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
                  value={binanceInput.asset.chain}
                  onChange={(e) =>
                    setBinanceInput({
                      ...binanceInput,
                      asset: {
                        ...binanceInput.asset,
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
                  value={binanceInput.asset.symbol}
                  onChange={(e) =>
                    setBinanceInput({
                      ...binanceInput,
                      asset: {
                        ...binanceInput.asset,
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
                  value={binanceInput.asset.ticker}
                  onChange={(e) =>
                    setBinanceInput({
                      ...binanceInput,
                      asset: {
                        ...binanceInput.asset,
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
                  value={binanceInput.to}
                  onChange={(e) =>
                    setBinanceInput({
                      ...binanceInput,
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
                  value={binanceInput.amount.amount}
                  onChange={(e) =>
                    setBinanceInput({
                      ...binanceInput,
                      amount: {
                        ...binanceInput.amount,
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
                  value={binanceInput.amount.decimals}
                  onChange={(e) =>
                    setBinanceInput({
                      ...binanceInput,
                      amount: {
                        ...binanceInput.amount,
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
                  value={binanceInput.memo}
                  onChange={(e) =>
                    setBinanceInput({
                      ...binanceInput,
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
                  onClick={submitBinance}
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
                <pre className="p-5">{JSON.stringify(response, null, 2)}</pre>
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
