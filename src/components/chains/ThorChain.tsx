import React, { useState, useEffect } from 'react';

const ThorChain = ({ account, chain }: { account: string; chain: string }) => {
  const [accounts, setAccounts] = useState<any>([]);
  const [txData, setTxData] = useState({
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

  const [transferResp, setTransferResp] = useState<Object>({});

  const getAccounts = async () => {
    try {
      await window.xfi[chain].request(
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

  const requestTransfer = () => {
    const { from, amount, memo, asset, type, recipient } = txData;
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
        setTransferResp(result);
      }
    );
  };

  useEffect(() => {
    setAccounts([]);
    if (chain === 'mayachain') {
      setTxData({
        ...txData,
        asset: {
          chain: 'MAYA',
          symbol: 'MAYA',
          ticker: 'MAYA',
        },
      });
    } else {
      setTxData({
        ...txData,
        asset: {
          chain: 'THOR',
          symbol: 'RUNE',
          ticker: 'RUNE',
        },
      });
    }
  }, [account, chain]);

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
          data-testid="transfer-deposit-request-table"
        >
          <thead>
            <tr>
              <th
                colSpan={3}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                Transfer/Deposit request
              </th>
            </tr>
            <tr>
              <td colSpan={3} className="border px-4 py-2 italic">
                Note: With Thorchain, if you not input recipient address, Send
                Request button will call deposit method, otherwise it will call
                transfer method.
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
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
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
                  data-testid="chain-input"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Symbol</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
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
                  data-testid="symbol-input"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Ticker</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
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
                  data-testid="ticker-input"
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
                    setTxData({
                      ...txData,
                      from: e.target.value,
                    })
                  }
                  placeholder="From Address"
                  disabled
                  data-testid="from-address-input"
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
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={txData.recipient}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      recipient: e.target.value,
                    })
                  }
                  placeholder="To Address (optional)"
                  data-testid="to-address-input"
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
              <td className="border px-4 py-2" colSpan={2}>
                Decimals
              </td>
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
              <td className="border px-4 py-2" colSpan={2}>
                Memo (optional)
              </td>
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
              <td className="border px-4 py-2 text-center" colSpan={3}>
                <button
                  onClick={requestTransfer}
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
                colSpan={3}
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

export default ThorChain;
