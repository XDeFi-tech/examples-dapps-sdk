import React, { useState, useEffect } from 'react';

const SolanaChain = () => {
  const [account, setAccount] = useState<any>({});

  const [message, setMessage] = useState<string>('hello');
  const [signMessageResp, setSignMessageResp] = useState<any>({});
  const [txData, setTxData] = useState<any>({
    // sample tx data
  });

  const [signTxResp, setSignTxResp] = useState<any>({});

  const connectSolana = async () => {
    try {
      const response = await window.xfi.solana.connect();
      setAccount(response);
    } catch (error: any) {
      setAccount(error);
    }
  };

  const signMessage = async () => {
    try {
      const signature = await window.xfi.solana.signMessage(
        Buffer.from(message)
      );
      setSignMessageResp(signature);
    } catch (error: any) {
      setSignMessageResp(error);
    }
  };

  // TODO: Implement signTransaction
  const signTransaction = async () => {
    try {
      const signature = await window.xfi.solana.signTransaction(txData);
      setSignTxResp(signature);
    } catch (error: any) {
      setSignTxResp(error);
    }
  };

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
                connect/getPublicKey
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-center" colSpan={2}>
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={connectSolana}
                >
                  Submit
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
                <pre className="p-5">{JSON.stringify(account, null, 2)}</pre>
              </td>
            </tr>
          </tfoot>
        </table>
        <table className="table-auto w-full mt-3">
          <thead>
            <tr>
              <th
                colSpan={3}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                signMessage
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 w-[150px]">Message</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message"
                />
              </td>
              <td className="border px-4 py-2 text-center w-[80px]">
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={signMessage}
                >
                  Sign
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
                  {JSON.stringify(signMessageResp, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
        <table className="table-auto w-full mt-3">
          <thead>
            <tr>
              <th
                colSpan={3}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                signTransaction
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 w-[160px]">tx Data (sample)</td>
              <td className="border px-4 py-2">
                <pre className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded">
                  {JSON.stringify(txData, null, 2)}
                </pre>
              </td>
              <td className="border px-4 py-2 text-center w-[80px]">
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={signTransaction}
                >
                  Sign
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
                <pre className="p-5">{JSON.stringify(signTxResp, null, 2)}</pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-3 text-center">More features coming soon...</div>
    </div>
  );
};

export default SolanaChain;
