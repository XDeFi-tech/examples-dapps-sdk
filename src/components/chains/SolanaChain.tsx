import React, { useState, useEffect } from 'react';

const SolanaChain = () => {
  const [account, setAccount] = useState<any>({});

  const [message, setMessage] = useState<string>('');
  const [signMessageResp, setSignMessageResp] = useState<any>({});

  const connectSolana = async () => {
    try {
      const publicKey = await window.xfi.solana.connect();
      setAccount(publicKey);
    } catch (error: any) {
      setAccount(error);
    }
  };

  const submitSignMessage = async () => {
    try {
      const signature = await window.xfi.solana.signMessage(message);
      setSignMessageResp(signature);
    } catch (error: any) {
      setSignMessageResp(error);
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
                  className="bg-slate-800 text-white px-2 py-1 rounded"
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
                  <span className="inline-block border-b-2 border-blue-600 text-[14px] leading-[48px]">
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
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message"
                />
              </td>
              <td className="border px-4 py-2 text-center w-[80px]">
                <button
                  className="bg-slate-800 text-white px-2 py-1 rounded"
                  onClick={submitSignMessage}
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
                  <span className="inline-block border-b-2 border-blue-600 text-[14px] leading-[48px]">
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
      </div>
      <div className="mt-3 text-center">More features coming soon...</div>
    </div>
  );
};

export default SolanaChain;
