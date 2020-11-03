<template>
  <div id="app">
    <h1>Example Bitcoin XDEFI</h1>
    <div>
      <h1>getAccounts</h1>
      <button @click="getAccounts" type="submit">getAccounts</button>
    </div>
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";

import XDEFIBitcoin from "@xdefi/bitcoin";

export default {
  name: "App",
  components: {
    // HelloWorld,
  },

  data() {
    return {
      bitcoinProvider: null,

      xdefiBitcoin: null,
    };
  },

  methods: {
    getAccounts() {
      this.xdefiBitcoin
        ?.getAccounts()
        .then(console.log)
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
