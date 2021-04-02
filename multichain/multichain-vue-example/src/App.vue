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
      <div>
        window.ethereum:
        {{ ethereum ? "detected" : "not detected" }}
      </div>
      <div>
        window.xfi.binance:
        {{ xfiObject.binance ? "detected" : "not detected" }}
      </div>
      <div>
        window.xfi.bitcoin:
        {{ xfiObject.bitcoin ? "detected" : "not detected" }}
      </div>
      <div>
        window.xfi.bitcoincash:
        {{ xfiObject.bitcoincash ? "detected" : "not detected" }}
      </div>
      <div>
        window.xfi.litecoin:
        {{ xfiObject.litecoin ? "detected" : "not detected" }}
      </div>
      <div>
        window.xfi.thorchain:
        {{ xfiObject.thorchain ? "detected" : "not detected" }}
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
      }
    });
  },
  data() {
    return {
      ethereum: undefined,
      xfiObject: null,
      lastResult: undefined,
    };
  },
  methods: {
    request(object, method, params) {
      try {
        object.request(
          {
            method,
            params: params,
          },
          (result) => {
            this.lastResult = result;
          }
        );
      } catch (e) {
        console.error(e);
        this.lastResult = `Error: ${e.message}`;
      }
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
