# Web3Auth VanillaJS Quick Start

This example demonstrates how to integrate Web3Auth into a vanilla JavaScript application for EVM chains.

## Prerequisites
- Node.js 20+
- npm
- A Web3Auth Client ID (get one from [Web3Auth Dashboard](https://dashboard.web3auth.io))

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Web3Auth/web3auth-examples.git
```

### 2. Navigate to the example
```bash
cd web3auth-examples/quick-starts/vanillajs-quick-start
```

### 3. Install dependencies
```bash
npm install
```

### 4. Configure Web3Auth Client ID
Open `src/main.js` and replace the `clientId` value with your Web3Auth Client ID:
```javascript
const clientId = "YOUR_WEB3AUTH_CLIENT_ID"; // get from https://dashboard.web3auth.io
```

### 5. Run the application
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser to see the application running.

## 📚 Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [SDK References](https://web3auth.io/docs/sdk)
- [Developer Dashboard](https://dashboard.web3auth.io)
- [Web3Auth Community](https://web3auth.io/community)

## License
MIT

