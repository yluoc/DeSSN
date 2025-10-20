'use client';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface RequestOptions {
  timeout?: number;
  cache?: boolean;
  retries?: number;
}

class ApiClient {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private pendingRequests = new Map<string, Promise<any>>();

  private async makeRequest<T>(
    url: string, 
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeout = 8000, cache = true, retries = 2 } = options;
    
    // Check cache first
    if (cache) {
      const cached = this.cache.get(url);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
    }

    // Check if request is already pending
    if (this.pendingRequests.has(url)) {
      return this.pendingRequests.get(url)!;
    }

    const requestPromise = this.executeRequest<T>(url, timeout, retries);
    this.pendingRequests.set(url, requestPromise);

    try {
      const result = await requestPromise;
      
      // Cache successful results
      if (cache) {
        this.cache.set(url, {
          data: result,
          timestamp: Date.now(),
          ttl: 30000 // 30 seconds
        });
      }
      
      return result;
    } finally {
      this.pendingRequests.delete(url);
    }
  }

  private async executeRequest<T>(
    url: string, 
    timeout: number, 
    retries: number
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=30',
            'Accept': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on abort (timeout)
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
        }
      }
    }
    
    throw lastError || new Error('Request failed');
  }

  // DeBank API methods
  async getUserUsedChains(address: string): Promise<ApiResponse<any>> {
    try {
      const data = await this.makeRequest(`/api/debank/chains?address=${address}&type=used`);
      return { data, loading: false, error: null };
    } catch (error) {
      return { data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUserTokenList(address: string): Promise<ApiResponse<any>> {
    try {
      const data = await this.makeRequest(`/api/debank/tokens?address=${address}&type=all`);
      return { data, loading: false, error: null };
    } catch (error) {
      return { data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUserProtocols(address: string): Promise<ApiResponse<any>> {
    try {
      const data = await this.makeRequest(`/api/debank/protocols?address=${address}&type=complex-all`);
      return { data, loading: false, error: null };
    } catch (error) {
      return { data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUserNFTs(address: string): Promise<ApiResponse<any>> {
    try {
      const data = await this.makeRequest(`/api/debank/nfts?address=${address}`);
      return { data, loading: false, error: null };
    } catch (error) {
      return { data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUserHistory(address: string): Promise<ApiResponse<any>> {
    try {
      const data = await this.makeRequest(`/api/debank/history?address=${address}&type=all`);
      return { data, loading: false, error: null };
    } catch (error) {
      return { data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Etherscan API methods
  async getEtherBalance(address: string): Promise<ApiResponse<any>> {
    try {
      const data = await this.makeRequest(`/api/etherscan/balance?address=${address}`);
      return { data, loading: false, error: null };
    } catch (error) {
      return { data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTransactions(address: string): Promise<ApiResponse<any>> {
    try {
      const data = await this.makeRequest(`/api/etherscan/transactions?address=${address}&offset=20`);
      return { data, loading: false, error: null };
    } catch (error) {
      return { data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getTokenTransfers(address: string): Promise<ApiResponse<any>> {
    try {
      const data = await this.makeRequest(`/api/etherscan/token-transfers?address=${address}&tokenType=erc20&offset=20`);
      return { data, loading: false, error: null };
    } catch (error) {
      return { data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Batch request method for parallel execution
  async getBatchData(address: string) {
    console.log('Starting batch request for address:', address);
    
    const requests = [
      this.getUserUsedChains(address),
      this.getUserTokenList(address),
      this.getUserProtocols(address),
      this.getUserNFTs(address),
      this.getUserHistory(address),
      this.getEtherBalance(address),
      this.getTransactions(address),
      this.getTokenTransfers(address)
    ];

    const results = await Promise.allSettled(requests);
    console.log('Batch results:', results);
    
    const batchData = {
      chains: results[0].status === 'fulfilled' ? results[0].value : { data: null, error: 'Failed to fetch chains' },
      tokens: results[1].status === 'fulfilled' ? results[1].value : { data: null, error: 'Failed to fetch tokens' },
      protocols: results[2].status === 'fulfilled' ? results[2].value : { data: null, error: 'Failed to fetch protocols' },
      nfts: results[3].status === 'fulfilled' ? results[3].value : { data: null, error: 'Failed to fetch NFTs' },
      history: results[4].status === 'fulfilled' ? results[4].value : { data: null, error: 'Failed to fetch history' },
      balance: results[5].status === 'fulfilled' ? results[5].value : { data: null, error: 'Failed to fetch balance' },
      transactions: results[6].status === 'fulfilled' ? results[6].value : { data: null, error: 'Failed to fetch transactions' },
      tokenTransfers: results[7].status === 'fulfilled' ? results[7].value : { data: null, error: 'Failed to fetch token transfers' }
    };
    
    console.log('Final batch data:', batchData);
    return batchData;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const apiClient = new ApiClient();
