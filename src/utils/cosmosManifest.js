const CosmosHubChains = {
  cosmos: 'cosmos',
  osmosis: 'osmosis',
  axelar: 'axelar',
  juno: 'juno',
  crescent: 'crescent',
  kava: 'kava',
  stargaze: 'stargaze',
  akash: 'akash',
  cronos: 'cronos',
  kujira: 'kujira',
  stride: 'stride',
  mars: 'mars',
  terra: 'terra'
};

const COSMOS_MANIFESTS = {
  [CosmosHubChains.cosmos]: {
    name: 'Cosmos Hub',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/cosmos/rpc/mainnet',
    lcdURL: 'https://rpc-proxy.xdefi.services/cosmos/lcd/mainnet',
    chainSymbol: 'ATOM',
    blockExplorerURL: 'https://www.mintscan.io/cosmos/account',
    chainId: 'cosmoshub-4',
    chain: 'cosmos',
    denom: 'uatom',
    decimals: 6,
    prefix: 'cosmos',
    feeGasStep: {
      high: 0.003,
      medium: 0.0025,
      low: 0.001
    },
    maxGapAmount: 0
  },
  [CosmosHubChains.osmosis]: {
    name: 'Osmosis',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/osmosis/rpc/mainnet',
    lcdURL: 'https://rpc-proxy.xdefi.services/osmosis/lcd/mainnet',
    chainSymbol: 'OSMO',
    blockExplorerURL: 'https://www.mintscan.io/osmosis/account',
    chainId: 'osmosis-1',
    chain: 'osmosis',
    denom: 'uosmo',
    decimals: 6,
    prefix: 'osmo',
    feeGasStep: {
      high: 0.03,
      medium: 0.025,
      low: 0.01
    },
    maxGapAmount: 0
  },
  [CosmosHubChains.axelar]: {
    name: 'Axelar',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/axelar/rpc/mainnet',
    lcdURL: 'https://rpc-proxy.xdefi.services/axelar/lcd/mainnet',
    chainSymbol: 'AXL',
    blockExplorerURL: 'https://www.mintscan.io/axelar/account',
    chainId: 'axelar-dojo-1',
    chain: 'axelar',
    denom: 'uaxl',
    decimals: 6,
    prefix: 'axelar',
    feeGasStep: {
      high: 0.007,
      medium: 0.007,
      low: 0.01
    },
    maxGapAmount: 0
  },
  [CosmosHubChains.juno]: {
    name: 'JUNO',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/juno/rpc/mainnet',
    lcdURL: 'https://rpc-proxy.xdefi.services/juno/lcd/mainnet',
    chainSymbol: 'JUNO',
    blockExplorerURL: 'https://www.mintscan.io/juno/account',
    chainId: 'juno-1',
    chain: 'juno',
    denom: 'ujuno',
    decimals: 6,
    prefix: 'juno',
    feeGasStep: {
      high: 0.075,
      medium: 0.1,
      low: 0.125
    },
    maxGapAmount: 0
  },
  [CosmosHubChains.crescent]: {
    name: 'Crescent',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/crescent/rpc/mainnet',
    lcdURL: 'https://rpc-proxy.xdefi.services/crescent/lcd/mainnet',
    chainSymbol: 'CRE',
    blockExplorerURL: 'https://www.mintscan.io/crescent/account',
    chainId: 'crescent-1',
    chain: 'crescent',
    denom: 'ucre',
    decimals: 6,
    prefix: 'cre',
    feeGasStep: {
      high: 0.01,
      medium: 0.025,
      low: 0.03
    },
    maxGapAmount: 0
  },
  [CosmosHubChains.kava]: {
    name: 'Kava',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/kava/rpc/mainnet',
    lcdURL: 'https://rpc-proxy.xdefi.services/kava/lcd/mainnet',
    chainSymbol: 'KAVA',
    blockExplorerURL: 'https://www.mintscan.io/kava/account',
    chainId: 'kava_2222-10',
    chain: 'Kava',
    denom: 'ukava',
    decimals: 6,
    prefix: 'kava',
    feeGasStep: {
      high: 0.05,
      medium: 0.01,
      low: 0.25
    },
    maxGapAmount: 0
  },
  [CosmosHubChains.stargaze]: {
    name: 'Stargaze',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/stargaze/rpc/mainnet',
    lcdURL: 'https://rpc-proxy.xdefi.services/stargaze/lcd/mainnet',
    chainSymbol: 'STARS',
    blockExplorerURL: 'https://www.mintscan.io/stargaze/account',
    chainId: 'stargaze-1',
    chain: 'stargaze',
    denom: 'ustars',
    decimals: 6,
    prefix: 'stars',
    feeGasStep: {
      high: 1,
      medium: 1.1,
      low: 1.2
    },
    maxGapAmount: 0
  },
  [CosmosHubChains.akash]: {
    name: 'Akash',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/akash/rpc/mainnet',
    lcdURL: 'https://rpc-proxy.xdefi.services/akash/lcd/mainnet',
    chainSymbol: 'AKT',
    blockExplorerURL: 'https://www.mintscan.io/akash/account',
    chainId: 'akashnet-2',
    chain: 'akash',
    denom: 'uakt',
    decimals: 6,
    prefix: 'akash',
    feeGasStep: {
      high: 0.01,
      medium: 0.01,
      low: 0.01
    },
    maxGapAmount: 0
  },
  [CosmosHubChains.cronos]: {
    name: 'Crypto.Org',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/cryptoorg/rpc/mainnet',
    lcdURL: 'https://rpc-proxy.xdefi.services/cryptoorg/lcd/mainnet',
    chainSymbol: 'CRO',
    blockExplorerURL: 'https://www.mintscan.io/crypto-org/account',
    chainId: 'crypto-org-chain-mainnet-1',
    chain: 'cronos',
    denom: 'basecro',
    decimals: 6,
    prefix: 'cro',
    feeGasStep: {
      high: 0.025,
      medium: 0.03,
      low: 0.04
    },
    maxGapAmount: 0
  },
  [CosmosHubChains.kujira]: {
    name: 'Kujira',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/kujira/rpc/mainnet',
    lcdURL: 'https://rpc-proxy.xdefi.services/kujira/lcd/mainnet',
    chainSymbol: 'KUJI',
    blockExplorerURL: 'https://www.mintscan.io/kujira/account',
    chainId: 'kaiyo-1',
    chain: 'kujira',
    denom: 'ukuji',
    decimals: 6,
    prefix: 'kujira',
    feeGasStep: {
      high: 0.01,
      medium: 0.025,
      low: 0.03
    },
    maxGapAmount: 0
  },
  [CosmosHubChains.stride]: {
    name: 'Stride',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/stride/rpc/mainnet',
    lcdURL: 'https://rpc-proxy.xdefi.services/stride/lcd/mainnet',
    chainSymbol: 'STRD',
    blockExplorerURL: 'https://www.mintscan.io/stride/account',
    chainId: 'stride-1',
    chain: 'stride',
    denom: 'ustrd',
    decimals: 6,
    prefix: 'stride',
    feeGasStep: {
      high: 0.0005,
      medium: 0.001,
      low: 0.002
    },
    maxGapAmount: 0
  },
  [CosmosHubChains.mars]: {
    name: 'Mars',
    description: '',
    rpcURL: 'https://rpc-proxy.xdefi.services/mars/rpc/mainnet',
    lcdURL: 'https://rpc-proxy.xdefi.services/mars/lcd/mainnet',
    chainSymbol: 'MARS',
    blockExplorerURL: 'https://www.mintscan.io/mars-protocol/account',
    chainId: 'mars-1',
    chain: 'mars',
    denom: 'umars',
    decimals: 6,
    prefix: 'mars',
    feeGasStep: {
      high: 0,
      medium: 0,
      low: 0.01
    },
    maxGapAmount: 0
  },
  [CosmosHubChains.terra]: {
    name: 'Terra',
    description: '',
    rpcURL: 'https://terra-rpc.polkachu.com/',
    lcdURL: 'https://phoenix-lcd.terra.dev/',
    chainSymbol: 'LUNA',
    blockExplorerURL: 'https://www.mintscan.io/terra/account',
    chainId: 'phoenix-1',
    chain: 'terra',
    denom: 'uluna',
    decimals: 6,
    prefix: 'terra',
    feeGasStep: {
      high: 0.003,
      medium: 0.0025,
      low: 0.001
    },
    maxGapAmount: 0
  }
};

export { CosmosHubChains, COSMOS_MANIFESTS };