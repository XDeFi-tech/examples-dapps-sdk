import React, { useState, useEffect } from 'react';

const BitcoinChain = ({ account }: { account: string }) => {
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
  const [psbtData, setPsbtData] = useState({
    psbt: '', // string base64
    signInputs: [], // array of sign inputs
    allowedSignHash: 0, // a number representing the sigHash type to use for signing. will default to the sighash type of the input if not provided.
    broadcast: false, // a boolean flag that specifies whether to broadcast the signed transaction after signature
  });

  const [transferResp, setTransferResp] = useState<Object>({});
  const [signPsbtResp, setSignPsbtResp] = useState<Object>({});

  const getAccounts = async () => {
    try {
      await window.xfi.bitcoin.request(
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
    window.xfi.bitcoin.request(
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

  const signPsbt = () => {
    // TODO: Implement signPsbt
    alert('Not implemented yet, coming soon!');
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
        <table className="table-auto w-full">
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
                <pre className="p-5">{JSON.stringify(accounts, null, 2)}</pre>
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
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="border px-4 py-2 text-center">
                <button
                  onClick={signTransaction}
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
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
                <pre className="p-5">
                  {JSON.stringify(transferResp, null, 2)}
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
                colSpan={3}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                signPsbt
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 w-[150px]">Data</td>
              <td className="border px-4 py-2 text-center">Coming soon...</td>
              <td className="border px-4 py-2 text-center w-[160px]">
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={signPsbt}
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
                <pre className="p-5">
                  {JSON.stringify(signPsbtResp, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default BitcoinChain;
