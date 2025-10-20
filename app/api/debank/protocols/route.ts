import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserProtocol,
  getUserComplexProtocolList,
  getUserComplexProtocolListAllChains
} from '../../../lib/providers/debank/user';

// GET /api/debank/protocols
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const protocolId = searchParams.get('protocolId');
    const chainId = searchParams.get('chainId');
    const type = searchParams.get('type') as 'single' | 'complex' | 'complex-all' || 'single';

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    if (type === 'single') {
      if (!protocolId) {
        return NextResponse.json({ error: 'ProtocolId parameter is required for single protocol' }, { status: 400 });
      }
      const protocol = await getUserProtocol(address, protocolId);
      return NextResponse.json({ 
        address, 
        protocol,
        type: 'single'
      });
    } else if (type === 'complex') {
      if (!chainId) {
        return NextResponse.json({ error: 'ChainId parameter is required for complex protocol list' }, { status: 400 });
      }
      const protocols = await getUserComplexProtocolList(address, chainId);
      return NextResponse.json({ 
        address, 
        protocols,
        chainId,
        type: 'complex'
      });
    } else {
      const protocols = await getUserComplexProtocolListAllChains(address);
      return NextResponse.json({ 
        address, 
        protocols,
        type: 'complex-all'
      });
    }
  } catch (error) {
    console.error('DeBank protocols API error:', error);
    return NextResponse.json({ error: 'Failed to fetch protocol data' }, { status: 500 });
  }
}
