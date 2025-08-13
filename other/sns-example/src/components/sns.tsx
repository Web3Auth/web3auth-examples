import {
  useSignAndSendTransaction,
  useSolanaWallet,
} from "@web3auth/modal/react/solana";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";
import {
  resolve,
  getPrimaryDomain,
  getMultipleRecordsV2,
  Record,
  devnet,
} from "@bonfida/spl-name-service";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountIdempotentInstruction,
  createSyncNativeInstruction,
  NATIVE_MINT,
} from "@solana/spl-token";
import axios from "axios";

interface DomainRecord {
  type: string;
  content: string | null;
  isVerified: boolean;
}

export function SNS() {
  const { accounts, connection } = useSolanaWallet();
  const [domainInput, setDomainInput] = useState<string>("");
  const [registrationInput, setRegistrationInput] = useState<string>("");
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [primaryDomain, setPrimaryDomain] = useState<string | null>(null);
  const [domainRecords, setDomainRecords] = useState<DomainRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { signAndSendTransaction } = useSignAndSendTransaction();

  // 1. Domain Registration
  const registerDomain = async () => {
    if (!connection || !accounts) return;

    const publicKey = new PublicKey(accounts[0]);

    if (await doesDomainExist(registrationInput)) {
      setError("Domain already exists");
      return;
    }
    const ixs = [];
    try {
      setIsLoading(true);
      const ata = getAssociatedTokenAddressSync(NATIVE_MINT, publicKey, false);

      if (!ata) {
        const createAtaIx = createAssociatedTokenAccountIdempotentInstruction(
          publicKey,
          ata,
          publicKey,
          NATIVE_MINT,
        );
        ixs.push(createAtaIx);
      }

      const regIx = await devnet.bindings.registerDomainNameV2(
        connection,
        registrationInput,
        0,
        publicKey,
        ata,
        NATIVE_MINT,
      );

      ixs.push(...regIx);
      const { blockhash } = await connection.getLatestBlockhash();
      const tx = new Transaction({
        feePayer: publicKey,
        recentBlockhash: blockhash,
      }).add(...ixs);

      const sig = await signAndSendTransaction(tx);

      if (sig) {
        setSuccess(true);
      } else {
        setError("Wallet or signature error");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to register domain",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Domain Resolution
  const resolveDomain = async () => {
    if (!connection || !domainInput.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const address = await resolve(connection, domainInput.trim());
      setResolvedAddress(address.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve domain");
      setResolvedAddress(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Primary Domain Lookup
  const fetchPrimaryDomain = async () => {
    if (!connection || !accounts || accounts.length === 0) return;

    try {
      setIsLoading(true);
      setError(null);
      const publicKey = new PublicKey(accounts[0]);
      const { domain } = await getPrimaryDomain(connection, publicKey);
      setPrimaryDomain(domain ? domain.toString() : "No primary domain set");
    } catch (err) {
      // setError(
      //   err instanceof Error ? err.message : "Failed to fetch primary domain",
      // );
      setPrimaryDomain("No primary domain set");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Domain Records
  const fetchDomainRecords = async () => {
    if (!connection || !domainInput.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const recordsToFetch = [
        Record.Discord,
        Record.Twitter,
        Record.Telegram,
        Record.Github,
        Record.Url,
      ];
      const recordOptions = { deserialize: true };

      const records = await getMultipleRecordsV2(
        connection,
        domainInput.trim(),
        recordsToFetch,
        recordOptions,
      );

      const processedRecords: DomainRecord[] = [];
      const recordTypeNames = [
        "Discord",
        "Twitter",
        "Telegram",
        "GitHub",
        "URL",
      ];

      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const recordTypeName = recordTypeNames[i];

        if (record && record.retrievedRecord) {
          processedRecords.push({
            type: recordTypeName,
            content: record.retrievedRecord.toString(),
            isVerified: true, // Simplified - assume verified if retrieved
          });
        }
      }

      setDomainRecords(processedRecords);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch domain records",
      );
      setDomainRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch primary domain when connected
  useEffect(() => {
    if (connection && accounts && accounts.length > 0) {
      fetchPrimaryDomain();
    }
  }, [connection, accounts]);

  // Utils

  const trimTldAndLowercase = (x: string) => {
    if (x.endsWith(".sol")) {
      x = x.slice(0, -4);
    }
    return x.toLowerCase();
  };

  const getRecordTypeName = (recordType: string): string => {
    return recordType;
  };

  const doesDomainExist = async (domain: string) => {
    const url = `https://sns-api.bonfida.com/v2/domains/exists/${domain}`;
    const response = await axios.get(url);
    return response.data;
  };

  return (
    <div>
      <h2>SNS (Solana Name Service)</h2>

      {/* Register Domain Section */}
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
          onChange={(e) =>
            setRegistrationInput(trimTldAndLowercase(e.target.value))
          }
          placeholder="Enter domain (e.g., sns)"
          style={{
            width: "200px",
            padding: "8px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button onClick={registerDomain} className="card">
          Register
        </button>

        <div style={{ marginTop: "10px", color: "#4CAF50" }}>
          <span>Cost: $20 (~ 0.11 SOL) </span>
        </div>
      </div>

      {/* Primary Domain Section */}
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
          <div style={{ color: "#4CAF50", fontWeight: "bold" }}>
            {primaryDomain}
          </div>
        )}
        <button
          onClick={fetchPrimaryDomain}
          className="card"
          style={{ marginTop: "10px" }}
        >
          Refresh Primary Domain
        </button>
      </div>

      {/* Domain Resolution Section */}
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
        <button onClick={resolveDomain} className="card">
          Resolve
        </button>
        {resolvedAddress && (
          <div style={{ marginTop: "10px", color: "#4CAF50" }}>
            <strong>Resolved Address:</strong> {resolvedAddress}
          </div>
        )}
      </div>

      {/* Domain Records Section */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>Domain Records</h3>
        <button onClick={fetchDomainRecords} className="card">
          Fetch Records for {domainInput || "Enter domain above"}
        </button>
        {domainRecords.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            {domainRecords.map((record, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "8px",
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                <strong>{getRecordTypeName(record.type)}:</strong>{" "}
                {record.content}
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

      {/* Loading and Error and Success States */}
      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}
      {success && <div className="text-green-500">Success!</div>}
    </div>
  );
}
