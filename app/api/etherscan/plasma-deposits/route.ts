import { NextRequest, NextResponse } from 'next/server';
import { getPlasmaDeposits } from '../../../lib/providers/etherscan/l2-functions';
import { ChainId } from '../../../lib/utils/utils';

// GET /api/etherscan/plasma-deposits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = parseInt(searchParams.get('offset') || '100');
    const chainId = parseInt(searchParams.get('chainId') || '137'); // Default to Polygon

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    const deposits = await getPlasmaDeposits(
      address, 
      page, 
      offset, 
      chainId as ChainId
    );
    
    return NextResponse.json({ 
      address, 
      deposits,
      pagination: { page, offset },
      chainId: chainId
    });
  } catch (error) {
    console.error('Etherscan plasma deposits API error:', error);
    return NextResponse.json({ error: 'Failed to fetch plasma deposits' }, { status: 500 });
  }
}
