import { address, generateKeyPairSigner } from "@solana/kit";
import { createQR, encodeURL } from "@solana/pay";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function SolanaPay() {
  const { accounts, rpc } = useSolanaWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amountToSend, setAmountToSend] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>("");
  const qrRef = useRef<HTMLDivElement>(null);

  async function generateQrCode() {
    if (!rpc || !accounts?.length) return;

    try {
      setIsLoading(true);
      setError(null);

      const reference = (await generateKeyPairSigner()).address;
      const url = encodeURL({
        recipient: address(accounts[0]),
        amount: amountToSend,
        reference,
        label: "MetaMask Embedded Wallet x Solana Pay Demo",
        message: "Thanks for Trying Solana Pay!",
        memo: "Thanks for Trying Solana Pay!",
      });

      setQrUrl(url.toString());
      setShowModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate QR code");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (showModal && qrUrl && qrRef.current) {
      qrRef.current.innerHTML = "";
      try {
        const qr = createQR(qrUrl, 300, "white");
        qr.append(qrRef.current);
      } catch {
        setError("Failed to create QR code");
      }
    }
  }, [showModal, qrUrl]);

  function closeModal() {
    setShowModal(false);
    setQrUrl("");
    setError(null);
  }

  return (
    <div>
      <h2>Solana Pay QR</h2>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <input
          type="number"
          placeholder="Enter SOL amount"
          value={amountToSend || ""}
          onChange={(e) => setAmountToSend(Number(e.target.value))}
          style={{
            width: "200px",
            padding: "8px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
          step="0.01"
          min="0"
        />
        <button
          onClick={() => void generateQrCode()}
          className="card"
          type="button"
          disabled={isLoading || amountToSend <= 0}
        >
          {isLoading ? "Generating..." : "Generate Payment QR"}
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      {showModal &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "16px",
            }}
            onClick={closeModal}
          >
            <div
              style={{
                backgroundColor: "var(--bg-color)",
                borderRadius: "var(--radius)",
                padding: "24px",
                width: "400px",
                maxWidth: "90vw",
                position: "relative",
                boxShadow: "var(--shadow-md)",
                border: "1px solid var(--border-color)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModal}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  width: "32px",
                  height: "32px",
                }}
              >
                ×
              </button>

              <div style={{ textAlign: "center", paddingTop: "8px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "16px",
                    color: "var(--text-color)",
                  }}
                >
                  Pay {amountToSend} SOL
                </h3>

                <div
                  ref={qrRef}
                  style={{
                    marginBottom: "16px",
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "300px",
                    alignItems: "center",
                  }}
                />

                <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                  Scan with your Solana wallet
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
