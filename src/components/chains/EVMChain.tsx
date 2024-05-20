import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

import erc20abi from '@/utils/erc20abi.json';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

const EVMChain = ({ account, chain }: { account: string; chain: string }) => {
  const [erc20Input, setErc20Input] = useState({});
  const [response, setResponse] = useState<Object>({});

  const [web3, setWeb3] = useState<any>(null);
  const [web3Accounts, setWeb3Accounts] = useState<any>([]);
  const [erc20address] = useState<string>(
    '0xad6d458402f60fd3bd25163575031acdce07538d'
  );
  const [recipientAddress, setRecipientAddress] = useState<string>(
    '0x26E7Ef2D05793c6D47c678f1F4B246856236F089'
  );
  const [erc20amount, setErc20Amount] = useState<number>(3);
  const [decimals, setDecimals] = useState<any>(8);
  const [chainId, setChainId] = useState<any>(null);
  const [personalSign, setPersonalSign] = useState<string>('hello');
  const [personalSignResp, setPersonalSignResp] = useState<any>(null);
  const [personalSignErr, setPersonalSignErr] = useState<any>(null);
  const [ethSign, setEthSign] = useState<string>('helloethsign');
  const [ethSignResp, setEthSignResp] = useState<any>(null);
  const [ethSignErr, setEthSignErr] = useState<any>(null);
  const [ethBalance, setEthBalance] = useState<any>(null);
  const [ethSignTransactionResp, setEthSignTransactionResp] =
    useState<any>(null);
  const [ethSignTransactionErr, setEthSignTransactionErr] = useState<any>(null);
  const [signTxInfo, setSignTxInfo] = useState<any>(null);
  const [resp, setResp] = useState<any>(null);
  const [err, setErr] = useState<any>(null);
  const [web3contract, setWeb3contract] = useState<any>(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        setWeb3(window.web3);
        try {
          await window.ethereum.enable();
          const accounts = await window.web3.eth.getAccounts();
          setWeb3Accounts(accounts);

          const chainId = await window.web3.eth.getChainId();
          setChainId(chainId);

          window.ethereum.on('chainChanged', handleChainId);

          const contract = new window.web3.eth.Contract(erc20abi, erc20address);
          setWeb3contract(contract);

          const decimals = await contract.methods.decimals().call();
          setDecimals(decimals);
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
  }, []);

  const handleChainId = (id: string) => {
    setChainId(id);
  };

  const sendHandler = async () => {
    if (!web3contract) {
      return alert('web3contract not initialized');
    }

    const amountBN = web3.utils.toBN(10).pow(web3.utils.toBN(decimals));
    const total = web3.utils.toBN(erc20amount).mul(amountBN);

    try {
      const response = await web3contract.methods
        .transfer(recipientAddress, total)
        .send({
          from: web3Accounts[0],
        });
      setResp(response);
      alert('Success! ' + JSON.stringify(response));
    } catch (error: any) {
      console.error('Failed to send', error);
      setErr(error);
      alert('Failed: ' + error);
    }
  };

  const personalSignHandler = async () => {
    try {
      const response = await web3.eth.personal.sign(
        personalSign,
        web3Accounts[0]
      );
      setPersonalSignResp(response);
    } catch (error) {
      console.error(error);
      setPersonalSignErr(error);
    }
  };

  const ethSignHandler = async () => {
    try {
      const response = await web3.eth.sign(ethSign, web3Accounts[0]);
      console.log(response);
      setEthSignResp(response);
    } catch (error) {
      console.error(error);
      setEthSignErr(error);
    }
  };

  const ethBalanceHandler = async () => {
    const balance = await web3.eth.getBalance(web3Accounts[0]);
    setEthBalance(balance);
  };

  const ethSignTransactionHandler = async () => {
    const txInfo = {
      from: web3Accounts[0],
      gasPrice: '20000000000',
      gas: '21000',
      nonce: '0x42',
      to: '0x3535353535353535353535353535353535353535',
      value: '1000000000000000000',
      data: '0xdeadbeef',
    };
    setSignTxInfo(txInfo);

    try {
      const response = await web3.eth.signTransaction(txInfo);
      setEthSignTransactionResp(response);
    } catch (error) {
      console.error(error);
      setEthSignTransactionErr(error);
    }
  };

  return (
    <div className="mt-3">
      <div>
        <h2>Send erc20 form</h2>
        <div>
          Token address (Contract): <br />
          <input
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={erc20address}
            placeholder="erc20 address"
          />
        </div>
        <div>
          Decimals: <br />
          <input
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            type="number"
            disabled
            value={decimals}
          />
        </div>
        <div>
          Recipient address: <br />
          <input
            value={recipientAddress}
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="recipient address"
          />
        </div>
        <div>
          Amount: <br />
          <input
            type="number"
            value={erc20amount}
            onChange={(e) => setErc20Amount(Number(e.target.value))}
            placeholder="amount"
          />
        </div>
        <button type="submit" onClick={sendHandler}>
          Send
        </button>
        <br />
        <div>Resp: {JSON.stringify(resp)}</div>
        <div>Err: {JSON.stringify(err)}</div>
      </div>
      <div>
        <h2>personal_sign</h2>
        <input
          value={personalSign}
          onChange={(e) => setPersonalSign(e.target.value)}
        />
        <br />
        <button
          className="bg-[#2770CB] text-white px-2 py-1 rounded"
          onClick={personalSignHandler}
        >
          Personal Sign
        </button>
        <br />
        {personalSignResp}
        {personalSignErr}
      </div>
      <div>
        <h2>eth_sign</h2>
        <input
          className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
          value={ethSign}
          onChange={(e) => setEthSign(e.target.value)}
        />
        <br />
        <button
          className="bg-[#2770CB] text-white px-2 py-1 rounded"
          onClick={ethSignHandler}
        >
          eth Sign
        </button>
        <br />
        {ethSignResp}
        {ethSignErr}
      </div>
      <div>
        <h2>eth_signTransaction</h2>
        <pre>{JSON.stringify(signTxInfo, null, 2)}</pre>
        <button
          className="bg-[#2770CB] text-white px-2 py-1 rounded"
          onClick={ethSignTransactionHandler}
        >
          eth Sign Transaction
        </button>
        <br />
        {ethSignTransactionResp}
        {ethSignTransactionErr}
      </div>
      <div>
        <h2>eth_getBalance</h2>
        <button onClick={ethBalanceHandler}>eth Get Balance</button>
        <br />
        {ethBalance ? `Balance: ${ethBalance}` : ''}
      </div>
      <div>
        <h2>eth_chainId</h2>
        <br />
        ChainId: {chainId}
      </div>
    </div>
  );
};

export default EVMChain;
