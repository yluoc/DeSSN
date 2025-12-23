# DeSSN - Blockchain Address Analyzer

A comprehensive blockchain address analysis tool that provides detailed insights about wallet activity, DeFi interactions, and calculates a **Blockchain Credit Score** (300-850 range) based on on-chain behavior.

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask browser extension (for wallet connection)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yluoc/DeSSN.git
   cd DeSSN
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```env
   ETHERSCAN_API_KEY=your_etherscan_api_key
   DEBANK_API_KEY=your_debank_api_key
   ARCJET_API_KEY=your_arcjet_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Setup

### Etherscan API (Free)
1. Visit [Etherscan API](https://etherscan.io/apis)
2. Create a free account
3. Generate an API key
4. Add to `.env.local` as `ETHERSCAN_API_KEY`

### DeBank API (Paid)
1. Visit [DeBank API](https://docs.debank.com/)
2. Sign up for Pro plan
3. Get your API key
4. Add to `.env.local` as `DEBANK_API_KEY`

### Arcjet API (Free)
1. Visit [Arcjet API](https://arcjet.com/)
2. Create a free account
3. Select the framework you use
4. Generate an API key
5. Add to `.env.local` as `ARCJET_API_KEY`

**Note**: The app works with Etherscan only (free), but DeBank provides more comprehensive data.

## Credit Score Interpretation

| Score Range | Level | Description |
|-------------|-------|-------------|
| 750-850 | Excellent | Exceptional blockchain creditworthiness |
| 700-749 | Very Good | Strong DeFi participation |
| 650-699 | Good | Growing DeFi presence |
| 600-649 | Fair | Basic DeFi activity |
| 300-599 | Poor | Minimal blockchain activity |

## Project Structure

```
app/
├── api/                    # Next.js API routes
│   ├── credit-score/      # Credit score calculation
│   ├── debank/            # DeBank API integration
│   └── etherscan/         # Etherscan API integration
├── components/            # React components
│   ├── CreditScoreDisplay.tsx
│   ├── UserProfile.tsx
│   └── WalletConnection.tsx
├── lib/                   # Utilities and providers
│   ├── providers/         # API providers
│   └── utils/            # Helper functions
└── page.tsx              # Main application page
```

## Configuration

### Supported Chains
The app supports all Etherscan-compatible chains:
- Ethereum, Polygon, BSC, Arbitrum, Optimism
- Avalanche, Fantom, Gnosis, Moonbeam
- And 30+ other supported chains

### API Rate Limits
- **Etherscan**: 5 calls/second (free tier)
- **DeBank**: Varies by plan
- **Caching**: 30-second cache to optimize performance

