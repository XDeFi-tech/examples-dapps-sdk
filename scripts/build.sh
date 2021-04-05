yarn install
mkdir serving_directory/
cd multichain/multichain-vue-example && yarn install && PUBLIC_PATH="/multichain/" yarn build && mv dist/ ../../serving_directory/multichain && cd ../..
cd ethereum/web3/web3-example-vue && yarn install && PUBLIC_PATH="/ethereum/" yarn build && mv dist/ ../../../serving_directory/ethereum && cd ../..