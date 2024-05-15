import React from 'react';

const BNBChain = ({
  binanceInput,
  setBinanceInput,
  submitBinance,
}: {
  binanceInput: any;
  setBinanceInput: any;
  submitBinance: any;
}) => {
  return (
    <table className="table-auto w-full mt-3">
      <tr>
        <td rowSpan={4} className="border px-4 py-2">
          Asset
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2">Chain</td>
        <td className="border px-4 py-2">
          <input
            type="text"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={binanceInput.asset.chain}
            onChange={(e) =>
              setBinanceInput({
                ...binanceInput,
                asset: {
                  ...binanceInput.asset,
                  chain: e.target.value,
                },
              })
            }
            placeholder="chain"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2">Symbol</td>
        <td className="border px-4 py-2">
          <input
            type="text"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={binanceInput.asset.symbol}
            onChange={(e) =>
              setBinanceInput({
                ...binanceInput,
                asset: {
                  ...binanceInput.asset,
                  symbol: e.target.value,
                },
              })
            }
            placeholder="Symbol"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2">Ticker</td>
        <td className="border px-4 py-2">
          <input
            type="text"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={binanceInput.asset.ticker}
            onChange={(e) =>
              setBinanceInput({
                ...binanceInput,
                asset: {
                  ...binanceInput.asset,
                  ticker: e.target.value,
                },
              })
            }
            placeholder="Ticker"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2" colSpan={2}>
          From Address
        </td>
        <td className="border px-4 py-2">
          <input
            type="text"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={binanceInput.from}
            onChange={(e) =>
              setBinanceInput({
                ...binanceInput,
                from: e.target.value,
              })
            }
            placeholder="From Address"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2" colSpan={2}>
          To Address
        </td>
        <td className="border px-4 py-2">
          <input
            type="text"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={binanceInput.to}
            onChange={(e) =>
              setBinanceInput({
                ...binanceInput,
                to: e.target.value,
              })
            }
            placeholder="To Address"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2" colSpan={2}>
          Amount
        </td>
        <td className="border px-4 py-2">
          <input
            type="number"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={binanceInput.amount.amount}
            onChange={(e) =>
              setBinanceInput({
                ...binanceInput,
                amount: {
                  ...binanceInput.amount,
                  amount: Number(e.target.value),
                },
              })
            }
            placeholder="Amount (smallest unit value)"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2" colSpan={2}>
          Decimals
        </td>
        <td className="border px-4 py-2">
          <input
            type="number"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={binanceInput.amount.decimals}
            onChange={(e) =>
              setBinanceInput({
                ...binanceInput,
                amount: {
                  ...binanceInput.amount,
                  decimals: Number(e.target.value),
                },
              })
            }
            placeholder="Decimals"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2" colSpan={2}>
          Memo (optional)
        </td>
        <td className="border px-4 py-2">
          <input
            type="text"
            className="w-full bg-gray-50 text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none"
            value={binanceInput.memo}
            onChange={(e) =>
              setBinanceInput({
                ...binanceInput,
                memo: e.target.value,
              })
            }
            placeholder="Memo (optional)"
          />
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2 text-center" colSpan={3}>
          <button
            className="bg-[#2770CB] text-white px-2 py-1 rounded"
            onClick={submitBinance}
          >
            Submit
          </button>
        </td>
      </tr>
    </table>
  );
};

export default BNBChain;
