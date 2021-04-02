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
        <!-- <div>
          <button @click="request(xfiObject.binance, 'request_accounts', [])">
            Retrieve Accounts
          </button>
        </div> -->
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
              v-model="thorbasedInput.amount.decimals"
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
            To Address:

            <input
              type="text"
              v-model="thorbasedInput.to"
              placeholder="From Address"
            />

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
    window.addEventListener("load", (_event) => {
      console.debug(_event);
      if ("xfi" in window) {
        console.log(window.xfi);
        this.ethereum = window.ethereum;
        this.xfiObject = window.xfi;

        this.currentNetwork = window.xfi.bitcoin.network;

        window.xfi.bitcoin.on("chainChanged", (network) => {
          console.info("network", network);
          // this.currentNetwork = network.network;
          console.log("get", window.xfi.bitcoin.chainId);
          console.log("get", window.xfi.bitcoin.network);
        });
        window.xfi.bitcoincash.on("chainChanged", (result) => {
          console.info("bch", result);
          this.currentNetwork = result.network;
        });
        window.xfi.binance.on("chainChanged", (result) => {
          console.info("binance", result);
        });
        window.xfi.litecoin.on("chainChanged", (result) => {
          console.info("ltc", result);
        });
        window.xfi.thorchain.on("chainChanged", (result) => {
          console.info("thorchain", result);
        });
      }
    });
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
        amount: {
          amount: 123,
          decimals: 8,
        },
        memo: "",
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
              to,
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
    submitThorBased() {
      console.debug("submitThorBased", this.thorbasedInput, this.selectedChain);
      const { from, to, amount, memo } = this.thorbasedInput;
      this.xfiObject[this.selectedChain.chain].request(
        {
          method: "deposit",
          params: [
            {
              from,
              to,
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
