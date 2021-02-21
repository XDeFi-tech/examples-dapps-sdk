yarn install
mkdir serving_directory/
cd binancedex/xdefi-vue-binancedex && yarn install && yarn build && mv dist/ ../../serving_directory/binance && cd ../..
cd bitcoin/xdefi-vue-bitcoin-sdk && yarn install && yarn build && mv dist/ ../../serving_directory/bitcoin && cd ../..
cd ethereum/web3/web3-example-vue && yarn install && yarn build && mv dist/ ../../../serving_directory/ethereum && cd ../..