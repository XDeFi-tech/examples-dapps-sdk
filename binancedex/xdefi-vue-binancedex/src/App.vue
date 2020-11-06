<template>
  <div id="app">
    <h1>Example XDEFI BinanceDex</h1>

    <div>
      <h1>getAccounts</h1>
      <button @click="getAccounts">getAccounts</button>
      <div>{{ accounts }}</div>
      <br />
      <br />
      <br />

      <div v-if="accounts.length">
        <h1>Select account</h1>
        <br />
        <button
          v-bind:key="acc"
          @click="setAccount(acc)"
          v-for="acc in accounts"
        >
          Select {{ acc }}
        </button>
      </div>

      <br /><br /><br />

      <!-- <div>
        <button @click="getBalance">getBalance</button>

        <div>Balances: {{ balances }}</div>
      </div> -->

      <div v-if="selectedAccount">
        <button @click="getSequence(selectedAccount)">
          getSequence(nonce)
        </button>

        <div>Sequence: {{ sequence }}</div>
      </div>

      <br /><br /><br />
      <div v-if="selectedAccount">
        <h1>transfer</h1>
        <div>
          <input type="text" v-model="transferAsset" placeholder="asset" />
          <br />
          <input
            type="text"
            v-model="transferFrom"
            placeholder="transfer from"
          />
          <br />
          <input type="text" v-model="transferTo" placeholder="transfer to" />
          <br />
          <input type="number" v-model="transferAmount" placeholder="amount" />
          <br />
          <input type="text" v-model="transferMessage" placeholder="memo" />
          <br />
          <input
            type="number"
            v-model="transferSequence"
            placeholder="number"
          />
          <br />
          <br />
          <button @click="transfer()">transfer()</button>

          <div>Result : {{ transferResult }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

import XDEFIBinanceDex from "@xdefi/binancedex-provider";
import axios from "axios";

import { BncClient } from "@binance-chain/javascript-sdk";
const api = "https://testnet-dex.binance.org/";

export default {
  name: "App",
  components: {
    // HelloWorld
  },

  data() {
    return {
      xdefiBinance: null,
      accounts: [],
      selectedAccount: null,

      binanceClient: null,

      sequence: 0,

      transferAsset: "RUNE-67C",
      transferFrom: "",
      transferTo: "",
      transferAmount: 0,
      transferMessage: "",
      transferSequence: 0,

      transferResult: null,
    };
  },

  methods: {
    getAccounts() {
      this.xdefiBinance
        ?.getAccounts()
        .then((acc) => {
          this.accounts = acc;
        })
        .catch(alert);
    },

    // getBalance() {
    //   this.binanceClient.get
    // },

    setAccount(address) {
      // console.log("setAccount", address);
      this.binanceClient.setSigningDelegate(
        this.xdefiBinance.defaultSigningDelegate(address)
      );
      this.selectedAccount = address;
      this.transferFrom = address;
    },

    async getSequence(address) {
      const sequenceURL = `${api}api/v1/account/${address}/sequence`;
      this.transferSequence = (await axios.get(sequenceURL)).data.sequence || 0;
      this.sequence = this.transferSequence;
    },

    transfer() {
      // console.log("transfer");

      this.binanceClient
        .transfer(
          this.transferFrom,
          this.transferTo,
          this.transferAmount,
          this.transferAsset,
          this.transferMessage,
          this.transferSequence
        )
        .then((resp) => {
          this.transferResult = resp;
        })

        .catch((err) => {
          console.error("err", err);
          alert("error " + err);
        });
    },
  },

  mounted() {
    window.addEventListener("load", (event) => {
      // console.log("running bitcoin provider detection", event);
      // console.log("window.xfi", window.xfi);
      if (window.xfi?.binance) {
        alert("Bitcoin provider XDEFI detected");
        // console.log("window.xfi.binance", window.xfi.binance);
        this.xdefiBinance = new XDEFIBinanceDex(window.xfi.binance);

        // console.log("xdefiBinance loaded", this.xdefiBinance);

        this.binanceClient = new BncClient(api);
        this.binanceClient.initChain();
      } else {
        alert("binancedex provider not detected");
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
