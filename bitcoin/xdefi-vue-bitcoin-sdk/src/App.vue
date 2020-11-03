<template>
  <div id="app">
    <h1>Example Bitcoin XDEFI</h1>
    <div>
      <h1>getAccounts</h1>
      <button @click="getAccounts" type="submit">getAccounts</button>
      <div>{{ returnedAccounts }}</div>
    </div>
    <br /><br /><br />

    <div>
      <h1>getUnspentUTXOs</h1>
      <div v-if="this.returnedAccounts.length === 0">
        No accounts, getAccounts first
      </div>
      <button v-else @click="getUnspentUTXOs" type="submit">
        getUnspentUTXOs first account
      </button>
      <div>
        {{ returnedUTXOS }}
      </div>
    </div>
    <br /><br /><br />

    <div>
      <h1>transfer</h1>
      <input type="text" v-model="transferFrom" placeholder="Transfer From" />
      <input type="text" v-model="transferTo" placeholder="Transfer To" />
      <input
        type="number"
        v-model="transferAmount"
        placeholder="Transfer Amount in Satoshis"
      />
      <input
        type="number"
        v-model="transferFeeRate"
        placeholder="Transfer Fee Rate"
      />
      <button @click="transfer">Transfer</button>
      <div>
        TxHash: <br />
        {{ returnValueTransfer }}
      </div>
    </div>
    <br /><br /><br />

    <div>
      <h1>signTransaction</h1>
      <div v-if="returnedUTXOS.length === 0">
        no utxos, get unspent utxos first
      </div>
      <div v-else>
        <div>
          <button @click="signTransaction">Sign Transaction</button>
        </div>

        <div>Result: {{ resultSignature }}</div>
      </div>
    </div>
    <br /><br /><br />
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";

import XDEFIBitcoin from "@xdefi/bitcoin";

import * as Bitcoin from "bitcoinjs-lib";

export default {
  name: "App",
  components: {
    // HelloWorld,
  },

  data() {
    return {
      bitcoinProvider: null,

      xdefiBitcoin: null,

      returnedAccounts: [],

      returnedUTXOS: [],

      /**
       * Transfer form data
       */
      returnValueTransfer: null,
      transferFrom: "",
      transferTo: "",
      transferAmount: 133,
      transferFeeRate: 1,

      /**
       * SignTransaction Result
       */
      resultSignature: null,
    };
  },

  methods: {
    getAccounts() {
      this.xdefiBitcoin
        ?.getAccounts()
        .then((acc) => {
          console.log(acc);
          this.returnedAccounts = acc;
        })
        .catch(console.error);
    },
    getUnspentUTXOs() {
      console.log(this.returnedAccounts);
      this.xdefiBitcoin
        ?.getUnspentUTXOs(this.returnedAccounts[0])
        .then((utxos) => {
          console.log(utxos);
          this.returnedUTXOS = utxos;
        })
        .catch(console.error);
    },
    transfer() {
      this.xdefiBitcoin
        ?.transfer(
          this.transferFrom,
          this.transferTo,
          this.transferAmount,
          this.transferFeeRate
        )
        .then((respHash) => {
          console.log(respHash);
          this.returnValueTransfer = respHash;
        })
        .catch(console.error);
    },
    signTransaction() {
      const valueOut = 1;
      // generate Pbst for demo
      const psbt = new Bitcoin.Psbt({ network: Bitcoin.networks.testnet }); // Network-specific
      this.returnedUTXOS.forEach((UTXO) => {
        let formattedWitnessUtxo = {
          script: Buffer.from(UTXO.witnessUtxo.script),
          value: UTXO.witnessUtxo.value,
        };
        psbt.addInput({
          hash: UTXO.hash,
          index: UTXO.index,
          witnessUtxo: formattedWitnessUtxo,
        });
      });
      psbt.addOutput({ address: this.returnedAccounts[1], value: valueOut }); // Add output {address, value}
      const hexPbst = psbt.toHex();
      console.log("pbsthex", hexPbst)
      this.xdefiBitcoin
        ?.signTransaction(this.returnedAccounts[0], hexPbst)
        .then((resultSignature) => {
          console.log(resultSignature);
          this.resultSignature = resultSignature;
        })
        .catch(console.error);
    },
  },

  /**
   * Mounted
   */
  mounted() {
    window.addEventListener("load", (event) => {
      console.log("running bitcoin provider detection", event);
      console.log("window.xfi", window.xfi);

      if (window.xfi?.bitcoin) {
        alert("Bitcoin provider XDEFI detected");

        this.bitcoinProvider = window.xfi.bitcoin;

        this.xdefiBitcoin = new XDEFIBitcoin(this.bitcoinProvider);

        console.log("xdefiBitcoin loaded", this.xdefiBitcoin);
      } else {
        alert("Bitcoin provider not detected");
      }
    });
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
