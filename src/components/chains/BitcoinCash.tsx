import React, { useState, useEffect } from 'react';

const BitcoinCashChain = ({ account }: { account: string }) => {
  const [accounts, setAccounts] = useState<any>([]);
  const [txData, setTxData] = useState({
    from: '',
    to: '',
    feeRate: 5,
    amount: {
      amount: 1234,
      decimals: 8,
    },
    memo: 'memo',
  });

  const [transferResp, setTransferResp] = useState<Object>({});

  const getAccounts = async () => {
    try {
      await window.xfi.bitcoincash.request(
        {
          method: 'request_accounts',
          params: [],
        },
        (error: any, result: any) => {
          if (error) {
            console.warn(error);
            setAccounts([]);
          } else {
            setAccounts(result);
          }
        }
      );
    } catch (error) {
      console.warn(error);
      setAccounts([]);
    }
  };

  const signTransaction = () => {
    const { from, to, feeRate, amount, memo } = txData;
    window.xfi.bitcoincash.request(
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
        setTransferResp({ error, result });
      }
    );
  };

  useEffect(() => {
    setAccounts([]);
    setTxData({
      from: '',
      to: '',
      feeRate: 5,
      amount: {
        amount: 1234,
        decimals: 8,
      },
      memo: 'memo',
    });
  }, [account]);

  return (
    <div className="mt-3">
      <div className="overflow-auto">
        <table
          className="table-auto w-full"
          data-testid="accounts-request-table"
        >
          <thead>
            <tr>
              <th className="border px-4 py-2 text-[18px] text-center font-semibold">
                Accounts request
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-center">
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={getAccounts}
                  data-testid="send-request-button"
                >
                  Send Request
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="border my-4 bg-[#F6F6F7] text-[#24292E]">
                <div className="px-5 border-b border-[#e2e2e3]">
                  <span className="inline-block border-b-2 border-[#05C92F] text-[14px] leading-[48px]">
                    Response
                  </span>
                </div>
                <pre
                  className="p-5"
                  data-testid="response-data"
                >
                  {JSON.stringify(accounts, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="overflow-auto">
        <table
          className="table-auto w-full mt-3"
          data-testid="transfer-request-table"
        >
          <thead>
            <tr>
              <th
                colSpan={2}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                Transfer request
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 w-[150px]">From Address</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-200 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                  value={account}
                  placeholder="From Address"
                  disabled
                  data-testid="from-address-input"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">To Address</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={txData.to}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      to: e.target.value,
                    })
                  }
                  placeholder="To Address"
                  data-testid="to-address-input"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Fee Rate</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={txData.feeRate}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      feeRate: Number(e.target.value),
                    })
                  }
                  placeholder="Fee Rate"
                  data-testid="fee-rate-input"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Amount</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
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
                  data-testid="amount-input"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Decimals</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
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
                  data-testid="decimals-input"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Memo (optional)</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={txData.memo}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      memo: e.target.value,
                    })
                  }
                  placeholder="Memo (optional)"
                  data-testid="memo-input"
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="border px-4 py-2 text-center">
                <button
                  onClick={signTransaction}
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
                  {JSON.stringify(transferResp, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default BitcoinCashChain;
