import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserTokenBalance,
  getUserTokenList,
  getUserTokenBalancesAllChains
} from '../../../lib/providers/debank/user';

// GET /api/debank/tokens
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const chainId = searchParams.get('chainId');
    const tokenId = searchParams.get('tokenId');
    const type = searchParams.get('type') as 'balance' | 'list' | 'all' || 'list';

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    if (type === 'balance') {
      if (!chainId || !tokenId) {
        return NextResponse.json({ error: 'ChainId and TokenId parameters are required for token balance' }, { status: 400 });
      }
      const token = await getUserTokenBalance(address, chainId, tokenId);
      return NextResponse.json({ 
        address, 
        chainId,
        tokenId,
        token,
        type: 'balance'
      });
    } else if (type === 'list') {
      if (!chainId) {
        return NextResponse.json({ error: 'ChainId parameter is required for token list' }, { status: 400 });
      }
      const tokens = await getUserTokenList(address, chainId);
      return NextResponse.json({ 
        address, 
        chainId,
        tokens,
        type: 'list'
      });
    } else {
      const tokens = await getUserTokenBalancesAllChains(address);
      return NextResponse.json({ 
        address, 
        tokens,
        type: 'all'
      });
    }
  } catch (error) {
    console.error('DeBank tokens API error:', error);
    return NextResponse.json({ error: 'Failed to fetch token data' }, { status: 500 });
  }
}
