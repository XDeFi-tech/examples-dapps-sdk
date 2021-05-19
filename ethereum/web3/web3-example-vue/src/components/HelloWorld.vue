<template>
  <div class="hello">
    <h1>My Web3 dApp</h1>

    <div>
      <div>Web3 version: {{ web3 && web3.version }}</div>
      <div>Accounts: {{ web3Accounts }}</div>
      <div></div>
      <div>
        <h2>Send erc20 form</h2>
        <div>
          ERC20 Contract address: <br />
          <input disabled v-model="erc20address" placeholder="erc20 address" />
        </div>
        <div>
          ERC20 Contract Decimals: <br />
          <input disabled type="number" v-model="decimals" />
        </div>

        <div>
          Recipient address: <br />
          <input v-model="recipientAddress" placeholder="recipient address" />
        </div>
        <div>
          amount: <br />
          <input v-model="erc20amount" type="number" placeholder="amount" />
        </div>
        <button type="submit" @click="sendHandler">Send AYA</button>

        <br /><br /><br />
        <div>resp: {{ resp }}</div>
        <div>err: {{ err }}</div>
      </div>

      <div>
        <h2>personal_sign</h2>
        <input v-model="personalSign" />
        <br />
        <button @click="personalSignHandler">Personal Sign</button>
        <br />
        {{ personalSignResp }}
        {{ personalSignErr }}
      </div>

      <div>
        <h2>eth_sign</h2>
        <input v-model="ethSign" />
        <br />
        <button @click="ethSignHandler">eth Sign</button>
        <br />
        {{ ethSignResp }}
        {{ ethSignErr }}
      </div>

      <div>
        <h2>eth_signTransaction</h2>
        <pre>{{ signTxInfo }}</pre>
        <button @click="ethSignTransactionHandler">eth Sign Transaction</button>
        <br />
        {{ ethSignTransactionResp }}
        {{ ethSignTransactionErr }}
      </div>

      <div>
        <h2>eth_getBalance</h2>
        <button @click="ethBalanceHandler">eth Get Balance</button>
        <br />
        {{ ethBalance ? `Balance: ${ethBalance}` : '' }}
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import erc20abi from "../assets/erc20abi.json";

// const _exampleCallback = (err, resp) => {
//   if (err) {
//     console.error("failed to erc20 send", err);
//     return;
//   }
//   console.log("send successfully erc20", resp);
// };
// console.log(_exampleCallback);
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      web3: null,
      web3Connected: false,
      web3Accounts: [],
      web3contract: null,
      erc20address: "0xad6d458402f60fd3bd25163575031acdce07538d",
      recipientAddress: "0x26E7Ef2D05793c6D47c678f1F4B246856236F089",
      erc20amount: 3,
      decimals: null,

      personalSign: "hello",
      personalSignResp: null,
      personalSignErr: null,

      ethSign: "helloethsign",
      ethSignResp: null,
      ethSignErr: null,

      ethBalance: null,

      ethSignTransactionResp: null,
      ethSignTransactionErr: null,
      signTxInfo: null,

      resp: null,
      err: null,
    };
  },
  methods: {
    sendHandler(e) {
      console.log("sendHandler", e);
      if (!this.web3contract) {
        return alert("web3contract not initialized");
      }
      console.log(this.web3contract);
      const amountBN = this.web3.utils
        .toBN(10)
        .pow(this.web3.utils.toBN(this.decimals));
      console.log("amountBN", amountBN);
      const total = this.web3.utils.toBN(this.erc20amount).mul(amountBN);
      console.log("total", total);
      this.web3contract.methods
        .transfer(this.recipientAddress, total)
        .send({
          from: this.web3Accounts[0],
        })
        .then((resp) => {
          console.log("send successfully erc20", resp);
          this.resp = resp;
          alert("success! " + JSON.stringify(resp));
        })
        .catch((err) => {
          console.error("failed send", err);
          alert("failed", err);
          this.err = err;
        });
    },
    personalSignHandler() {
      console.log("personalSignHandler", this.web3);
      this.web3.eth.personal
        .sign(this.personalSign, this.web3Accounts[0])
        .then((res) => {
          console.log("res", res);
          this.personalSignResp = res;
        })
        .catch((err) => {
          console.error(err);
          this.personalSignErr = err;
        });
    },
    ethSignHandler() {
      console.log("ethSignHandler", this.web3);
      this.web3.eth
        .sign(this.ethSign, this.web3Accounts[0])
        .then((res) => {
          console.log("res", res);
          this.ethSignResp = res;
        })
        .catch((err) => {
          console.error(err);
          this.ethSignErr = err;
        });
    },
    async ethBalanceHandler() {
      console.log("ethBalanceHandler", this.web3);
      this.ethBalance = await this.web3.eth.getBalance(this.web3Accounts[0]);
    },
    ethSignTransactionHandler() {
      console.log("ethSignTransactionHandler", this.web3);
      this.signTxInfo = {
        from: this.web3Accounts[0],
        gasPrice: "20000000000",
        gas: "21000",
        nonce: "0x42",
        to: "0x3535353535353535353535353535353535353535",
        value: "1000000000000000000",
        data: "0xdeadbeef",
      };
      // https://web3js.readthedocs.io/en/v1.2.11/web3-eth-personal.html#id23
      this.web3.eth
        .signTransaction(this.signTxInfo)
        .then((res) => {
          console.log("res", res);
          this.ethSignTransactionResp = res;
        })
        .catch((err) => {
          console.error(err);
          this.ethSignTransactionErr = err;
        });
    },
  },
  mounted() {
    window.addEventListener("load", (event) => {
      console.log("ready running web3 detection", event);
      if (window?.ethereum) {
        if (window.ethereum.isMetaMask) {
          alert("Metamask WEB3 Provider detected");
        }
        if (window.ethereum.isXDEFI) {
          alert("XDEFI WEB3 Provider detected");
        }
        window.web3 = new Web3(window.ethereum);
        this.web3 = window.web3;
        try {
          window.ethereum.enable().then(async (accounts) => {
            console.log("accounts", accounts);
            this.web3Accounts = await this.web3.eth.getAccounts();

            this.web3contract = new this.web3.eth.Contract(
              erc20abi,
              this.erc20address
            );
            this.web3contract.methods
              .decimals()
              .call()
              .then((decimals) => {
                console.log("erc20 decimals", decimals);
                this.decimals = decimals;
              })
              .catch((err) =>
                alert(
                  "could not load decimals from contract: " + err.toString()
                )
              );
          });
        } catch (error) {
          console.error("Error while grabbing ethereum.enable()", error);
        }
      } else {
        alert("no window.ethereum detected");
      }
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
