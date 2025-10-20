import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserChainBalance
} from '../../../lib/providers/debank/user';

// GET /api/debank/chain-balance
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const chainId = searchParams.get('chainId');

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    if (!chainId) {
      return NextResponse.json({ error: 'ChainId parameter is required' }, { status: 400 });
    }

    const balance = await getUserChainBalance(address, chainId);
    
    return NextResponse.json({ 
      address, 
      chainId,
      balance
    });
  } catch (error) {
    console.error('DeBank chain balance API error:', error);
    return NextResponse.json({ error: 'Failed to fetch chain balance' }, { status: 500 });
  }
}
