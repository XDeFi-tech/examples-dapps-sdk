import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import chainsSupported from '@/utils/chainsSupported';
import erc20abi from '@/utils/erc20abi.json';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

const EVMChain = ({ account, token }: { account: string; token: string }) => {
  const [web3contract, setWeb3contract] = useState<any>(null);
  const [web3, setWeb3] = useState<any>(null);
  const [chainId, setChainId] = useState<any>(null);
  const [erc20Input, setErc20Input] = useState<any>({
    contract: undefined,
    fromAddress: account,
    recipientAddress: undefined,
    amount: undefined,
    decimals: undefined,
  });
  const [tokenData, setTokenData] = useState<any>({});

  const [erc20SendResp, setErc20SendResp] = useState<Object>({});

  const [personalSign, setPersonalSign] = useState<string>('hello');
  const [personalSignResp, setPersonalSignResp] = useState<any>({});

  const [ethSign, setEthSign] = useState<string>('helloethsign');
  const [ethSignResp, setEthSignResp] = useState<any>({});

  const [ethBalance, setEthBalance] = useState<any>(null);
  const [ethSignTransactionResp, setEthSignTransactionResp] = useState<any>({});

  const [signTxInfo, setSignTxInfo] = useState<any>({
    from: account,
    gasPrice: '200000',
    gas: '2100',
    nonce: '0x42',
    to: '0x3535353535353535353535353535353535353535',
    value: '1000',
    data: '0xdeadbeef',
  });

  useEffect(() => {
    const data = chainsSupported.find((c) => c.chain === token);
    setTokenData(data);
    if (data) {
      setErc20Input({
        contract: data.contract,
        fromAddress: account,
        recipientAddress: undefined,
        amount: undefined,
        decimals: undefined,
      });

      const initWeb3 = async () => {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          setWeb3(window.web3);
          try {
            await window.ethereum.enable();
            const chainId = await window.web3.eth.getChainId();
            setChainId(chainId);
            const contract = new window.web3.eth.Contract(
              erc20abi,
              data.contract
            );

            setWeb3contract(contract);
            const decimals = await contract.methods.decimals().call();
            setErc20Input({
              ...erc20Input,
              decimals: new BigNumber(decimals || 0).toNumber(),
            });
            window.ethereum.on('chainChanged', handleChainId);
          } catch (error) {
            console.error('Error while enabling ethereum', error);
          }
        } else {
          alert('No window.ethereum detected');
        }
      };

      initWeb3();

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('chainChanged', handleChainId);
        }
      };
    }
  }, [account, token]);

  const handleChainId = (id: string) => {
    setChainId(id);
  };

  const sendHandler = async () => {
    if (!web3contract) {
      return alert('web3contract not initialized');
    }

    const amountBN = new BigNumber(10).pow(erc20Input.decimals || 0);
    const total = new BigNumber(erc20Input.amount || 0)
      .mul(amountBN)
      .toString();

    try {
      const response = await web3contract.methods
        .transfer(erc20Input.recipientAddress, total)
        .send({
          from: account,
        });
      setErc20SendResp(response);
      alert('Success! ' + JSON.stringify(response));
    } catch (error: any) {
      console.error('Failed to send', error);
      setErc20SendResp(error);
    }
  };

  const personalSignHandler = async () => {
    try {
      const response = await web3.eth.personal.sign(personalSign, account);
      setPersonalSignResp(response);
    } catch (error) {
      setPersonalSignResp(error);
    }
  };

  const ethSignHandler = async () => {
    try {
      const response = await web3.eth.sign(ethSign, account);
      setEthSignResp(response);
    } catch (error) {
      setEthSignResp(error);
    }
  };

  const ethSignTransactionHandler = async () => {
    try {
      const response = await web3.eth.signTransaction(signTxInfo);
      setEthSignTransactionResp(response);
    } catch (error) {
      setEthSignTransactionResp(error);
    }
  };

  const ethBalanceHandler = async () => {
    const balance = await web3.eth.getBalance(account);
    setEthBalance(new BigNumber(balance || 0).toString());
  };

  return (
    <div className="mt-3">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th
              colSpan={2}
              className="border px-4 py-2 text-[18px] text-center font-semibold"
            >
              Send ERC20 Request
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Token Address (Contract)</td>
            <td className="border px-4 py-2">
              <input
                type="text"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={tokenData.contract}
                disabled
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2 w-[220px]">From Address</td>
            <td className="border px-4 py-2">
              <input
                type="text"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={account}
                onChange={(e) => {}}
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
                value={erc20Input.recipientAddress}
                onChange={(e) =>
                  setErc20Input({
                    ...erc20Input,
                    recipientAddress: e.target.value,
                  })
                }
                placeholder="To Address"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Amount</td>
            <td className="border px-4 py-2">
              <input
                type="number"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={erc20Input.amount}
                onChange={(e) =>
                  setErc20Input({
                    ...erc20Input,
                    amount: e.target.value,
                  })
                }
                placeholder="Amount"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Decimals</td>
            <td className="border px-4 py-2">
              <input
                type="number"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={erc20Input.decimals}
                onChange={(e) =>
                  setErc20Input({
                    ...erc20Input,
                    decimals: e.target.value,
                  })
                }
                placeholder="Decimals"
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="border px-4 py-2 text-center">
              <button
                onClick={sendHandler}
                className="bg-[#2770CB] text-white px-2 py-1 rounded"
              >
                Send
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="border my-4 bg-[#F6F6F7] text-[#24292E]">
              <div className="px-5 border-b border-[#e2e2e3]">
                <span className="inline-block border-b-2 border-[#3451b2] dark:border-[#a8b1ff] text-[14px] leading-[48px]">
                  Response
                </span>
              </div>
              <pre className="p-5">
                {JSON.stringify(erc20SendResp, null, 2)}
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
              personal_sign Request
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
                value={personalSign}
                onChange={(e) => setPersonalSign(e.target.value)}
              />
            </td>
            <td className="border px-4 py-2 text-center w-[100px]">
              <button
                className="bg-[#2770CB] text-white px-2 py-1 rounded"
                onClick={personalSignHandler}
              >
                Sign
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="border my-4 bg-[#F6F6F7] text-[#24292E]">
              <div className="px-5 border-b border-[#e2e2e3]">
                <span className="inline-block border-b-2 border-[#3451b2] dark:border-[#a8b1ff] text-[14px] leading-[48px]">
                  Response
                </span>
              </div>
              <pre className="p-5">
                {JSON.stringify(personalSignResp, null, 2)}
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
              eth_sign Request
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2 w-[180px]">Message</td>
            <td className="border px-4 py-2">
              <input
                type="text"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={ethSign}
                onChange={(e) => setEthSign(e.target.value)}
              />
            </td>
            <td className="border px-4 py-2 text-center w-[100px]">
              <button
                className="bg-[#2770CB] text-white px-2 py-1 rounded"
                onClick={ethSignHandler}
              >
                Sign
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="border my-4 bg-[#F6F6F7] text-[#24292E]">
              <div className="px-5 border-b border-[#e2e2e3]">
                <span className="inline-block border-b-2 border-[#3451b2] dark:border-[#a8b1ff] text-[14px] leading-[48px]">
                  Response
                </span>
              </div>
              <pre className="p-5">{JSON.stringify(ethSignResp, null, 2)}</pre>
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
              eth_signTransaction Request
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2 w-[150px]">From Address</td>
            <td className="border px-4 py-2">
              <input
                type="text"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={account}
                disabled
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2 w-[150px]">To Address</td>
            <td className="border px-4 py-2">
              <input
                type="text"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={signTxInfo.to}
                onChange={(e) =>
                  setSignTxInfo({ ...signTxInfo, to: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2 w-[150px]">Amount</td>
            <td className="border px-4 py-2">
              <input
                type="number"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={signTxInfo.value}
                onChange={(e) =>
                  setSignTxInfo({
                    ...signTxInfo,
                    value: e.target.value,
                  })
                }
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2 w-[150px]">Gas Price</td>
            <td className="border px-4 py-2">
              <input
                type="number"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={signTxInfo.gasPrice}
                onChange={(e) =>
                  setSignTxInfo({
                    ...signTxInfo,
                    gasPrice: e.target.value,
                  })
                }
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2 w-[150px]">Gas</td>
            <td className="border px-4 py-2">
              <input
                type="number"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={signTxInfo.gas}
                onChange={(e) =>
                  setSignTxInfo({
                    ...signTxInfo,
                    gas: e.target.value,
                  })
                }
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2 w-[150px]">Nonce</td>
            <td className="border px-4 py-2">
              <input
                type="text"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={signTxInfo.nonce}
                onChange={(e) =>
                  setSignTxInfo({ ...signTxInfo, nonce: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2 w-[150px]">Data</td>
            <td className="border px-4 py-2">
              <input
                type="text"
                className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
                value={signTxInfo.data}
                onChange={(e) =>
                  setSignTxInfo({ ...signTxInfo, data: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="border px-4 py-2 text-center w-[100px]">
              <button
                className="bg-[#2770CB] text-white px-2 py-1 rounded"
                onClick={ethSignTransactionHandler}
              >
                Sign
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="border my-4 bg-[#F6F6F7] text-[#24292E]">
              <div className="px-5 border-b border-[#e2e2e3]">
                <span className="inline-block border-b-2 border-[#3451b2] dark:border-[#a8b1ff] text-[14px] leading-[48px]">
                  Response
                </span>
              </div>
              <pre className="p-5">
                {JSON.stringify(ethSignTransactionResp, null, 2)}
              </pre>
            </td>
          </tr>
        </tfoot>
      </table>
      <table className="table-auto w-full mt-3">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-[18px] text-center font-semibold">
              eth_getBalance Request
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2 text-center">
              <button
                className="bg-[#2770CB] text-white px-2 py-1 rounded"
                onClick={ethBalanceHandler}
              >
                Get Balance
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="border my-4 bg-[#F6F6F7] text-[#24292E]">
              <div className="px-5 border-b border-[#e2e2e3]">
                <span className="inline-block border-b-2 border-[#3451b2] dark:border-[#a8b1ff] text-[14px] leading-[48px]">
                  Response
                </span>
              </div>
              <pre className="p-5">{ethBalance}</pre>
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="mt-3 text-center">More features coming soon...</div>
    </div>
  );
};

export default EVMChain;
