import { useState } from "react";
import { QrReader } from "react-qr-reader";

interface QrScannerProps {
  onCodeDetected: (text: string) => void;
}

// Simple QR code scanner component using react-qr-reader
const QrScanner = ({ onCodeDetected }: QrScannerProps) => {
  const [scanError, setScanError] = useState<string | null>(null);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg border border-border">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (result?.getText()) {
              onCodeDetected(result.getText());
            }
            if (error) {
              setScanError(error?.message ?? "Camera error");
            }
          }}
          containerStyle={{ width: "100%" }}
          videoStyle={{ borderRadius: "0.5rem" }}
        />
      </div>
      {scanError && (
        <p className="text-destructive text-sm">{scanError}</p>
      )}
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Point your camera at a QR code found on recyclable items to quickly identify them.
      </p>
    </div>
  );
};

export default QrScanner;
