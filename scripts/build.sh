yarn install
mkdir serving_directory/
cd binancedex/xdefi-vue-binancedex && yarn install && PUBLIC_PATH="/binance/" yarn build && mv dist/ ../../serving_directory/binance && cd ../..
cd bitcoin/xdefi-vue-bitcoin-sdk && yarn install && PUBLIC_PATH="/bitcoin/" yarn build && mv dist/ ../../serving_directory/bitcoin && cd ../..
cd ethereum/web3/web3-example-vue && yarn install && PUBLIC_PATH="/ethereum/" yarn build && mv dist/ ../../../serving_directory/ethereum && cd ../..