<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->

    <div>
      XDEFI Injected Chains Providers:
    </div>
    <br />
    <div>window.xfi {{ xfiObject ? "detected" : "not detected" }}</div>

    <div v-if="xfiObject">
      <br />
      <br />
      <h1>Chains / Accounts</h1>

      <div>
        Network selected:
        <br />
        {{ currentNetwork }}
      </div>
      <div>
        window.ethereum:
        {{ ethereum ? "detected" : "not detected" }}
      </div>
      <div>
        window.xfi.binance:
        {{ xfiObject.binance ? "detected" : "not detected" }}
        <div>
          <button @click="request(xfiObject.binance, 'request_accounts', [])">
            Retrieve Accounts
          </button>
        </div>
      </div>
      <div>
        window.xfi.bitcoin:
        {{ xfiObject.bitcoin ? "detected" : "not detected" }}
        <div>
          <button @click="request(xfiObject.bitcoin, 'request_accounts', [])">
            Retrieve Accounts
          </button>
        </div>
      </div>
      <div>
        window.xfi.bitcoincash:
        {{ xfiObject.bitcoincash ? "detected" : "not detected" }}
        <div>
          <button
            @click="request(xfiObject.bitcoincash, 'request_accounts', [])"
          >
            Retrieve Accounts
          </button>
        </div>
      </div>
      <div>
        window.xfi.litecoin:
        {{ xfiObject.litecoin ? "detected" : "not detected" }}
        <div>
          <button @click="request(xfiObject.litecoin, 'request_accounts', [])">
            Retrieve Accounts
          </button>
        </div>
      </div>
      <div>
        window.xfi.thorchain:
        {{ xfiObject.thorchain ? "detected" : "not detected" }}
        <div>
          <button @click="request(xfiObject.thorchain, 'request_accounts', [])">
            Retrieve Accounts
          </button>
        </div>
      </div>

      <div>
        <h1>Transfer/Deposit</h1>

        <div>
          Chain / Network:
          <br />
          <select v-model="selectedChain">
            <!-- inline object literal -->
            <option v-bind:value="undefined"></option>
            <option v-bind:value="{ chain: 'binance' }">binanceDex</option>
            <option v-bind:value="{ chain: 'bitcoin' }">bitcoin</option>
            <option v-bind:value="{ chain: 'litecoin' }">litecoin</option>
            <option v-bind:value="{ chain: 'bitcoincash' }">bitcoincash</option>
            <option v-bind:value="{ chain: 'thorchain' }">thorchain</option>
          </select>

          <br />
          Selected chain: {{ selectedChain }}
          <br />
          <br />
          <div
            v-if="['binance'].includes(selectedChain && selectedChain.chain)"
          >
            <h3>Asset:</h3>
            <br />
            Chain
            <input
              type="text"
              v-model="binanceInput.asset.chain"
              placeholder="chain"
            />
            <br />
            Symbol:

            <input
              type="text"
              v-model="binanceInput.asset.symbol"
              placeholder="Symbol"
            />
            <br />
            Ticker:

            <input
              type="text"
              v-model="binanceInput.asset.ticker"
              placeholder="Ticker"
            />
            <br />
            <br />
            From Address:
            <input
              type="text"
              v-model="binanceInput.from"
              placeholder="From Address"
            />
            <br />
            Target address:
            <input
              type="text"
              v-model="binanceInput.to"
              placeholder="To Address"
            />
            <br />
            Amount:
            <input
              v-model="binanceInput.amount.amount"
              type="number"
              placeholder="Amount (smallest unit value)"
            />
            <br />
            Decimals:
            <input
              v-model="binanceInput.amount.decimals"
              type="number"
              placeholder="Decimals"
            />
            <br />
            Memo(optional):
            <input
              v-model="binanceInput.memo"
              type="text"
              placeholder="Memo (optional)"
            />
            <br />
            <button @click="submitBinance">Submit</button>
          </div>
          <div
            v-if="
              ['bitcoin', 'litecoin', 'bitcoincash'].includes(
                selectedChain && selectedChain.chain
              )
            "
          >
            <br />
            From Address:
            <input
              type="text"
              v-model="bitcoinbasedInput.from"
              placeholder="From Address"
            />
            <br />
            Target address:
            <input
              type="text"
              v-model="bitcoinbasedInput.to"
              placeholder="To Address"
            />
            <br />
            Fee Rate:
            <input
              v-model="bitcoinbasedInput.feeRate"
              type="number"
              placeholder="Fee Rate"
            />
            <br />
            Amount:
            <input
              v-model="bitcoinbasedInput.amount.amount"
              type="number"
              placeholder="Amount (smallest unit value)"
            />
            <br />
            Decimals:
            <input
              v-model="bitcoinbasedInput.amount.decimals"
              type="number"
              placeholder="Decimals"
            />
            <br />
            Memo(optional):
            <input
              v-model="bitcoinbasedInput.memo"
              type="text"
              placeholder="Memo (optional)"
            />
            <br />
            <button @click="submitBitcoinBased">Submit</button>
          </div>
          <div
            v-if="['thorchain'].includes(selectedChain && selectedChain.chain)"
          >
            <select v-model="thorbasedInput.type">
              <!-- inline object literal -->
              <option v-bind:value="'deposit'">deposit</option>
              <option v-bind:value="'transfer'">transfer</option>
            </select>
            {{ thorbasedInput }}
            <h3>Asset:</h3>
            <br />
            Chain
            <input
              type="text"
              v-model="thorbasedInput.asset.chain"
              placeholder="chain"
            />
            <br />
            Symbol:

            <input
              type="text"
              v-model="thorbasedInput.asset.symbol"
              placeholder="Symbol"
            />
            <br />
            Ticker:

            <input
              type="text"
              v-model="thorbasedInput.asset.ticker"
              placeholder="Ticker"
            />
            <br />
            <br />
            From Address:

            <input
              type="text"
              v-model="thorbasedInput.from"
              placeholder="From Address"
            />
            <br />
            <div v-if="thorbasedInput.type === 'transfer'">
              To Address:

              <input
                type="text"
                v-model="thorbasedInput.recipient"
                placeholder="To Address"
              />

              <br /><br />
            </div>
            <br />
            Amount:
            <input
              v-model="thorbasedInput.amount.amount"
              type="number"
              placeholder="Amount (smallest unit value)"
            /><br />
            Decimals:

            <input
              v-model="thorbasedInput.amount.decimals"
              type="number"
              placeholder="Decimals"
            />
            <br />
            Memo:

            <input
              v-model="thorbasedInput.memo"
              type="text"
              placeholder="Memo"
            />
            <br />
            <button @click="submitThorBased">Submit</button>
          </div>
        </div>
      </div>

      <br /><br />
      <div v-if="lastResult">
        <b>Last Result:</b>
        <br />
        {{ lastResult }}
        <br />
      </div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: "App",
  components: {
    // HelloWorld
  },
  mounted() {
    document.onreadystatechange = () => {
      if (document.readyState == "complete") {
        if ("xfi" in window) {
          console.log(window.xfi);
          this.ethereum = window.ethereum;
          this.xfiObject = window.xfi;

          try {
            this.currentNetwork = window.xfi.bitcoin.network;
          } catch (e) {
            console.error(e);
          }

          const objects = [
            "bitcoin",
            "bitcoincash",
            "binance",
            "litecoin",
            "thorchain",
            "binance",
          ];
          objects.forEach((chainId) => {
            if (window.xfi && window.xfi[chainId]) {
              const provider = window.xfi[chainId];
              provider.on("chainChanged", (obj) => {
                console.log(`chainChanged::${chainId}`, obj);
                this.currentNetwork = obj.network || obj._network;
              });
              provider.on("accountsChanged", (obj) => {
                console.log(`accountsChanged::${chainId}`, obj);
              });
            }
          });
        }
      }
    };
  },
  data() {
    return {
      ethereum: undefined,
      xfiObject: null,
      lastResult: undefined,
      selectedChain: undefined,
      currentNetwork: "",
      bitcoinbasedInput: {
        from: "",
        to: "",
        feeRate: 5,
        amount: {
          amount: 123,
          decimals: 8,
        },
        memo: "",
      },
      thorbasedInput: {
        asset: {
          chain: "THOR",
          symbol: "RUNE",
          ticker: "RUNE",
        },
        from: "",
        recipient: "",
        type: "deposit",
        amount: {
          amount: 123,
          decimals: 8,
        },
        memo: "",
      },
      binanceInput: {
        asset: {
          chain: "BNB",
          symbol: "BNB",
          ticker: "BNB",
        },
        from: "",
        to: "",
        amount: {
          amount: 2,
          decimals: 8,
        },
        memo: "hi",
      },
    };
  },
  methods: {
    request(object, method, params) {
      console.debug({ object, method, params });
      try {
        object.request(
          {
            method,
            params: params,
          },
          (error, result) => {
            console.debug("callback", error, result);
            this.lastResult = { error, result };
          }
        );
      } catch (e) {
        console.error(e);
        this.lastResult = `Error: ${e.message}`;
      }
    },
    submitBitcoinBased() {
      console.debug(
        "submitBitcoinBased",
        this.bitcoinbasedInput,
        this.selectedChain
      );
      const { from, to, feeRate, amount, memo } = this.bitcoinbasedInput;
      this.xfiObject[this.selectedChain.chain].request(
        {
          method: "transfer",
          params: [
            {
              from,
              recipient: to,
              feeRate,
              amount,
              memo,
            },
          ],
        },
        (error, result) => {
          console.debug(error, result);
          this.lastResult = { error, result };
        }
      );
    },
    submitBinance() {
      console.debug("submitBinance", this.binanceInput, this.selectedChain);
      const { from, to, asset, amount, memo } = this.binanceInput;
      this.xfiObject[this.selectedChain.chain].request(
        {
          method: "transfer",
          params: [
            {
              asset,
              from,
              recipient: to,
              amount,
              memo,
            },
          ],
        },
        (error, result) => {
          console.debug(error, result);
          this.lastResult = { error, result };
        }
      );
    },
    submitThorBased() {
      console.debug("submitThorBased", this.thorbasedInput, this.selectedChain);
      const {
        from,
        amount,
        memo,
        asset,
        type,
        recipient,
      } = this.thorbasedInput;
      this.xfiObject[this.selectedChain.chain].request(
        {
          method: type,
          params: [
            {
              asset,
              from,
              recipient: recipient || undefined,
              amount,
              memo,
            },
          ],
        },
        (error, result) => {
          console.debug(error, result);
          this.lastResult = { error, result };
        }
      );
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
