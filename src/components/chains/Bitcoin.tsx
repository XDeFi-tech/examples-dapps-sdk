import React, { useState, useEffect } from "react";
import { AddressPurpose, request } from "sats-connect";
import * as btc from "micro-btc-signer";
import { hex, base64 } from "@scure/base";

// Bitcoin mainnet parameters
const bitcoinMainnet = {
  bech32: "bc",
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};

// Blockbook API to fetch unspent outputs
const getUnspentOutputs = async (address: string) => {
  const url = `https://rpc.ankr.com/http/btc_blockbook/api/v2/utxo/${address}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const BitcoinChain = ({ account }: { account: string }) => {
  const [accounts, setAccounts] = useState<any>([]);
  const [addresses, setAddresses] = useState<any>([]);
  const [txData, setTxData] = useState({
    from: "",
    to: "",
    feeRate: 5,
    amount: {
      amount: 1234,
      decimals: 8,
    },
    memo: "memo",
  });

  const [transferResp, setTransferResp] = useState<Object>({});
  const [signPsbtResp, setSignPsbtResp] = useState<Object>({});
  const [psbtData, setPsbtData] = useState({
    psbt: "",
    signInputs: {},
    allowedSignHash: 1,
    broadcast: false,
  });

  // Sign PSBT
  const signPsbt = async () => {
    try {
      const response = await request("signPsbt", {
        psbt: psbtData.psbt,
        signInputs: psbtData.signInputs,
        allowedSignHash: psbtData.allowedSignHash,
        broadcast: psbtData.broadcast,
      });

      if (response.status === "success") {
        setSignPsbtResp(response.result);
      } else {
        console.warn("Error signing PSBT:", response);
        setSignPsbtResp({});
      }
    } catch (err) {
      console.error("Error:", err);
      setSignPsbtResp({});
    }
  };

  // Fetch addresses (sats-connect)
  const getAddresses = async () => {
    try {
      const response: any = await request("getAddresses", {
        purposes: [AddressPurpose.Payment],
      });
      console.log("getAccounts ~ response:", response);
      if (response.status === "success") {
        console.debug({ response });
        setAddresses(response.result);
        // const paymentAddressItem = response.result.find(
        //   (address: any) => address.purpose === AddressPurpose.Payment
        // );
        // const ordinalsAddressItem = response.result.find(
        //   (address: any) => address.purpose === AddressPurpose.Ordinals
        // );
        // const stacksAddressItem = response.result.find(
        //   (address: any) => address.purpose === AddressPurpose.Stacks
        // );
        // console.log("getAccounts ~ paymentAddressItem:", paymentAddressItem);
      } else {
        console.warn("Error fetching addresses:", response);
        setAddresses([]);
      }
    } catch (err) {
      console.error("Error:", err);
      setAddresses([]);
    }
  };

  // Fetch accounts (request_accounts)
  const getAccounts = async () => {
    try {
      await window.xfi.bitcoin.request(
        {
          method: "request_accounts",
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

  // Sign a Bitcoin transaction
  const signTransaction = () => {
    const { from, to, feeRate, amount, memo } = txData;
    window.xfi.bitcoin.request(
      {
        method: "transfer",
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

  // Generate a random PSBT using fetched UTXO and same address for recipient & change
  const generateRandomPsbt = async () => {
    if (!addresses.length) return;

    const addressObj = addresses.find((addr) => addr.purpose === "payment"); // Find the payment address
    if (!addressObj) {
      console.error("No payment address found.");
      return;
    }

    const { address, publicKey } = addressObj; // Use the public key from the response

    try {
      const utxos = await getUnspentOutputs(address); // Fetch UTXOs for this address
      if (!utxos.length) {
        console.warn("No unspent outputs found for address:", address);
        return;
      }

      const tx = new btc.Transaction();

      // Use the first UTXO from the fetched list
      const output = utxos[0];

      // Ensure the value is in satoshis (integer)
      const utxoValue = BigInt(output.value); // This should be in satoshis

      // Define a simple fee (e.g., 10000 satoshis) - adjust this as needed
      const fee = BigInt(10000);

      // Calculate the amount to send (subtracting fee from the UTXO value)
      const recipientAmount = utxoValue - fee;

      if (recipientAmount <= 0) {
        throw new Error("Insufficient UTXO balance to cover fee.");
      }

      // Use the public key from the address response
      const bytesPublicKey = Uint8Array.from(
        Buffer.from(publicKey as string, "hex")
      );
      const p2wpkh = btc.p2wpkh(bytesPublicKey, bitcoinMainnet);
      const p2sh = btc.p2sh(p2wpkh, bitcoinMainnet);

      // Adding input
      tx.addInput({
        txid: output.txid,
        index: output.vout,
        witnessUtxo: {
          script: p2sh.script,
          amount: utxoValue, // Ensure amount is a BigInt
        },
        redeemScript: p2sh.redeemScript,
      });

      // Adding outputs (same address as sender for both recipient and change)
      const recipient = address;
      const changeAddress = address;

      tx.addOutputAddress(recipient, recipientAmount, bitcoinMainnet);
      tx.addOutputAddress(changeAddress, fee, bitcoinMainnet); // Assign the fee as change output

      // Generate PSBT and set the state
      const psbt = tx.toPSBT(0);
      const psbtB64 = base64.encode(psbt);

      setPsbtData({
        psbt: psbtB64,
        signInputs: {
          [output.txid]: [0],
        },
        allowedSignHash: 1,
        broadcast: false,
      });
    } catch (error) {
      console.error("Error generating random PSBT:", error);
      alert("Error generating random PSBT. Check the console for details.");
    }
  };

  useEffect(() => {
    setAccounts([]);
    setTxData({
      from: "",
      to: "",
      feeRate: 5,
      amount: {
        amount: 1234,
        decimals: 8,
      },
      memo: "memo",
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
                <pre className="p-5" data-testid="response-data">
                  {JSON.stringify(accounts, null, 2)}
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="overflow-auto">
        <table
          className="table-auto w-full"
          data-testid="accounts-request-table"
        >
          <thead>
            <tr>
              <th className="border px-4 py-2 text-[18px] text-center font-semibold">
                getAddresses (sats-connect)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-center">
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={getAddresses}
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
                <pre className="p-5" data-testid="response-data">
                  {JSON.stringify(addresses, null, 2)}
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
                <pre className="p-5" data-testid="response-data">
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
              <td className="border px-4 py-2 text-center" colSpan={2}>
                {/* Generate Random PSBT button */}
                {addresses.length > 0 && (
                  <div className="text-center mt-4">
                    <button
                      className="bg-[#05C92F] text-[#001405] px-4 py-2 rounded-full border-[1px] border-[#001405]"
                      onClick={generateRandomPsbt}
                    >
                      Generate Random PSBT
                    </button>
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 w-[150px]">PSBT (Base64)</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={psbtData.psbt}
                  onChange={(e) =>
                    setPsbtData({ ...psbtData, psbt: e.target.value })
                  }
                  placeholder="Enter Base64 PSBT"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Sign Inputs</td>
              <td className="border px-4 py-2">
                <textarea
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={JSON.stringify(psbtData.signInputs, null, 2)}
                  onChange={(e) =>
                    setPsbtData({
                      ...psbtData,
                      signInputs: JSON.parse(e.target.value),
                    })
                  }
                  placeholder='{"1ef9...Jn1r": [0], "bc1p...ra4w": [1, 2]}'
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Allowed Sign Hash</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  value={psbtData.allowedSignHash}
                  onChange={(e) =>
                    setPsbtData({
                      ...psbtData,
                      allowedSignHash: Number(e.target.value),
                    })
                  }
                  placeholder="Enter SigHash type"
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Broadcast</td>
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                  className="bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#05C92F]"
                  checked={psbtData.broadcast}
                  onChange={(e) =>
                    setPsbtData({ ...psbtData, broadcast: e.target.checked })
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 text-center" colSpan={2}>
                <button
                  className="bg-[#05C92F] text-[#001405] px-2 py-1 rounded-full border-[1px] border-[#001405]"
                  onClick={signPsbt}
                >
                  Sign PSBT
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
        </table>{" "}
      </div>
    </div>
  );
};

export default BitcoinChain;
