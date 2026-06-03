import "./index.css";

import ReactDOM from "react-dom/client";
// IMP START - Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/modal/react";
import web3AuthContextConfig from "./web3authContext";
// IMP END - Setup Web3Auth Provider

// IMP START - Setup Wagmi Provider
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth0Provider } from "@auth0/auth0-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
// IMP END - Setup Wagmi Provider

import App from "./App";

// IMP START - Setup Wagmi Provider
const queryClient = new QueryClient();
// IMP END - Setup Wagmi Provider

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // IMP START - Setup Web3Auth Provider
  <Web3AuthProvider config={web3AuthContextConfig}>
  {/* // IMP END - Setup Web3Auth Provider */}
    {/* // IMP START - Setup Wagmi Provider */}
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            authorizationParams={{
              redirect_uri: window.location.origin,
            }}
          >
            <App />
          </Auth0Provider>
        </GoogleOAuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  {/* // IMP END - Setup Wagmi Provider */}
  {/* // IMP START - Setup Web3Auth Provider */}
  </Web3AuthProvider>
  // IMP END - Setup Web3Auth Provider
);
