import React, { useState, useEffect, use } from 'react';
import {
  clusterApiUrl,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import bs58 from 'bs58';

const SolanaChain = () => {
  const [account, setAccount] = useState<any>({});

  const [message, setMessage] = useState<string>('hello');
  const [signMessageResp, setSignMessageResp] = useState<any>('');
  const [txData, setTxData] = useState<any>('');

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
      setSignMessageResp(bs58.encode(signature.signature));
    } catch (error: any) {
      setSignMessageResp(error);
    }
  };

  const getLatestBlockhash = async () => {
    const response = await fetch('https://api.devnet.solana.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getRecentBlockhash',
        params: [
          {
            commitment: 'processed',
          },
        ],
      }),
    });

    const data = await response.json();
    const lastestBlockhash = data.result.value.blockhash;
    return lastestBlockhash;
  };

  const createTransferInstruction = async () => {
    const fromPubKey = new PublicKey(account.publicKey);
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromPubKey,
        /** Account that will receive transferred lamports */
        toPubkey: new PublicKey(account.publicKey),
        /** Amount of lamports to transfer */
        lamports: 100000000, // 1 SOL
      })
    );
    const blockHash = await getLatestBlockhash();
    tx.feePayer = fromPubKey;
    tx.recentBlockhash = blockHash;
    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: true,
    });
    const transactionBase64 = serializedTransaction.toString('base64');
    setTxData(transactionBase64);
  };

  function getRawTransaction(
    encodedTransaction: string
  ): Transaction | VersionedTransaction {
    let recoveredTransaction: Transaction | VersionedTransaction;
    try {
      recoveredTransaction = Transaction.from(
        Buffer.from(encodedTransaction, 'base64')
      );
    } catch (error) {
      recoveredTransaction = VersionedTransaction.deserialize(
        Buffer.from(encodedTransaction, 'base64')
      );
    }
    return recoveredTransaction;
  }

  // TODO: Implement this function
  const signTransaction = async () => {
    if (!account.publicKey) {
      alert('Connect to wallet first');
      return;
    }
    await createTransferInstruction();

    const feePayer = Keypair.fromSecretKey(account.fromPubKey);
    const recoveredTransaction = getRawTransaction(txData);
    if (recoveredTransaction instanceof VersionedTransaction) {
      recoveredTransaction.sign([feePayer]);
    } else {
      recoveredTransaction.partialSign(feePayer);
    }
    const txnSignature = await window.xfi.solana.signTransaction(
      recoveredTransaction.serialize()
    );

    setSignTxResp(bs58.encode(txnSignature.signature));
  };

  const signAndSendTransaction = async () => {
    // TODO: Implement this function
  };

  const signAllTransactions = async () => {
    // TODO: Implement this function
  };

  useEffect(() => {
    setSignMessageResp('');
  }, []);

  return (
    <div className="mt-3">
      <div className="overflow-auto">
        <table
          className="table-auto w-full"
          data-testid="connect-get-public-key-table"
        >
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
                  {JSON.stringify(account, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
        <table
          className="table-auto w-full mt-3"
          data-testid="sign-message-table"
        >
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
                  data-testid="message-input"
                />
              </td>
              <td className="border px-4 py-2 text-center w-[160px]">
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={signMessage}
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
                  {JSON.stringify(signMessageResp, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
        <table
          className="table-auto w-full mt-3"
          data-testid="sign-transaction-table"
        >
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
              <td className="border px-4 py-2 w-[170px]">tx Data (sample)</td>
              <td className="border px-4 py-2">
                <pre className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded">
                  {JSON.stringify(txData, null, 2)}
                </pre>
              </td>
              <td className="border px-4 py-2 text-center w-[160px]">
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={signTransaction}
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
                  {JSON.stringify(signTxResp, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SolanaChain;
