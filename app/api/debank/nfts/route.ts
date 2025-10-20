import { NextRequest, NextResponse } from 'next/server';
import { 
  getUserNFTListAllChains
} from '../../../lib/providers/debank/user';

// GET /api/debank/nfts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    const nfts = await getUserNFTListAllChains(address);
    
    return NextResponse.json({ 
      address, 
      nfts
    });
  } catch (error) {
    console.error('DeBank NFTs API error:', error);
    return NextResponse.json({ error: 'Failed to fetch NFT data' }, { status: 500 });
  }
}
