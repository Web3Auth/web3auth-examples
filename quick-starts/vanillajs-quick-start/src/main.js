// IMP START - Quick Start
import { Web3Auth, WEB3AUTH_NETWORK } from "@web3auth/modal";
// IMP END - Quick Start

// IMP START - Blockchain Calls
import RPC from "./viemRPC.js";
// IMP END - Blockchain Calls

// IMP START - Dashboard Registration
const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
// IMP END - Dashboard Registration

// IMP START - Config
const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
});
// IMP END - Config

let loggedIn = false;
let address = "";
let chainId = null;
let chains = [];

function uiConsole(...args) {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
    console.log(...args);
  }
}

function getEthereumProvider() {
  return web3auth.connection?.ethereumProvider ?? null;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setVisible(id, visible) {
  const el = document.getElementById(id);
  if (el) el.style.display = visible ? "" : "none";
}

function updateUI() {
  setVisible("logged-in-view", loggedIn);
  setVisible("logged-out-view", !loggedIn);
}

function renderSwitchChains() {
  const container = document.getElementById("switch-chain-buttons");
  if (!container) return;
  container.innerHTML = "";

  chains.forEach((chain) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.textContent = chain.displayName;
    button.disabled = chainId === chain.chainId;
    button.addEventListener("click", () => switchChain(chain));
    container.appendChild(button);
  });
}

async function refreshBalance() {
  const provider = getEthereumProvider();
  if (!provider) return;

  setVisible("balance-loading", true);
  setVisible("balance-error", false);
  setText("balance-value", "");

  try {
    const balance = await RPC.getBalance(provider);
    setText("balance-value", `${balance.formatted} ${balance.symbol}`);
  } catch (error) {
    setText("balance-error", `Error: ${error.message}`);
    setVisible("balance-error", true);
  } finally {
    setVisible("balance-loading", false);
  }
}

async function refreshBlockchainState() {
  const provider = getEthereumProvider();
  if (!provider) return;

  chainId = web3auth.currentChainId;
  setText("chain-id", chainId ?? "");
  address = (await RPC.getAddress(provider)) ?? "";
  setText("user-address", address);
  renderSwitchChains();
  await refreshBalance();
}

async function onConnected() {
  loggedIn = true;
  chains = web3auth.coreOptions.chains ?? [];
  setText("connector-name", web3auth.primaryConnectorName ?? "Web3Auth");
  updateUI();
  await refreshBlockchainState();
}

// IMP START - SDK Initialization
async function init() {
  try {
    await web3auth.init();
    chains = web3auth.coreOptions.chains ?? [];
    if (web3auth.connected) {
      await onConnected();
    }
  } catch (error) {
    console.error(error);
  }
}
// IMP END - SDK Initialization

// IMP START - Login
async function login() {
  setVisible("connect-loading", true);
  setVisible("connect-error", false);
  setText("connect-error", "");

  try {
    await web3auth.connect();
    if (web3auth.connected) {
      await onConnected();
    }
  } catch (error) {
    setText("connect-error", error.message);
    setVisible("connect-error", true);
  } finally {
    setVisible("connect-loading", false);
  }
}
// IMP END - Login

async function getUserInfo() {
  const user = await web3auth.getUserInfo();
  uiConsole(user);
}

// IMP START - Logout
async function logout() {
  setVisible("disconnect-loading", true);
  setVisible("disconnect-error", false);
  setText("disconnect-error", "");

  try {
    await web3auth.logout();
    loggedIn = false;
    address = "";
    chainId = null;
    updateUI();
    setText("user-address", "");
    setText("balance-value", "");
    setText("send-hash", "");
    setText("sign-signature", "");
    setVisible("send-confirmed", false);
    setVisible("send-confirming", false);
    renderSwitchChains();
  } catch (error) {
    setText("disconnect-error", error.message);
    setVisible("disconnect-error", true);
  } finally {
    setVisible("disconnect-loading", false);
  }
}
// IMP END - Logout

// IMP START - Blockchain Calls
async function onSendTransaction(event) {
  event.preventDefault();
  const provider = getEthereumProvider();
  if (!provider) return;

  const formData = new FormData(event.target);
  const to = formData.get("address");
  const value = formData.get("value");
  const submitBtn = event.target.querySelector('button[type="submit"]');

  setVisible("send-error", false);
  setVisible("send-confirmed", false);
  setVisible("send-confirming", false);
  setText("send-hash", "");
  submitBtn.disabled = true;
  submitBtn.textContent = "Confirming...";

  try {
    setVisible("send-confirming", true);
    const { hash } = await RPC.sendTransaction(provider, to, value);
    setText("send-hash", `Transaction Hash: ${hash}`);
    setVisible("send-confirmed", true);
  } catch (error) {
    setText("send-error", `Error: ${error.message}`);
    setVisible("send-error", true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send";
    setVisible("send-confirming", false);
    await refreshBalance();
  }
}

async function onSignMessage(event) {
  event.preventDefault();
  const provider = getEthereumProvider();
  if (!provider) return;

  const formData = new FormData(event.target);
  const message = formData.get("message");
  const submitBtn = event.target.querySelector('button[type="submit"]');

  setVisible("sign-error", false);
  setText("sign-signature", "");
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing...";

  try {
    const signature = await RPC.signMessage(provider, message);
    setText("sign-signature", `Signature: ${signature}`);
  } catch (error) {
    setText("sign-error", `Error: ${error.message}`);
    setVisible("sign-error", true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Sign";
  }
}

async function switchChain(chain) {
  setVisible("switch-chain-error", false);
  setText("switch-chain-error", "");

  try {
    await web3auth.switchChain({ chainId: chain.chainId });
    await refreshBlockchainState();
  } catch (error) {
    setText("switch-chain-error", error.message);
    setVisible("switch-chain-error", true);
  }
}
// IMP END - Blockchain Calls

init();

document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("get-user-info-btn").addEventListener("click", getUserInfo);
document.getElementById("send-tx-form").addEventListener("submit", onSendTransaction);
document.getElementById("sign-message-form").addEventListener("submit", onSignMessage);
