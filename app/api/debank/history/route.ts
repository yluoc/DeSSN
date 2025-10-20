import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserHistoryList,
  getUserTransactionHistoryAllChains
} from '../../../lib/providers/debank/user';

// GET /api/debank/history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const chainId = searchParams.get('chainId');
    const startTime = searchParams.get('startTime') ? parseInt(searchParams.get('startTime')!) : undefined;
    const endTime = searchParams.get('endTime') ? parseInt(searchParams.get('endTime')!) : undefined;
    const type = searchParams.get('type') as 'chain' | 'all' || 'all';

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    let history;
    
    if (type === 'chain') {
      if (!chainId) {
        return NextResponse.json({ error: 'ChainId parameter is required for chain-specific history' }, { status: 400 });
      }
      history = await getUserHistoryList(address, chainId, startTime, endTime);
    } else {
      history = await getUserTransactionHistoryAllChains(address, startTime, endTime);
    }
    
    return NextResponse.json({ 
      address, 
      history,
      type,
      chainId: type === 'chain' ? chainId : undefined,
      timeRange: startTime && endTime ? { startTime, endTime } : undefined
    });
  } catch (error) {
    console.error('DeBank history API error:', error);
    return NextResponse.json({ error: 'Failed to fetch history data' }, { status: 500 });
  }
}
