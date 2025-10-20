import 'server-only';
import { httpGet } from '../../utils/http';
import type { 
  EtherscanResponse, 
  BalanceResponse, 
  Transaction, 
  BridgeTransaction, 
  TokenTransferEvent,
  PlasmaDeposit,
  L2DepositTransaction,
  L2WithdrawalTransaction,
  ChainId
} from '../../utils/utils';
import { SUPPORTED_CHAINS } from '../../utils/utils';

// Etherscan API Configuration
const ETHERSCAN_API_BASE_URL = 'https://api.etherscan.io/v2/api';

// Helper function to build Etherscan API URL
function buildEtherscanUrl(params: Record<string, string | number>, chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM): string {
  const urlParams = new URLSearchParams({
    chainid: chainId.toString(),
    apikey: process.env.ETHERSCAN_API_KEY || '',
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, value.toString()])
    ),
  });
  
  return `${ETHERSCAN_API_BASE_URL}?${urlParams.toString()}`;
}

/**
 * Get Ether Balance for a Single Address
 * Returns the Ether balance of a given address.
 */
export async function getEtherBalance(
  address: string,
  tag: 'earliest' | 'pending' | 'latest' = 'latest',
  chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM
): Promise<string> {
  const url = buildEtherscanUrl({
    module: 'account',
    action: 'balance',
    address,
    tag,
  }, chainId);

  const response = await httpGet<EtherscanResponse<string>>(url);
  
  if (response.status !== '1') {
    throw new Error(`Etherscan API error: ${response.message}`);
  }
  
  return response.result;
}

/**
 * Get a list of Bridge Transactions By Address
 * Returns the list of bridge transactions associated with an address.
 * Applicable to Gnosis (100), BTTC (199), and Polygon (137) only.
 */
export async function getBridgeTransactions(
  address: string,
  page: number = 1,
  offset: number = 100,
  chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM
): Promise<BridgeTransaction[]> {
  const url = buildEtherscanUrl({
    module: 'account',
    action: 'txnbridge',
    address,
    page,
    offset,
  }, chainId);

  const response = await httpGet<EtherscanResponse<BridgeTransaction[]>>(url);
  
  if (response.status !== '1') {
    throw new Error(`Etherscan API error: ${response.message}`);
  }
  
  return response.result;
}

/**
 * Get a list of 'Normal' Transactions By Address
 * Returns the list of transactions performed by an address.
 */
export async function getNormalTransactions(
  address: string,
  startBlock: number = 0,
  endBlock: number = 99999999,
  page: number = 1,
  offset: number = 10,
  sort: 'asc' | 'desc' = 'asc',
  chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM
): Promise<Transaction[]> {
  const url = buildEtherscanUrl({
    module: 'account',
    action: 'txlist',
    address,
    startblock: startBlock,
    endblock: endBlock,
    page,
    offset,
    sort,
  }, chainId);

  const response = await httpGet<EtherscanResponse<Transaction[]>>(url);
  
  if (response.status !== '1') {
    throw new Error(`Etherscan API error: ${response.message}`);
  }
  
  return response.result;
}

/**
 * Get a list of 'Internal' Transactions by Address
 * Returns the list of internal transactions performed by an address.
 */
export async function getInternalTransactions(
  address: string,
  startBlock: number = 0,
  endBlock: number = 99999999,
  page: number = 1,
  offset: number = 10,
  sort: 'asc' | 'desc' = 'asc',
  chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM
): Promise<Transaction[]> {
  const url = buildEtherscanUrl({
    module: 'account',
    action: 'txlistinternal',
    address,
    startblock: startBlock,
    endblock: endBlock,
    page,
    offset,
    sort,
  }, chainId);

  const response = await httpGet<EtherscanResponse<Transaction[]>>(url);
  
  if (response.status !== '1') {
    throw new Error(`Etherscan API error: ${response.message}`);
  }
  
  return response.result;
}

/**
 * Get a list of 'ERC20 - Token Transfer Events' by Address
 * Returns the list of ERC20 token transfer events for an address.
 */
export async function getERC20TokenTransfers(
  address: string,
  contractAddress?: string,
  startBlock: number = 0,
  endBlock: number = 99999999,
  page: number = 1,
  offset: number = 10,
  sort: 'asc' | 'desc' = 'asc',
  chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM
): Promise<TokenTransferEvent[]> {
  const params: Record<string, string | number> = {
    module: 'account',
    action: 'tokentx',
    address,
    startblock: startBlock,
    endblock: endBlock,
    page,
    offset,
    sort,
  };

  if (contractAddress) {
    params.contractaddress = contractAddress;
  }

  const url = buildEtherscanUrl(params, chainId);

  const response = await httpGet<EtherscanResponse<TokenTransferEvent[]>>(url);
  
  if (response.status !== '1') {
    throw new Error(`Etherscan API error: ${response.message}`);
  }
  
  return response.result;
}

/**
 * Get a list of 'ERC721 - Token Transfer Events' by Address
 * Returns the list of ERC721 token transfer events for an address.
 */
export async function getERC721TokenTransfers(
  address: string,
  contractAddress?: string,
  startBlock: number = 0,
  endBlock: number = 99999999,
  page: number = 1,
  offset: number = 10,
  sort: 'asc' | 'desc' = 'asc',
  chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM
): Promise<TokenTransferEvent[]> {
  const params: Record<string, string | number> = {
    module: 'account',
    action: 'tokennfttx',
    address,
    startblock: startBlock,
    endblock: endBlock,
    page,
    offset,
    sort,
  };

  if (contractAddress) {
    params.contractaddress = contractAddress;
  }

  const url = buildEtherscanUrl(params, chainId);

  const response = await httpGet<EtherscanResponse<TokenTransferEvent[]>>(url);
  
  if (response.status !== '1') {
    throw new Error(`Etherscan API error: ${response.message}`);
  }
  
  return response.result;
}

/**
 * Get a list of 'ERC1155 - Token Transfer Events' by Address
 * Returns the list of ERC1155 token transfer events for an address.
 */
export async function getERC1155TokenTransfers(
  address: string,
  contractAddress?: string,
  startBlock: number = 0,
  endBlock: number = 99999999,
  page: number = 1,
  offset: number = 10,
  sort: 'asc' | 'desc' = 'asc',
  chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM
): Promise<TokenTransferEvent[]> {
  const params: Record<string, string | number> = {
    module: 'account',
    action: 'token1155tx',
    address,
    startblock: startBlock,
    endblock: endBlock,
    page,
    offset,
    sort,
  };

  if (contractAddress) {
    params.contractaddress = contractAddress;
  }

  const url = buildEtherscanUrl(params, chainId);

  const response = await httpGet<EtherscanResponse<TokenTransferEvent[]>>(url);
  
  if (response.status !== '1') {
    throw new Error(`Etherscan API error: ${response.message}`);
  }
  
  return response.result;
}
