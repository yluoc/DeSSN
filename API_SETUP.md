# Environment Variables Setup

## Required API Keys

To use this application, you need to set up the following environment variables:

### 1. Etherscan API Key
- **Get it here**: https://etherscan.io/apis
- **Free tier**: 5 calls/second, 100,000 calls/day
- **Add to `.env.local`**: `ETHERSCAN_API_KEY=your_key_here`

### 2. DeBank API Key  
- **Get it here**: https://docs.cloud.debank.com/en/readme/api-pro-reference
- **Free tier**: Limited requests per day
- **Add to `.env.local`**: `DEBANK_API_KEY=your_key_here`

## Setup Instructions

1. Create a `.env.local` file in your project root
2. Add the API keys:
```env
ETHERSCAN_API_KEY=your_etherscan_api_key_here
DEBANK_API_KEY=your_debank_api_key_here
```

3. Restart your development server:
```bash
npm run dev
```

## Current Status

- ✅ **Etherscan APIs**: Working (returns 200 status)
- ❌ **DeBank APIs**: Failing (500 error - missing API key)

## Test Address

Use this address for testing: `0xAde4611dF7a34071A1886503f2Ab7D2bc1C68bC9`

## Troubleshooting

If you're still having issues:
1. Check browser console for error messages
2. Use the "Test All APIs" button on the page
3. Verify API keys are correctly set in `.env.local`
4. Make sure to restart the dev server after adding environment variables
