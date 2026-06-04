import {
  getDomainRecords,
  getPrimaryDomain,
  Record,
  registerDomain,
  resolveDomain,
} from "@solana-name-service/sns-sdk-kit";
import {
  address,
  appendTransactionMessageInstructions,
  compileTransaction,
  createNoopSigner,
  createTransactionMessage,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  type Instruction,
} from "@solana/kit";
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstructionAsync,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { useSignAndSendTransaction, useSolanaWallet } from "@web3auth/modal/react/solana";
import { useCallback, useEffect, useState } from "react";

const WSOL_MINT = address("So11111111111111111111111111111111111111112");

interface DomainRecord {
  type: string;
  content: string | null;
  isVerified: boolean;
}

export function SNS() {
  const { accounts, rpc } = useSolanaWallet();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const [domainInput, setDomainInput] = useState<string>("");
  const [registrationInput, setRegistrationInput] = useState<string>("");
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [primaryDomain, setPrimaryDomain] = useState<string | null>(null);
  const [domainRecords, setDomainRecords] = useState<DomainRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const fetchPrimaryDomain = useCallback(async () => {
    if (!rpc || !accounts?.length) return;

    try {
      setIsLoading(true);
      setError(null);
      const { domainName } = await getPrimaryDomain({
        rpc,
        walletAddress: address(accounts[0]),
      });
      setPrimaryDomain(domainName ? `${domainName}.sol` : "No primary domain set");
    } catch {
      setPrimaryDomain("No primary domain set");
    } finally {
      setIsLoading(false);
    }
  }, [accounts, rpc]);

  useEffect(() => {
    if (accounts?.length) {
      void fetchPrimaryDomain();
    }
  }, [accounts, fetchPrimaryDomain]);

  async function registerDomainName() {
    if (!rpc || !accounts?.length) return;

    if (await doesDomainExist(registrationInput)) {
      setError("Domain already exists");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const buyer = address(accounts[0]);
      const feePayer = createNoopSigner(buyer);
      const [buyerTokenAccount] = await findAssociatedTokenPda({
        mint: WSOL_MINT,
        owner: buyer,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      });

      const instructions: Instruction[] = [];
      const ataInfo = await rpc.getAccountInfo(buyerTokenAccount, { encoding: "base64" }).send();
      if (!ataInfo.value) {
        instructions.push(
          await getCreateAssociatedTokenIdempotentInstructionAsync({
            payer: feePayer,
            owner: buyer,
            mint: WSOL_MINT,
          }),
        );
      }

      instructions.push(
        ...(await registerDomain({
          rpc,
          domain: registrationInput,
          space: 0,
          buyer,
          buyerTokenAccount,
          mint: WSOL_MINT,
        })),
      );

      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
      const message = pipe(
        createTransactionMessage({ version: 0 }),
        (m) => setTransactionMessageFeePayerSigner(feePayer, m),
        (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
        (m) => appendTransactionMessageInstructions(instructions, m),
      );

      const sig = await signAndSendTransaction(compileTransaction(message));
      setSuccess(Boolean(sig));
      if (!sig) {
        setError("Wallet or signature error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register domain");
    } finally {
      setIsLoading(false);
    }
  }

  async function resolveDomainName() {
    if (!rpc || !domainInput.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const owner = await resolveDomain({ rpc, domain: domainInput.trim() });
      setResolvedAddress(owner);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve domain");
      setResolvedAddress(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchDomainRecords() {
    if (!rpc || !domainInput.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const recordsToFetch = [
        Record.Discord,
        Record.Twitter,
        Record.Telegram,
        Record.Github,
        Record.Url,
      ] as const;
      const recordTypeNames = ["Discord", "Twitter", "Telegram", "GitHub", "URL"];

      const records = await getDomainRecords({
        rpc,
        domain: domainInput.trim(),
        records: [...recordsToFetch],
        options: { deserialize: true },
      });

      const processedRecords: DomainRecord[] = [];
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        if (record?.deserializedContent) {
          processedRecords.push({
            type: recordTypeNames[i],
            content: record.deserializedContent,
            isVerified: Boolean(record.verified.roa),
          });
        }
      }

      setDomainRecords(processedRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch domain records");
      setDomainRecords([]);
    } finally {
      setIsLoading(false);
    }
  }

  function trimTldAndLowercase(value: string) {
    const trimmed = value.endsWith(".sol") ? value.slice(0, -4) : value;
    return trimmed.toLowerCase();
  }

  async function doesDomainExist(domain: string) {
    const response = await fetch(`https://sns-api.bonfida.com/v2/domains/exists/${domain}`);
    return response.json();
  }

  return (
    <div>
      <h2>SNS (Solana Name Service)</h2>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>Register Domain</h3>
        <input
          type="text"
          value={registrationInput}
          onChange={(e) => setRegistrationInput(trimTldAndLowercase(e.target.value))}
          placeholder="Enter domain (e.g., sns)"
          style={{
            width: "200px",
            padding: "8px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button onClick={() => void registerDomainName()} className="card">
          Register
        </button>
        <div style={{ marginTop: "10px", color: "#4CAF50" }}>
          <span>Cost: paid in wSOL from your wallet&apos;s token account</span>
        </div>
      </div>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>Your Primary Domain</h3>
        {primaryDomain && (
          <div style={{ color: "#4CAF50", fontWeight: "bold" }}>{primaryDomain}</div>
        )}
        <button onClick={() => void fetchPrimaryDomain()} className="card" style={{ marginTop: "10px" }}>
          Refresh Primary Domain
        </button>
      </div>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>Resolve Domain</h3>
        <input
          type="text"
          value={domainInput}
          onChange={(e) => setDomainInput(e.target.value)}
          placeholder="Enter domain (e.g., sns.sol)"
          style={{
            width: "200px",
            padding: "8px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button onClick={() => void resolveDomainName()} className="card">
          Resolve
        </button>
        {resolvedAddress && (
          <div style={{ marginTop: "10px", color: "#4CAF50" }}>
            <strong>Resolved Address:</strong> {resolvedAddress}
          </div>
        )}
      </div>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>Domain Records</h3>
        <button onClick={() => void fetchDomainRecords()} className="card">
          Fetch Records for {domainInput || "Enter domain above"}
        </button>
        {domainRecords.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            {domainRecords.map((record) => (
              <div
                key={record.type}
                style={{
                  marginBottom: "8px",
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                <strong>{record.type}:</strong> {record.content}
                <span
                  style={{
                    marginLeft: "10px",
                    color: record.isVerified ? "#4CAF50" : "#ff9800",
                    fontSize: "12px",
                  }}
                >
                  {record.isVerified ? "✓ Verified" : "⚠ Unverified"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}
      {success && <div className="text-green-500">Success!</div>}
    </div>
  );
}
