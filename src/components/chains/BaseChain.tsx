import React, { useState, useEffect } from 'react';

const BaseChain = ({ account, chain }: { account: string; chain: string }) => {
  const [baseChainInput, setBaseChainInput] = useState({
    from: '',
    to: '',
    feeRate: 5,
    amount: {
      amount: 1234,
      decimals: 8,
    },
    memo: 'memo',
  });

  const [response, setResponse] = useState<Object>({});

  const submitBaseChainInput = () => {
    const { from, to, feeRate, amount, memo } = baseChainInput;
    window.xfi[chain].request(
      {
        method: 'transfer',
        params: [
          {
            from: account,
            recipient: to,
            feeRate,
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

  useEffect(() => {
    setBaseChainInput({
      from: '',
      to: '',
      feeRate: 5,
      amount: {
        amount: 1234,
        decimals: 8,
      },
      memo: 'memo',
    });
  }, [chain]);

  return (
    <div className="mt-3">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th
              colSpan={2}
              className="border px-4 py-2 text-[18px] text-center font-semibold"
            >
              Transfer/Deposit Request
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">From Address</td>
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
            <td className="border px-4 py-2">To Address</td>
            <td className="border px-4 py-2">
              <input
                type="text"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={baseChainInput.to}
                onChange={(e) =>
                  setBaseChainInput({
                    ...baseChainInput,
                    to: e.target.value,
                  })
                }
                placeholder="To Address"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Fee Rate</td>
            <td className="border px-4 py-2">
              <input
                type="number"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={baseChainInput.feeRate}
                onChange={(e) =>
                  setBaseChainInput({
                    ...baseChainInput,
                    feeRate: Number(e.target.value),
                  })
                }
                placeholder="Fee Rate"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Amount</td>
            <td className="border px-4 py-2">
              <input
                type="number"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={baseChainInput.amount.amount}
                onChange={(e) =>
                  setBaseChainInput({
                    ...baseChainInput,
                    amount: {
                      ...baseChainInput.amount,
                      amount: Number(e.target.value),
                    },
                  })
                }
                placeholder="Amount (smallest unit value)"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Decimals</td>
            <td className="border px-4 py-2">
              <input
                type="number"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={baseChainInput.amount.decimals}
                onChange={(e) =>
                  setBaseChainInput({
                    ...baseChainInput,
                    amount: {
                      ...baseChainInput.amount,
                      decimals: Number(e.target.value),
                    },
                  })
                }
                placeholder="Decimals"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Memo (optional)</td>
            <td className="border px-4 py-2">
              <input
                type="text"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={baseChainInput.memo}
                onChange={(e) =>
                  setBaseChainInput({
                    ...baseChainInput,
                    memo: e.target.value,
                  })
                }
                placeholder="Memo (optional)"
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="border px-4 py-2 text-center">
              <button
                onClick={submitBaseChainInput}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Submit
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="border my-4 bg-[#F6F6F7] text-[#24292E]">
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
      <div className="mt-3 text-center">More features coming soon...</div>
    </div>
  );
};

export default BaseChain;
