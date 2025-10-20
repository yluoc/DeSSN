import { NextRequest, NextResponse } from 'next/server';
import { getBridgeTransactions } from '../../../lib/providers/etherscan/accounts';
import { SUPPORTED_CHAINS, ChainId } from '../../../lib/utils/utils';

// GET /api/etherscan/bridge-transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = parseInt(searchParams.get('offset') || '100');
    const chainId = parseInt(searchParams.get('chainId') || '137'); // Default to Polygon

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    const transactions = await getBridgeTransactions(
      address, 
      page, 
      offset, 
      chainId as ChainId
    );
    
    return NextResponse.json({ 
      address, 
      transactions,
      pagination: { page, offset },
      chainId: chainId
    });
  } catch (error) {
    console.error('Etherscan bridge transactions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch bridge transactions' }, { status: 500 });
  }
}
