import React, { useState, useEffect } from 'react';

const ThorChain = ({ account, chain }: { account: string; chain: string }) => {
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
      amount: 1234,
      decimals: 8,
    },
    memo: 'memo',
  });

  const [response, setResponse] = useState<Object>({});

  useEffect(() => {
    if (chain === 'mayachain') {
      setThorbasedInput({
        ...thorbasedInput,
        asset: {
          chain: 'MAYA',
          symbol: 'MAYA',
          ticker: 'MAYA',
        },
      });
    } else {
      setThorbasedInput({
        ...thorbasedInput,
        asset: {
          chain: 'THOR',
          symbol: 'RUNE',
          ticker: 'RUNE',
        },
      });
    }
  }, [chain]);

  const submitThorBased = () => {
    const { from, amount, memo, asset, type, recipient } = thorbasedInput;
    window.xfi[chain].request(
      {
        method: recipient ? 'transfer' : 'deposit',
        params: [
          {
            asset,
            from: account,
            recipient: recipient || undefined,
            amount,
            memo,
          },
        ],
      },
      (error: any, result: any) => {
        setResponse(result);
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
                Note: With Thorchain, if you not input recipient address, Submit
                button will call deposit method, otherwise it will call transfer
                method.
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2" rowSpan={4}>
                Asset
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Chain</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                  value={thorbasedInput.asset.chain}
                  onChange={(e) =>
                    setThorbasedInput({
                      ...thorbasedInput,
                      asset: {
                        ...thorbasedInput.asset,
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
                  value={thorbasedInput.asset.symbol}
                  onChange={(e) =>
                    setThorbasedInput({
                      ...thorbasedInput,
                      asset: {
                        ...thorbasedInput.asset,
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
                  value={thorbasedInput.asset.ticker}
                  onChange={(e) =>
                    setThorbasedInput({
                      ...thorbasedInput,
                      asset: {
                        ...thorbasedInput.asset,
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
                  onChange={(e) =>
                    setThorbasedInput({
                      ...thorbasedInput,
                      from: e.target.value,
                    })
                  }
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
                  value={thorbasedInput.recipient}
                  onChange={(e) =>
                    setThorbasedInput({
                      ...thorbasedInput,
                      recipient: e.target.value,
                    })
                  }
                  placeholder="To Address (optional)"
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
                  value={thorbasedInput.amount.amount}
                  onChange={(e) =>
                    setThorbasedInput({
                      ...thorbasedInput,
                      amount: {
                        ...thorbasedInput.amount,
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
                  value={thorbasedInput.amount.decimals}
                  onChange={(e) =>
                    setThorbasedInput({
                      ...thorbasedInput,
                      amount: {
                        ...thorbasedInput.amount,
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
                  value={thorbasedInput.memo}
                  onChange={(e) =>
                    setThorbasedInput({
                      ...thorbasedInput,
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
                  onClick={submitThorBased}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
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

export default ThorChain;
