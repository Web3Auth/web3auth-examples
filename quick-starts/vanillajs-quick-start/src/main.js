// IMP START - Quick Start
import { Web3Auth, WEB3AUTH_NETWORK } from "@web3auth/modal";
// IMP END - Quick Start

// IMP START - Blockchain Calls
import RPC from "./viemRPC.js";
// IMP END - Blockchain Calls

// IMP START - Dashboard Registration
const clientId = "BHgArYmWwSeq21czpcarYh0EVq2WWOzflX-NTK-tY1-1pauPzHKRRLgpABkmYiIV_og9jAvoIxQ8L3Smrwe04Lw"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Config
const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
});
// IMP END - Config

let loggedIn = false;

// UI Helper function
function uiConsole(...args) {
  const el = document.querySelector("#console-ui>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
  }
}

// Update UI based on login state
function updateUI() {
  const loggedInView = document.getElementById("logged-in-view");
  const loggedOutView = document.getElementById("logged-out-view");
  
  if (loggedIn) {
    loggedInView.style.display = "flex";
    loggedOutView.style.display = "none";
  } else {
    loggedInView.style.display = "none";
    loggedOutView.style.display = "flex";
  }
}

// IMP START - SDK Initialization
async function init() {
  try {
    await web3auth.init();
    if (web3auth.connected) {
      loggedIn = true;
      updateUI();
    }
  } catch (error) {
    console.error(error);
  }
}
// IMP END - SDK Initialization

// IMP START - Login
async function login() {
  await web3auth.connect();
  if (web3auth.connected) {
    loggedIn = true;
    updateUI();
  }
}
// IMP END - Login

async function getUserInfo() {
  const user = await web3auth.getUserInfo();
  uiConsole(user);
}

// IMP START - Logout
async function logout() {
  await web3auth.logout();
  loggedIn = false;
  updateUI();
  uiConsole("logged out");
}
// IMP END - Logout

// IMP START - Blockchain Calls
async function getAccounts() {
  const address = await RPC.getAccounts(web3auth.provider);
  uiConsole(address);
}

async function getBalance() {
  const balance = await RPC.getBalance(web3auth.provider);
  uiConsole(balance);
}

async function signMessage() {
  const signedMessage = await RPC.signMessage(web3auth.provider);
  uiConsole(signedMessage);
}

async function sendTransaction() {
  uiConsole("Sending Transaction...");
  const transactionReceipt = await RPC.sendTransaction(web3auth.provider);
  uiConsole(transactionReceipt);
}
// IMP END - Blockchain Calls

// Initialize on page load
init();

// Set up event listeners
document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("get-user-info-btn").addEventListener("click", getUserInfo);
document.getElementById("get-accounts-btn").addEventListener("click", getAccounts);
document.getElementById("get-balance-btn").addEventListener("click", getBalance);
document.getElementById("sign-message-btn").addEventListener("click", signMessage);
document.getElementById("send-transaction-btn").addEventListener("click", sendTransaction);

