import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserTokenAuthorizedList,
  getUserNFTAuthorizedList
} from '../../../lib/providers/debank/user';

// GET /api/debank/authorized
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const type = searchParams.get('type') as 'tokens' | 'nfts' || 'tokens';

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    let authorized;
    
    if (type === 'tokens') {
      authorized = await getUserTokenAuthorizedList(address);
    } else {
      authorized = await getUserNFTAuthorizedList(address);
    }
    
    return NextResponse.json({ 
      address, 
      authorized,
      type
    });
  } catch (error) {
    console.error('DeBank authorized API error:', error);
    return NextResponse.json({ error: 'Failed to fetch authorized data' }, { status: 500 });
  }
}
