import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserChainNetCurve,
  getUserTotalNetCurve
} from '../../../lib/providers/debank/user';

// GET /api/debank/net-curve
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const chainId = searchParams.get('chainId');
    const chainIds = searchParams.get('chainIds');
    const type = searchParams.get('type') as 'chain' | 'total' || 'total';

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    let netCurve;
    
    if (type === 'chain') {
      if (!chainId) {
        return NextResponse.json({ error: 'ChainId parameter is required for chain-specific net curve' }, { status: 400 });
      }
      netCurve = await getUserChainNetCurve(address, chainId);
    } else {
      const chainIdArray = chainIds ? chainIds.split(',') : undefined;
      netCurve = await getUserTotalNetCurve(address, chainIdArray);
    }
    
    return NextResponse.json({ 
      address, 
      netCurve,
      type,
      chainId: type === 'chain' ? chainId : undefined,
      chainIds: type === 'total' ? chainIds : undefined
    });
  } catch (error) {
    console.error('DeBank net curve API error:', error);
    return NextResponse.json({ error: 'Failed to fetch net curve data' }, { status: 500 });
  }
}
