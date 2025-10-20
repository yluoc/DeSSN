import 'server-only';
import { httpGet } from '../../utils/http';
import type {
  DeBankUsedChain,
  DeBankChainBalance,
  DeBankProtocol,
  DeBankToken,
  DeBankNFT,
  DeBankHistoryItem,
  DeBankNetCurvePoint,
  DeBankAuthorizedToken,
  DeBankAuthorizedNFT
} from '../../utils/utils';

// DeBank API Configuration
const DEBANK_API_BASE_URL = 'https://pro-openapi.debank.com/v1';

// Helper function to build DeBank API URL
function buildDeBankUrl(endpoint: string, params: Record<string, string | number> = {}): string {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    urlParams.append(key, value.toString());
  });
  
  const queryString = urlParams.toString();
  return `${DEBANK_API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
}

// Helper function to make DeBank API requests
async function makeDeBankRequest<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = buildDeBankUrl(endpoint, params);
  
  const headers: HeadersInit = {
    'accept': 'application/json',
    'AccessKey': process.env.DEBANK_API_KEY || '',
  };

  const response = await httpGet<T>(url, { headers });
  return response;
}

/**
 * Get user used chain
 * Returns a list of chains that the user has used.
 */
export async function getUserUsedChains(
  address: string
): Promise<DeBankUsedChain[]> {
  return makeDeBankRequest<DeBankUsedChain[]>('/user/used_chain_list', { id: address });
}

/**
 * Get user chain balance
 * Returns the balance of a given address on a specific chain.
 */
export async function getUserChainBalance(
  address: string,
  chainId: string
): Promise<DeBankChainBalance> {
  return makeDeBankRequest<DeBankChainBalance>('/user/chain_balance', { 
    id: address, 
    chain_id: chainId 
  });
}

/**
 * Get user protocol
 * Get one user's positions in the protocol
 */
export async function getUserProtocol(
  address: string,
  protocolId: string
): Promise<DeBankProtocol> {
  return makeDeBankRequest<DeBankProtocol>('/user/protocol', { 
    id: address, 
    protocol_id: protocolId 
  });
}

/**
 * Get user complex protocol list
 * Get user's complex protocol list on a specific chain
 */
export async function getUserComplexProtocolList(
  address: string,
  chainId: string
): Promise<DeBankProtocol[]> {
  return makeDeBankRequest<DeBankProtocol[]>('/user/complex_protocol_list', { 
    id: address, 
    chain_id: chainId 
  });
}

/**
 * Get user complex protocol list on all supported chains
 * Get user's complex protocol list across all supported chains
 */
export async function getUserComplexProtocolListAllChains(
  address: string
): Promise<DeBankProtocol[]> {
  return makeDeBankRequest<DeBankProtocol[]>('/user/complex_protocol_list', { 
    id: address 
  });
}

/**
 * Get user token balance
 * Get user's token balance on a specific chain
 */
export async function getUserTokenBalance(
  address: string,
  chainId: string,
  tokenId: string
): Promise<DeBankToken> {
  return makeDeBankRequest<DeBankToken>('/user/token_balance', { 
    id: address, 
    chain_id: chainId,
    token_id: tokenId
  });
}

/**
 * Get user token list
 * Get user's token list on a specific chain
 */
export async function getUserTokenList(
  address: string,
  chainId: string
): Promise<DeBankToken[]> {
  return makeDeBankRequest<DeBankToken[]>('/user/token_list', { 
    id: address, 
    chain_id: chainId 
  });
}

/**
 * Get a list of token balances on all supported chains
 * Get user's token balances across all supported chains
 */
export async function getUserTokenBalancesAllChains(
  address: string
): Promise<DeBankToken[]> {
  return makeDeBankRequest<DeBankToken[]>('/user/token_list', { 
    id: address 
  });
}

/**
 * Get user nft list on all supported chain
 * Get user's NFT list across all supported chains
 */
export async function getUserNFTListAllChains(
  address: string
): Promise<DeBankNFT[]> {
  return makeDeBankRequest<DeBankNFT[]>('/user/nft_list', { 
    id: address 
  });
}

/**
 * Get user history list
 * Get user's transaction history on a specific chain
 */
export async function getUserHistoryList(
  address: string,
  chainId: string,
  startTime?: number,
  endTime?: number
): Promise<DeBankHistoryItem[]> {
  const params: Record<string, string | number> = { 
    id: address, 
    chain_id: chainId 
  };
  
  if (startTime) params.start_time = startTime;
  if (endTime) params.end_time = endTime;
  
  return makeDeBankRequest<DeBankHistoryItem[]>('/user/history_list', params);
}

/**
 * Get user transaction history on all supported chains
 * Get user's transaction history across all supported chains
 */
export async function getUserTransactionHistoryAllChains(
  address: string,
  startTime?: number,
  endTime?: number
): Promise<DeBankHistoryItem[]> {
  const params: Record<string, string | number> = { 
    id: address 
  };
  
  if (startTime) params.start_time = startTime;
  if (endTime) params.end_time = endTime;
  
  return makeDeBankRequest<DeBankHistoryItem[]>('/user/history_list', params);
}

/**
 * Get user token authorized list
 * Get user's authorized token list
 */
export async function getUserTokenAuthorizedList(
  address: string
): Promise<DeBankAuthorizedToken[]> {
  return makeDeBankRequest<DeBankAuthorizedToken[]>('/user/token_authorized_list', { 
    id: address 
  });
}

/**
 * Get user nft authorized list
 * Get user's authorized NFT list
 */
export async function getUserNFTAuthorizedList(
  address: string
): Promise<DeBankAuthorizedNFT[]> {
  return makeDeBankRequest<DeBankAuthorizedNFT[]>('/user/nft_authorized_list', { 
    id: address 
  });
}

/**
 * Get user total balance on all supported chains
 * Get user's total balance across all supported chains
 */
export async function getUserTotalBalanceAllChains(
  address: string
): Promise<DeBankChainBalance[]> {
  return makeDeBankRequest<DeBankChainBalance[]>('/user/total_balance', { 
    id: address 
  });
}

/**
 * Get user 24-hour net curve on a single chain
 * Get net curve of user on a single chain
 */
export async function getUserChainNetCurve(
  address: string,
  chainId: string
): Promise<DeBankNetCurvePoint[]> {
  return makeDeBankRequest<DeBankNetCurvePoint[]>('/user/chain_net_curve', { 
    id: address, 
    chain_id: chainId 
  });
}

/**
 * Get user 24-hour net curve on all chains
 * Get net curve of user on all chains
 */
export async function getUserTotalNetCurve(
  address: string,
  chainIds?: string[]
): Promise<DeBankNetCurvePoint[]> {
  const params: Record<string, string | number> = { 
    id: address 
  };
  
  if (chainIds && chainIds.length > 0) {
    params.chain_ids = chainIds.join(',');
  }
  
  return makeDeBankRequest<DeBankNetCurvePoint[]>('/user/total_net_curve', params);
}
