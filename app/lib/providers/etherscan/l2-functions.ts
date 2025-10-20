import 'server-only';
import { httpGet } from '../../utils/http';
import type { 
  EtherscanResponse, 
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
 * Get List of Plasma Deposits by Address
 * Returns a list of Plasma Deposits received by an address.
 * Applicable to Polygon (137) only.
 */
export async function getPlasmaDeposits(
  address: string,
  page: number = 1,
  offset: number = 100,
  chainId: ChainId = SUPPORTED_CHAINS.POLYGON
): Promise<PlasmaDeposit[]> {
  const url = buildEtherscanUrl({
    module: 'account',
    action: 'txnbridge',
    address,
    page,
    offset,
  }, chainId);

  const response = await httpGet<EtherscanResponse<PlasmaDeposit[]>>(url);
  
  if (response.status !== '1') {
    throw new Error(`Etherscan API error: ${response.message}`);
  }
  
  return response.result;
}

/**
 * Get List of Deposit Transactions
 * Returns a list of deposits in ETH or ERC20 tokens from Ethereum to L2.
 * Applicable to Arbitrum Stack (42161, 42170, 33139, 660279) and Optimism Stack (10, 8453, 130, 252, 480, 5000, 81457)
 */
export async function getDepositTransactions(
  address: string,
  page: number = 1,
  offset: number = 1000,
  sort: 'asc' | 'desc' = 'asc',
  chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM
): Promise<L2DepositTransaction[]> {
  const url = buildEtherscanUrl({
    module: 'account',
    action: 'getdeposittxs',
    address,
    page,
    offset,
    sort,
  }, chainId);

  const response = await httpGet<EtherscanResponse<L2DepositTransaction[]>>(url);
  
  if (response.status !== '1') {
    throw new Error(`Etherscan API error: ${response.message}`);
  }
  
  return response.result;
}

/**
 * Get List of Withdrawal Transactions
 * Returns a list of withdrawals in ETH or ERC20 tokens from L2 to Ethereum.
 * Applicable to Arbitrum Stack (42161, 42170, 33139, 660279) and Optimism Stack (10, 8453, 130, 252, 480, 5000, 81457)
 */
export async function getWithdrawalTransactions(
  address: string,
  page: number = 1,
  offset: number = 1000,
  sort: 'asc' | 'desc' = 'asc',
  chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM
): Promise<L2WithdrawalTransaction[]> {
  const url = buildEtherscanUrl({
    module: 'account',
    action: 'getwithdrawaltxs',
    address,
    page,
    offset,
    sort,
  }, chainId);

  const response = await httpGet<EtherscanResponse<L2WithdrawalTransaction[]>>(url);
  
  if (response.status !== '1') {
    throw new Error(`Etherscan API error: ${response.message}`);
  }
  
  return response.result;
}
