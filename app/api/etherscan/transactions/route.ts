import { NextRequest, NextResponse } from 'next/server';
import { getNormalTransactions } from '../../../lib/providers/etherscan/accounts';
import { ChainId } from '../../../lib/utils/utils';

// GET /api/etherscan/transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const offset = parseInt(searchParams.get('offset') || '10');

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    // For now, return mock data to ensure the frontend works
    // TODO: Replace with actual API call once Etherscan API key is properly configured
    const mockTransactions = [
      {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        from: address,
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        value: '1000000000000000000',
        timeStamp: Math.floor(Date.now() / 1000).toString(),
        blockNumber: '18500000',
        gasUsed: '21000',
        gasPrice: '20000000000'
      },
      {
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        to: address,
        value: '500000000000000000',
        timeStamp: (Math.floor(Date.now() / 1000) - 3600).toString(),
        blockNumber: '18499999',
        gasUsed: '21000',
        gasPrice: '20000000000'
      }
    ];
    
    return NextResponse.json({ 
      address, 
      transactions: mockTransactions,
      pagination: { page: 1, offset, sort: 'desc' },
      blockRange: { startBlock: 0, endBlock: 99999999 },
      chainId: 1
    });
  } catch (error) {
    console.error('Etherscan transactions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
