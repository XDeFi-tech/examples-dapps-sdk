<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->

    <div>XDEFI Injected Chains Providers:</div>
    <br />
    <div>window.xfi {{ xfiObject ? "detected" : "not detected" }}</div>

    <div v-if="xfiObject">
      <br />
      <br />
      <h1>Chains / Accounts</h1>

      <h3>{{ account }}</h3>

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
          <button @click="request('binance', 'request_accounts', [])">
            Retrieve Accounts
          </button>
        </div>
      </div>
      <div>
        window.xfi.bitcoin:
        {{ xfiObject.bitcoin ? "detected" : "not detected" }}
        <div>
          <button @click="request('bitcoin', 'request_accounts', [])">
            Retrieve Accounts
          </button>
        </div>
      </div>
      <div>
        window.xfi.bitcoincash:
        {{ xfiObject.bitcoincash ? "detected" : "not detected" }}
        <div>
          <button @click="request('bitcoincash', 'request_accounts', [])">
            Retrieve Accounts
          </button>
        </div>
      </div>
      <div>
        window.xfi.litecoin:
        {{ xfiObject.litecoin ? "detected" : "not detected" }}
        <div>
          <button @click="request('litecoin', 'request_accounts', [])">
            Retrieve Accounts
          </button>
        </div>
      </div>
      <div>
        window.xfi.thorchain:
        {{ xfiObject.thorchain ? "detected" : "not detected" }}
        <div>
          <button @click="request('thorchain', 'request_accounts', [])">
            Retrieve Accounts
          </button>
        </div>
      </div>

      <div>
        window.xfi.dogecoin:
        {{ xfiObject.dogecoin ? "detected" : "not detected" }}
        <div>
          <button @click="request('dogecoin', 'request_accounts', [])">
            Retrieve Accounts
          </button>
        </div>
      </div>

      <div>
        window.xfi.solana:
        {{ xfiObject.solana ? "detected" : "not detected" }}
        <div>
          <button @click="requestSolana()">
            Retrieve Accounts
          </button>
        </div>
      </div>

      <div>
        window.xfi.tron:
        {{ xfiObject.tron ? "detected" : "not detected" }}
        <div>
          <button @click="requestTron()">
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
            <option v-bind:value="{ chain: 'dogecoin' }">dogecoin</option>
          </select>

          <br />
          Selected chain: {{ selectedChain }}
          <br />
          <br />
          <div v-if="['binance'].includes(selectedChain && selectedChain.chain)">
            <h3>Asset:</h3>
            <br />
            Chain
            <input type="text" v-model="binanceInput.asset.chain" placeholder="chain" />
            <br />
            Symbol:

            <input type="text" v-model="binanceInput.asset.symbol" placeholder="Symbol" />
            <br />
            Ticker:

            <input type="text" v-model="binanceInput.asset.ticker" placeholder="Ticker" />
            <br />
            <br />
            From Address:
            <input type="text" v-model="binanceInput.from" placeholder="From Address" />
            <br />
            Target address:
            <input type="text" v-model="binanceInput.to" placeholder="To Address" />
            <br />
            Amount:
            <input v-model="binanceInput.amount.amount" type="number" placeholder="Amount (smallest unit value)" />
            <br />
            Decimals:
            <input v-model="binanceInput.amount.decimals" type="number" placeholder="Decimals" />
            <br />
            Memo(optional):
            <input v-model="binanceInput.memo" type="text" placeholder="Memo (optional)" />
            <br />
            <button @click="submitBinance">Submit</button>
          </div>
          <div v-if="
              ['bitcoin', 'litecoin', 'bitcoincash', 'dogecoin'].includes(
                selectedChain && selectedChain.chain
              )
            ">
            <br />
            From Address:
            <input type="text" v-model="bitcoinbasedInput.from" placeholder="From Address" />
            <br />
            Target address:
            <input type="text" v-model="bitcoinbasedInput.to" placeholder="To Address" />
            <br />
            Fee Rate:
            <input v-model="bitcoinbasedInput.feeRate" type="number" placeholder="Fee Rate" />
            <br />
            Amount:
            <input v-model="bitcoinbasedInput.amount.amount" type="number" placeholder="Amount (smallest unit value)" />
            <br />
            Decimals:
            <input v-model="bitcoinbasedInput.amount.decimals" type="number" placeholder="Decimals" />
            <br />
            Memo(optional):
            <input v-model="bitcoinbasedInput.memo" type="text" placeholder="Memo (optional)" />
            <br />
            <button @click="submitBitcoinBased">Submit</button>
          </div>
          <div v-if="['thorchain'].includes(selectedChain && selectedChain.chain)">
            <select v-model="thorbasedInput.type">
              <!-- inline object literal -->
              <option v-bind:value="'deposit'">deposit</option>
              <option v-bind:value="'transfer'">transfer</option>
            </select>
            {{ thorbasedInput }}
            <h3>Asset:</h3>
            <br />
            Chain
            <input type="text" v-model="thorbasedInput.asset.chain" placeholder="chain" />
            <br />
            Symbol:

            <input type="text" v-model="thorbasedInput.asset.symbol" placeholder="Symbol" />
            <br />
            Ticker:

            <input type="text" v-model="thorbasedInput.asset.ticker" placeholder="Ticker" />
            <br />
            <br />
            From Address:

            <input type="text" v-model="thorbasedInput.from" placeholder="From Address" />
            <br />
            <div v-if="thorbasedInput.type === 'transfer'">
              To Address:

              <input type="text" v-model="thorbasedInput.recipient" placeholder="To Address" />

              <br /><br />
            </div>
            <br />
            Amount:
            <input v-model="thorbasedInput.amount.amount" type="number"
              placeholder="Amount (smallest unit value)" /><br />
            Decimals:

            <input v-model="thorbasedInput.amount.decimals" type="number" placeholder="Decimals" />
            <br />
            Memo:

            <input v-model="thorbasedInput.memo" type="text" placeholder="Memo" />
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

        const check = () => {
          if ("xfi" in window) {
            // Detecting the XDeFi providers: xfi and ethereum
            console.log(window.xfi, window.ethereum);
            this.ethereum = window.ethereum;
            this.xfiObject = window.xfi;

            try {
              // Setting current network to bitcoin
              this.currentNetwork = window.xfi.bitcoin?.network;
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
              "dogecoin",
            ];
            objects.forEach((chainId) => {
              if (window.xfi && window.xfi[chainId]) {
                const provider = window.xfi[chainId];
                provider.on("chainChanged", (obj) => {
                  // Subscription to chain changes
                  console.log(`chainChanged::${chainId}`, obj);
                  // When chain is changed, its respective network is set as current
                  this.currentNetwork = obj.network || obj._network;
                });
                provider.on("accountsChanged", (obj) => {
                  // Subscription to account changes
                  console.log(`accountsChanged::${chainId}`, obj);
                });
              }
            });
          }
        };
        setTimeout(() => check(), 1000);
      }
    };
  },
  data() {
    return {
      account: "",
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
    // This method utilises the request method of the selected provider
    async request(chain, method, params) {
      console.debug({ chain, method, params });
      try {
        // provider request method takes in 2 parameters: method and params
        // method can have values of 'transfer', 'deposit' and 'request_accounts'
        /* params are: 
              from - the address from which the request is coming

              recipient - the address on which the request is targeted

              feeRate - units per transaction size, 
                        http://docs.xchainjs.org/xchain-client/overview.html?highlight=feeRate#transfer

              amount - request transaction amount

              memo - text hint for the request

              type (in thor chain case) - either transfer or deposit
        */

        const account = await this.xfiObject[chain].request(
          {
            method,
            params: params ?? [],
          }
        );

        this.account = account
      } catch (e) {
        console.error(e);
        this.lastResult = `Error: ${e.message}`;
      }
    },
    async requestTron() {
      try {
        if (!window.xfi.tron) {
          throw new Error("Tron Provider not found!")
        }
        const account = (await window.xfi.tron.tronWeb.createRandom()).address

        this.account = account
      } catch (e) {
        console.error(e);
        this.lastResult = `Error: ${e.message}`;
      }
    },
    async requestSolana() {
      try {
        const account = (await window.xfi.solana.connect()).publicKey.toString()

        this.account = account
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
      const { from, amount, memo, asset, type, recipient } =
        this.thorbasedInput;
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
