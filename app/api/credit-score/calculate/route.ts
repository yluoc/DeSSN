import { NextRequest, NextResponse } from 'next/server';
import { calculateBlockchainCreditScore, interpretCreditScore } from '../../../lib/utils/creditScoreCalculator';

// POST /api/credit-score/calculate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, selectedApis } = body;

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    // Fetch data from APIs based on selection
    const requests = [];
    
    if (selectedApis.etherscan) {
      requests.push(
        fetch(`${request.nextUrl.origin}/api/etherscan/balance?address=${address}`).then(r => r.json()),
        fetch(`${request.nextUrl.origin}/api/etherscan/transactions?address=${address}&offset=100`).then(r => r.json()),
        fetch(`${request.nextUrl.origin}/api/etherscan/token-transfers?address=${address}&tokenType=erc20&offset=100`).then(r => r.json())
      );
    }
    
    if (selectedApis.debank) {
      requests.push(
        fetch(`${request.nextUrl.origin}/api/debank/chains?address=${address}&type=used`).then(r => r.json()),
        fetch(`${request.nextUrl.origin}/api/debank/tokens?address=${address}&type=all`).then(r => r.json()),
        fetch(`${request.nextUrl.origin}/api/debank/protocols?address=${address}&type=complex-all`).then(r => r.json()),
        fetch(`${request.nextUrl.origin}/api/debank/nfts?address=${address}`).then(r => r.json())
      );
    }

    const results = await Promise.allSettled(requests);
    
    // Process results
    let resultIndex = 0;
    const creditScoreData = {
      address,
      tokenHoldings: [],
      transactions: [],
      tokenTransfers: [],
      protocols: [],
      chains: [],
      nfts: []
    };

    // Process Etherscan results
    if (selectedApis.etherscan) {
      const balanceRes = results[resultIndex++];
      const transactionsRes = results[resultIndex++];
      const tokenTransfersRes = results[resultIndex++];
      
      if (transactionsRes.status === 'fulfilled') {
        creditScoreData.transactions = transactionsRes.value.transactions || [];
      }
      
      if (tokenTransfersRes.status === 'fulfilled') {
        creditScoreData.tokenTransfers = tokenTransfersRes.value.transfers || [];
      }
    }

    // Process DeBank results
    if (selectedApis.debank) {
      const chainsRes = results[resultIndex++];
      const tokensRes = results[resultIndex++];
      const protocolsRes = results[resultIndex++];
      const nftsRes = results[resultIndex++];
      
      if (chainsRes.status === 'fulfilled') {
        creditScoreData.chains = chainsRes.value.chains || [];
      }
      
      if (tokensRes.status === 'fulfilled') {
        creditScoreData.tokenHoldings = tokensRes.value.tokens || [];
      }
      
      if (protocolsRes.status === 'fulfilled') {
        creditScoreData.protocols = protocolsRes.value.protocols || [];
      }
      
      if (nftsRes.status === 'fulfilled') {
        creditScoreData.nfts = nftsRes.value.nfts || [];
      }
    }

    // Calculate Credit Score
    const creditScoreResult = calculateBlockchainCreditScore(creditScoreData);
    const interpretation = interpretCreditScore(creditScoreResult);

    return NextResponse.json({
      address,
      creditScore: creditScoreResult,
      interpretation,
      dataUsed: {
        etherscan: selectedApis.etherscan,
        debank: selectedApis.debank,
        transactionCount: creditScoreData.transactions.length,
        tokenCount: creditScoreData.tokenHoldings.length,
        protocolCount: creditScoreData.protocols.length,
        chainCount: creditScoreData.chains.length,
        nftCount: creditScoreData.nfts.length
      }
    });

  } catch (error) {
    console.error('Credit score calculation error:', error);
    return NextResponse.json({ error: 'Failed to calculate blockchain credit score' }, { status: 500 });
  }
}

// GET /api/credit-score/calculate (for testing)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const etherscan = searchParams.get('etherscan') === 'true';
    const debank = searchParams.get('debank') === 'true';

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    const selectedApis = { etherscan, debank };
    
    // Create a POST request body and call the POST handler
    const mockRequest = {
      json: () => Promise.resolve({ address, selectedApis }),
      nextUrl: { origin: request.nextUrl.origin }
    } as any;

    return POST(mockRequest);

  } catch (error) {
    console.error('Credit score calculation error:', error);
    return NextResponse.json({ error: 'Failed to calculate blockchain credit score' }, { status: 500 });
  }
}
