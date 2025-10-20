import { NextRequest, NextResponse } from 'next/server';
import { 
  getEtherBalance,
  getBridgeTransactions,
  getNormalTransactions,
  getInternalTransactions,
  getERC20TokenTransfers,
  getERC721TokenTransfers,
  getERC1155TokenTransfers
} from '../../../lib/providers/etherscan/accounts';
import { SUPPORTED_CHAINS, ChainId } from '../../../lib/utils/utils';
import { 
  getPlasmaDeposits,
  getDepositTransactions,
  getWithdrawalTransactions
} from '../../../lib/providers/etherscan/l2-functions';

// GET /api/etherscan/balance
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const tag = searchParams.get('tag') as 'earliest' | 'pending' | 'latest' || 'latest';
    const chainId = parseInt(searchParams.get('chainId') || '1');

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    const balance = await getEtherBalance(address, tag, chainId as ChainId);
    
    return NextResponse.json({ 
      address, 
      balance, 
      chainId: chainId,
      tag 
    });
  } catch (error) {
    console.error('Etherscan balance API error:', error);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
