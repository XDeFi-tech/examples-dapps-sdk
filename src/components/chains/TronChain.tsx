import React, { useState, useEffect } from 'react';

const TronChain = () => {
  const [account, setAccount] = useState<any>({});

  const [messageV2, setMessageV2] = useState<string>('Hello, World!');
  const [signMessageResponse, setSignMessageResponse] = useState<any>({});

  const [blockNumber, setBlockNumber] = useState<any>(100);
  const [blockNumberResponse, setBlockNumberResponse] = useState<any>({});

  const connectTron = async () => {
    try {
      const account = await window.xfi.tron.request({
        method: 'eth_requestAccounts',
      });
      setAccount(account[0]);
    } catch (error) {
      setAccount('');
    }
  };

  const submitSignMessageV2 = async () => {
    try {
      const signature = await window.xfi.tron.tronWeb.trx.signMessageV2(
        messageV2
      );

      setSignMessageResponse(signature);
    } catch (error: any) {
      setSignMessageResponse(error);
    }
  };

  const getBlockNumber = async () => {
    try {
      const response = await window.xfi.tron.tronWeb.trx.getBlockByNumber(
        Number(blockNumber)
      );

      setBlockNumberResponse(response);
    } catch (error: any) {
      setBlockNumberResponse(error);
    }
  };

  return (
    <div className="mt-3">
      <div className="mt-3 text-center italic">Tron support is currently not available. It will be available from v30 (end of Q3 2024).</div>
      <table className="table-auto w-full mt-3">
        <thead>
          <tr>
            <th
              colSpan={2}
              className="border px-4 py-2 text-[18px] text-center font-semibold"
            >
              requestAccounts
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2 text-center" colSpan={2}>
              <button
                className="bg-slate-900 text-white px-2 py-1 rounded"
                onClick={connectTron}
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
      <div className="overflow-auto">
        <table className="table-auto w-full mt-3 overflow-aut">
          <thead>
            <tr>
              <th
                colSpan={3}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                signMessageV2
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
                  value={messageV2}
                  onChange={(e) => setMessageV2(e.target.value)}
                  placeholder="Message"
                />
              </td>
              <td className="border px-4 py-2 text-center w-[80px]">
                <button
                  className="bg-slate-900 text-white px-2 py-1 rounded"
                  onClick={submitSignMessageV2}
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
                  {JSON.stringify(signMessageResponse, null, 2)}
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
                getBlockByNumber
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 w-[150px]">blockNumber</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                  value={blockNumber}
                  onChange={(e) => setBlockNumber(e.target.value)}
                  placeholder="Message"
                />
              </td>
              <td className="border px-4 py-2 text-center w-[80px]">
                <button
                  className="bg-slate-900 text-white px-2 py-1 rounded"
                  onClick={getBlockNumber}
                >
                  Get
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
                  {JSON.stringify(blockNumberResponse, null, 2)}
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

export default TronChain;
