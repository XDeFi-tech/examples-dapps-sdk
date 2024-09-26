import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import chainsSupported from '@/utils/chainsSupported';
import erc20abi from '@/utils/erc20abi.json';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
    xfi: any;
  }
}

const EVMs = ({
  account,
  token,
  currentNetwork,
}: {
  account: string;
  token: string;
  currentNetwork: string;
}) => {
  const [web3contract, setWeb3contract] = useState<any>(null);
  const [web3, setWeb3] = useState<any>(null);
  const [message, setMessage] = useState<any>('hello');
  const [txData, setTxData] = useState<any>({
    from: account,
    gasPrice: '0x4a817c800',
    gas: '0x76c0',
    nonce: '0x42',
    to: account,
    value: '0x8ac7230489e80000',
    data: '0x',
  });
  const [txHash, setTxHash] = useState<string>('');
  const [typedDataV4, setTypedDataV4] = useState<any>({});

  const [accounts, setAccounts] = useState<any>({});
  const [personalSignResp, setPersonalSignResp] = useState<any>('');
  const [signTransactionResp, setSignTransactionResp] = useState<any>('');
  const [transactionByHashResp, setTransactionByHashResp] = useState<any>({});
  const [signDataV4Resp, setSignDataV4Resp] = useState<string>('');

  useEffect(() => {
    const data = chainsSupported.find((c) => c.chain === token);

    setAccounts([]);
    setPersonalSignResp('');
    setTxHash('');
    setSignTransactionResp('');
    setTransactionByHashResp({});
    setSignDataV4Resp('');

    if (data) {
      setTxData({
        from: account,
        gasPrice: '0x4a817c800',
        gas: '0x76c0',
        nonce: '0x42',
        to: account,
        value: '0x8ac7230489e80000',
        data: '0x',
      });

      setTypedDataV4({
        domain: {
          chainId: 1, // mainnet
          name: 'Ether Mail',
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          version: '1',
        },
        message: {
          contents: 'Hello, Bob!',
          from: {
            name: 'Cow',
            wallets: [
              '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
              '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
            ],
          },
          to: [
            {
              name: 'Bob',
              wallets: [
                '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                '0xB0B0b0b0b0b0B000000000000000000000000000',
              ],
            },
          ],
          attachment: '0x',
        },
        primaryType: 'Mail',
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Group: [
            { name: 'name', type: 'string' },
            { name: 'members', type: 'Person[]' },
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person[]' },
            { name: 'contents', type: 'string' },
            { name: 'attachment', type: 'bytes' },
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallets', type: 'address[]' },
          ],
        },
      });

      const initWeb3 = async () => {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          setWeb3(window.web3);
          try {
            await window.ethereum.enable();
            const contract = new window.web3.eth.Contract(
              erc20abi,
              data.contract
            );

            setWeb3contract(contract);
          } catch (error) {
            console.error('Error while enabling ethereum', error);
          }
        } else {
          alert('No window.ethereum detected');
        }
      };

      initWeb3();
    }
  }, [account, token, currentNetwork]);

  const requestAccounts = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: [],
      });
      setAccounts(accounts);
    } catch (error) {
      setAccounts(error);
    }
  };

  const personalSign = async () => {
    try {
      const response = await window.xfi.ethereum.request({
        method: 'personal_sign',
        params: [message, account],
      });
      setPersonalSignResp(response);
    } catch (error) {
      setPersonalSignResp(error);
    }
  };

  const ethSignTransaction = async () => {
    try {
      const response = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txData],
      });
      setSignTransactionResp(response);
    } catch (error) {
      setSignTransactionResp(error);
    }
  };

  const getTransactionByHash = async () => {
    try {
      const response = await window.ethereum.request({
        method: 'eth_getTransactionByHash',
        params: [txHash],
      });
      setTransactionByHashResp(response);
    } catch (error) {
      setTransactionByHashResp(error);
    }
  };

  const signTypedDataV4 = async () => {
    const sign = await window.xfi.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [account, JSON.stringify(typedDataV4)],
    });
    setSignDataV4Resp(sign);
  };

  return (
    <div className="mt-3">
      <div className="overflow-auto">
        <table
          className="table-auto w-full mt-3"
          data-testid="accounts-request-table"
        >
          <thead>
            <tr>
              <th className="border px-4 py-2 text-[18px] text-center font-semibold">
                eth_requestAccounts / eth_accounts
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-center">
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={requestAccounts}
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
          data-testid="personal-sign-request-table"
        >
          <thead>
            <tr>
              <th
                colSpan={3}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                personal_sign
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
                  data-testid="message-input"
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="border px-4 py-2 text-center w-[100px]"
              >
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={personalSign}
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
                  {JSON.stringify(personalSignResp, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="overflow-auto">
        <table
          className="table-auto w-full mt-3"
          data-testid="send-transaction-table"
        >
          <thead>
            <tr>
              <th
                colSpan={3}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                eth_sendTransaction
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 w-[150px]">To Address</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={txData.to}
                  onChange={(e) => setTxData({ ...txData, to: e.target.value })}
                  data-testid="to-address-input"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 w-[150px]">Value</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={txData.value}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      value: e.target.value,
                    })
                  }
                  data-testid="value-input"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 w-[150px]">Gas Price</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={txData.gasPrice}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      gasPrice: e.target.value,
                    })
                  }
                  data-testid="gas-price-input"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 w-[150px]">Gas</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={txData.gas}
                  onChange={(e) =>
                    setTxData({
                      ...txData,
                      gas: e.target.value,
                    })
                  }
                  data-testid="gas-input"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 w-[150px]">Nonce</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={txData.nonce}
                  onChange={(e) =>
                    setTxData({ ...txData, nonce: e.target.value })
                  }
                  data-testid="nonce-input"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 w-[150px]">Data</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={txData.data}
                  onChange={(e) =>
                    setTxData({ ...txData, data: e.target.value })
                  }
                  data-testid="data-input"
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="border px-4 py-2 text-center w-[100px]"
              >
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={ethSignTransaction}
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
                  {JSON.stringify(signTransactionResp, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="overflow-auto">
        <table
          className="table-auto w-full mt-3"
          data-testid="get-transaction-by-hash-table"
        >
          <thead>
            <tr>
              <th
                colSpan={3}
                className="border px-4 py-2 text-[18px] text-center font-semibold"
              >
                eth_getTransactionByHash
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 w-[160px]">Transaction Hash</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  data-testid="transaction-hash-input"
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="border px-4 py-2 text-center w-[100px]"
              >
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={getTransactionByHash}
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
                  {JSON.stringify(transactionByHashResp, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="overflow-auto">
        <table
          className="table-auto w-full mt-3"
          data-testid="eth-sign-typed-data-v4-table"
        >
          <thead>
            <tr>
              <th
                className="border px-4 py-2 text-[18px] text-center font-semibold"
                colSpan={2}
              >
                eth_signTypedData_v4
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 w-[150px]">Data (sample)</td>
              <td className="border px-4 py-2">
                <pre className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded">
                  {JSON.stringify(typedDataV4, null, 2)}
                </pre>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 text-center" colSpan={2}>
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={signTypedDataV4}
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
                className="border my-4 bg-[#F6F6F7] text-[#24292E]"
                colSpan={2}
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
                  {JSON.stringify(signDataV4Resp, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default EVMs;
