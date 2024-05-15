import React from 'react';

const BaseChain = ({
  bitcoinbasedInput,
  setBitcoinbasedInput,
  submitBitcoinBased,
}: {
  bitcoinbasedInput: any;
  setBitcoinbasedInput: any;
  submitBitcoinBased: any;
}) => {
  return (
    <table className="table-auto w-full mt-3">
      <tr>
        <td className="border px-4 py-2 text-center">From Address</td>
        <td className="border px-4 py-2 text-center">
          <input
            type="text"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={bitcoinbasedInput.from}
            onChange={(e) =>
              setBitcoinbasedInput({
                ...bitcoinbasedInput,
                from: e.target.value,
              })
            }
            placeholder="From Address"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2 text-center">To Address</td>
        <td className="border px-4 py-2 text-center">
          <input
            type="text"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={bitcoinbasedInput.to}
            onChange={(e) =>
              setBitcoinbasedInput({
                ...bitcoinbasedInput,
                to: e.target.value,
              })
            }
            placeholder="To Address"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2 text-center">Fee Rate</td>
        <td className="border px-4 py-2 text-center">
          <input
            type="number"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={bitcoinbasedInput.feeRate}
            onChange={(e) =>
              setBitcoinbasedInput({
                ...bitcoinbasedInput,
                feeRate: Number(e.target.value),
              })
            }
            placeholder="Fee Rate"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2 text-center">Amount</td>
        <td className="border px-4 py-2 text-center">
          <input
            type="number"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={bitcoinbasedInput.amount.amount}
            onChange={(e) =>
              setBitcoinbasedInput({
                ...bitcoinbasedInput,
                amount: {
                  ...bitcoinbasedInput.amount,
                  amount: Number(e.target.value),
                },
              })
            }
            placeholder="Amount (smallest unit value)"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2 text-center">Decimals</td>
        <td className="border px-4 py-2 text-center">
          <input
            type="number"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={bitcoinbasedInput.amount.decimals}
            onChange={(e) =>
              setBitcoinbasedInput({
                ...bitcoinbasedInput,
                amount: {
                  ...bitcoinbasedInput.amount,
                  decimals: Number(e.target.value),
                },
              })
            }
            placeholder="Decimals"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2 text-center">Memo (optional)</td>
        <td className="border px-4 py-2 text-center">
          <input
            type="text"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={bitcoinbasedInput.memo}
            onChange={(e) =>
              setBitcoinbasedInput({
                ...bitcoinbasedInput,
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
            onClick={submitBitcoinBased}
            className="bg-[#2770CB] text-white px-2 py-1 rounded"
          >
            Submit
          </button>
        </td>
      </tr>
    </table>
  );
};

export default BaseChain;
