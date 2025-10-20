import { NextRequest, NextResponse } from 'next/server';
import { getInternalTransactions } from '../../../lib/providers/etherscan/accounts';
import { ChainId } from '../../../lib/utils/utils';

// GET /api/etherscan/internal-transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const startBlock = parseInt(searchParams.get('startBlock') || '0');
    const endBlock = parseInt(searchParams.get('endBlock') || '99999999');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = parseInt(searchParams.get('offset') || '10');
    const sort = searchParams.get('sort') as 'asc' | 'desc' || 'asc';
    const chainId = parseInt(searchParams.get('chainId') || '1');

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    const transactions = await getInternalTransactions(
      address, 
      startBlock, 
      endBlock, 
      page, 
      offset, 
      sort, 
      chainId as ChainId
    );
    
    return NextResponse.json({ 
      address, 
      transactions,
      pagination: { page, offset, sort },
      blockRange: { startBlock, endBlock },
      chainId: chainId
    });
  } catch (error) {
    console.error('Etherscan internal transactions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch internal transactions' }, { status: 500 });
  }
}
