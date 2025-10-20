# DeSSN - Blockchain Address Analyzer

A comprehensive blockchain address analysis tool that provides detailed insights about wallet activity, DeFi interactions, and calculates a **Blockchain Credit Score** (300-850 range) based on on-chain behavior.

## 🚀 Features

### 🔍 **Dual Search Modes**
- **🔗 Wallet Connection**: Connect MetaMask to analyze your own wallet
- **🔍 Manual Search**: Enter any blockchain address to analyze external wallets

### 📊 **Comprehensive Analysis**
- **Etherscan Integration**: ETH balance, transactions, token transfers
- **DeBank Integration**: Token holdings, DeFi protocols, NFTs, cross-chain activity
- **Blockchain Credit Score**: 300-850 credit score based on 5 key factors

### 🏆 **Credit Score System**
- **Activity Score**: Transaction volume and frequency
- **Diversity Score**: Token variety and cross-chain activity  
- **Longevity Score**: Account age and transaction history
- **Value Score**: Portfolio value and holdings
- **Protocol Score**: DeFi interactions and protocol usage

### 📱 **User Experience**
- **Responsive Design**: Works on desktop and mobile
- **Real-time Loading**: Individual loading states for each API call
- **PDF Reports**: Download comprehensive analysis reports
- **Performance Optimized**: Caching and parallel API calls

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **APIs**: Etherscan API, DeBank API
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **Wallet Integration**: MetaMask

## 🚀 Getting Started

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
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 API Setup

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

**Note**: The app works with Etherscan only (free), but DeBank provides more comprehensive data.

## 🎯 Usage

### Connect Your Wallet
1. Click "Connect Wallet" in the top right corner
2. Approve MetaMask connection
3. Your wallet address will auto-fill and analysis will start

### Search External Address
1. Enter any blockchain address (0x...) in the search bar
2. Select data sources (Etherscan/DeBank)
3. Click "Search Address" or press Enter
4. View comprehensive analysis and credit score

### Download Reports
1. After analysis completes, click "Download PDF Report"
2. Get a comprehensive report with all data and credit score

## 📊 Credit Score Interpretation

| Score Range | Level | Description |
|-------------|-------|-------------|
| 750-850 | Excellent | Exceptional blockchain creditworthiness |
| 700-749 | Very Good | Strong DeFi participation |
| 650-699 | Good | Growing DeFi presence |
| 600-649 | Fair | Basic DeFi activity |
| 300-599 | Poor | Minimal blockchain activity |

## 🏗️ Project Structure

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

## 🔧 Configuration

### Supported Chains
The app supports all Etherscan-compatible chains:
- Ethereum, Polygon, BSC, Arbitrum, Optimism
- Avalanche, Fantom, Gnosis, Moonbeam
- And 30+ other supported chains

### API Rate Limits
- **Etherscan**: 5 calls/second (free tier)
- **DeBank**: Varies by plan
- **Caching**: 30-second cache to optimize performance

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms
- Netlify
- Railway
- Heroku
- Any Node.js hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Etherscan](https://etherscan.io/) for blockchain data APIs
- [DeBank](https://debank.com/) for DeFi analytics
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you have any questions or issues, please:
1. Check the [Issues](https://github.com/yluoc/DeSSN/issues) page
2. Create a new issue with detailed description
3. Contact the maintainers

---

**Built with ❤️ for the blockchain community**