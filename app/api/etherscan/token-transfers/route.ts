import { NextRequest, NextResponse } from 'next/server';

// GET /api/etherscan/token-transfers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const tokenType = searchParams.get('tokenType') as 'erc20' | 'erc721' | 'erc1155' || 'erc20';
    const offset = parseInt(searchParams.get('offset') || '10');

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    // For now, return mock data to ensure the frontend works
    const mockTransfers = [
      {
        hash: '0x1111111111111111111111111111111111111111111111111111111111111111',
        from: address,
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        value: '1000000000000000000',
        tokenName: 'USD Coin',
        tokenSymbol: 'USDC',
        tokenDecimal: '6',
        timeStamp: Math.floor(Date.now() / 1000).toString(),
        blockNumber: '18500001',
        contractAddress: '0xA0b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C'
      },
      {
        hash: '0x2222222222222222222222222222222222222222222222222222222222222222',
        from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        to: address,
        value: '500000000000000000',
        tokenName: 'Tether USD',
        tokenSymbol: 'USDT',
        tokenDecimal: '6',
        timeStamp: (Math.floor(Date.now() / 1000) - 7200).toString(),
        blockNumber: '18499998',
        contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
      }
    ];
    
    return NextResponse.json({ 
      address, 
      transfers: mockTransfers,
      tokenType,
      pagination: { page: 1, offset, sort: 'desc' },
      blockRange: { startBlock: 0, endBlock: 99999999 },
      chainId: 1
    });
  } catch (error) {
    console.error('Etherscan token transfers API error:', error);
    return NextResponse.json({ error: 'Failed to fetch token transfers' }, { status: 500 });
  }
}
