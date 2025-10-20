import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserUsedChains,
  getUserChainBalance,
  getUserTotalBalanceAllChains
} from '../../../lib/providers/debank/user';

// GET /api/debank/chains
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const type = searchParams.get('type') as 'used' | 'balance' || 'used';

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    if (type === 'used') {
      const chains = await getUserUsedChains(address);
      return NextResponse.json({ 
        address, 
        chains,
        type: 'used'
      });
    } else {
      const balances = await getUserTotalBalanceAllChains(address);
      return NextResponse.json({ 
        address, 
        balances,
        type: 'balance'
      });
    }
  } catch (error) {
    console.error('DeBank chains API error:', error);
    return NextResponse.json({ error: 'Failed to fetch chain data' }, { status: 500 });
  }
}
