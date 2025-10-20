// Etherscan API Response Types
export interface EtherscanResponse<T> {
  status: string;
  message: string;
  result: T;
}

// Supported Etherscan chains
export const SUPPORTED_CHAINS = {
  ETHEREUM: 1,
  POLYGON: 137,
  BSC: 56,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  AVALANCHE: 43114,
  FANTOM: 250,
  GNOSIS: 100,
  MOONBEAM: 1284,
  MOONRIVER: 1285,
  HARMONY: 1666600000,
  CRONOS: 25,
  BTTC: 199,
  CELO: 42220,
  AURORA: 1313161554,
  EVMOS: 9001,
  METIS: 1088,
  BOBA: 288,
  RSK: 30,
  HECO: 128,
  OKC: 66,
  KLAYTN: 8217,
  IOTEX: 4689,
  SMARTBCH: 10000,
  ENERGYWEB: 246,
  VOLTA: 73799,
  EWCTEST: 73799,
  THUNDERCORE: 108,
  POLYGON_ZKEVM: 1101,
  BASE: 8453,
  LINEA: 59144,
  SCROLL: 534352,
  MANTLE: 5000,
  ZKSYNC_ERA: 324,
  POLYGON_ZKEVM_TESTNET: 1442,
  BASE_TESTNET: 84531,
  LINEA_TESTNET: 59140,
  SCROLL_TESTNET: 534353,
  MANTLE_TESTNET: 5001,
  ZKSYNC_ERA_TESTNET: 280,
} as const;

export type SupportedChain = keyof typeof SUPPORTED_CHAINS;
export type ChainId = typeof SUPPORTED_CHAINS[SupportedChain];

export interface BalanceResponse {
  account: string;
  balance: string;
}

export interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  contractAddress: string;
  from: string;
  to: string;
  value: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenDecimal?: string;
  tokenID?: string;
  tokenValue?: string;
  confirmations: string;
}

export interface BridgeTransaction {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  address: string;
  amount: string;
  tokenName: string;
  symbol: string;
  contractAddress: string;
  divisor: string;
}

export interface TokenTransferEvent {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  contractAddress: string;
  from: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  tokenID?: string;
  tokenValue?: string;
  confirmations: string;
}

export interface PlasmaDeposit {
  blockNumber: string;
  timeStamp: string;
  blockReward: string;
}

export interface L2DepositTransaction {
  blockNumber: string;
  timeStamp: string;
  blockHash: string;
  hash: string;
  nonce: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  isError: string;
  errDescription: string;
  txreceipt_status: string;
  queueIndex: string;
  L1transactionhash: string;
  L1TxOrigin: string;
  tokenAddress: string;
  tokenSentFrom: string;
  tokenSentTo: string;
  tokenValue: string;
}

export interface L2WithdrawalTransaction {
  blockNumber: string;
  timeStamp: string;
  blockHash: string;
  hash: string;
  nonce: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  isError: string;
  errDescription: string;
  txreceipt_status: string;
  message: string;
  messageNonce: string;
  status: string;
  L1transactionhash: string;
  tokenAddress: string;
  withdrawalType: string;
  tokenValue: string;
  L1transactionhashProve: string;
}

// DeBank API Types
export interface DeBankUsedChain {
  id: string;
  community_id: number;
  name: string;
  logo_url: string | null;
  native_token_id: string;
  wrapped_token_id: string;
  born_at: number;
}

export interface DeBankChainBalance {
  usd_value: number;
}

export interface DeBankToken {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  display_symbol: string | null;
  optimized_symbol: string;
  decimals: number;
  logo_url: string | null;
  protocol_id: string | null;
  price: number;
  is_verified: boolean;
  is_core: boolean | null;
  is_wallet: boolean;
  time_at: number;
  amount: number;
  raw_amount: number;
  raw_amount_hex_str: string;
}

export interface DeBankProtocol {
  id: string;
  chain: string;
  name: string;
  logo_url: string | null;
  site_url: string | null;
  has_supported_portfolio: boolean;
  tvl?: number;
  portfolio_item_list: DeBankPortfolioItem[];
}

export interface DeBankPortfolioItem {
  stats: {
    asset_usd_value: number;
    debt_usd_value: number;
    net_usd_value: number;
  };
  update_at: number;
  name: string;
  detail_types: string[];
  detail: any;
}

export interface DeBankNFT {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  display_symbol: string | null;
  optimized_symbol: string;
  decimals: number;
  logo_url: string | null;
  protocol_id: string | null;
  price: number;
  is_verified: boolean;
  is_core: boolean | null;
  is_wallet: boolean;
  time_at: number;
  amount: number;
  raw_amount: number;
  raw_amount_hex_str: string;
}

export interface DeBankHistoryItem {
  id: string;
  chain: string;
  protocol_id: string;
  protocol_name: string;
  protocol_logo_url: string | null;
  protocol_site_url: string | null;
  type: string;
  status: string;
  time_at: number;
  tx_hash: string;
  block_number: number;
  gas_used: number;
  gas_price: number;
  gas_fee: number;
  tx_detail: any;
}

export interface DeBankNetCurvePoint {
  timestamp: number;
  usd_value: number;
}

export interface DeBankAuthorizedToken {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  display_symbol: string | null;
  optimized_symbol: string;
  decimals: number;
  logo_url: string | null;
  protocol_id: string | null;
  price: number;
  is_verified: boolean;
  is_core: boolean | null;
  is_wallet: boolean;
  time_at: number;
  amount: number;
  raw_amount: number;
  raw_amount_hex_str: string;
}

export interface DeBankAuthorizedNFT {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  display_symbol: string | null;
  optimized_symbol: string;
  decimals: number;
  logo_url: string | null;
  protocol_id: string | null;
  price: number;
  is_verified: boolean;
  is_core: boolean | null;
  is_wallet: boolean;
  time_at: number;
  amount: number;
  raw_amount: number;
  raw_amount_hex_str: string;
}
