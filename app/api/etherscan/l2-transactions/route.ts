import { NextRequest, NextResponse } from 'next/server';
import { 
  getDepositTransactions,
  getWithdrawalTransactions
} from '../../../lib/providers/etherscan/l2-functions';
import { ChainId } from '../../../lib/utils/utils';

// GET /api/etherscan/l2-transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const transactionType = searchParams.get('type') as 'deposit' | 'withdrawal' || 'deposit';
    const page = parseInt(searchParams.get('page') || '1');
    const offset = parseInt(searchParams.get('offset') || '1000');
    const sort = searchParams.get('sort') as 'asc' | 'desc' || 'asc';
    const chainId = parseInt(searchParams.get('chainId') || '10'); // Default to Optimism

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    let transactions;
    
    if (transactionType === 'deposit') {
      transactions = await getDepositTransactions(
        address, 
        page, 
        offset, 
        sort, 
        chainId as ChainId
      );
    } else {
      transactions = await getWithdrawalTransactions(
        address, 
        page, 
        offset, 
        sort, 
        chainId as ChainId
      );
    }
    
    return NextResponse.json({ 
      address, 
      transactions,
      transactionType,
      pagination: { page, offset, sort },
      chainId: chainId
    });
  } catch (error) {
    console.error('Etherscan L2 transactions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch L2 transactions' }, { status: 500 });
  }
}
