
import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import "./QRPopup.css";
// AbortController presence for fetch download
const qrPopupAbortController = new AbortController();

export default function QRPopup({ isOpen, asset, onClose }) {
  const [idAsset, setIdAsset] = useState("");
  const [namaAsset, setNamaAsset] = useState("");
  const [ecLevel, setEcLevel] = useState("H");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrSvgString, setQrSvgString] = useState("");
  const [format, setFormat] = useState("png");
  const previewRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // keep latest onClose handler without adding it to dependency arrays
  onCloseRef.current = onClose;

  const makeQRText = () => {
    // Jika mau mengarahkan ke link, ganti isi sini
    return `http://localhost:5173/laporan/qrcode?id_asset=${idAsset}&nama_asset=${encodeURIComponent(namaAsset)}`;
  };

  useEffect(() => {
    if (asset) {
      setIdAsset(asset.id || asset.asset_id || "");
      setNamaAsset(asset.nama || asset.nama_aset || "");
    }
  }, [asset]);

  useEffect(() => {
    const text = makeQRText();
    if (!text) {
      setQrDataUrl("");
      setQrSvgString("");
      return;
    }

    QRCode.toDataURL(text, {
      errorCorrectionLevel: ecLevel,
      width: 300,
      margin: 4,
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {});

    QRCode.toString(text, {
      type: "svg",
      errorCorrectionLevel: ecLevel,
      margin: 4,
    })
      .then((svg) => setQrSvgString(svg))
      .catch(() => {});
  }, [idAsset, namaAsset, ecLevel]);

  const downloadBlob = (data, filename, mime) => {
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    const text = makeQRText();
    if (!text) return;

    if (format === "png") {
      if (!qrDataUrl) return;
      try {
        const res = await fetch(qrDataUrl);
        const blob = await res.blob();
        const filename = `${idAsset || "qr"}_${Date.now()}.png`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (e) {
      }
    } else if (format === "svg") {
      if (!qrSvgString) return;
      const filename = `${idAsset || "qr"}_${Date.now()}.svg`;
      downloadBlob(qrSvgString, filename, "image/svg+xml;charset=utf-8");
    }
  };



  // Keyboard ESC to close when modal open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isOpen) onCloseRef.current?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="qrpopup-overlay" onMouseDown={onClose}>
      <div
        className="qrpopup-card"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()} // prevent overlay close when clicking card
      >
        <header className="qrpopup-header">
          <h2 className="qrpopup-title">Generator QR Code</h2>
          <button
            aria-label="Tutup"
            className="qrpopup-close"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

            <main className="qrpopup-body">
              <section className="qrpopup-form">
                <label className="field-label">ID Asset</label>
                <input
                  className="field-input"
                  value={idAsset}
                  disabled
                  placeholder="A-00123"
                />

                <label className="field-label">Nama Asset</label>
                <input
                  className="field-input"
                  value={namaAsset}
                  disabled
                  placeholder="Laptop Asus A15"
                />

                <div className="grid-two">
                  <div>
                    <label className="field-label">Error Correction</label>
                    <select
                      className="field-select"
                      value={ecLevel}
                      onChange={(e) => setEcLevel(e.target.value)}
                    >
                      <option value="L">L - Low (7%)</option>
                      <option value="M">M - Medium (15%)</option>
                      <option value="Q">Q - Quartile (25%)</option>
                      <option value="H">H - High (30%)</option>
                    </select>
                  </div>
                </div>

                <div className="actions-row">
                  <button className="btn primary" onClick={handleDownload}>
                    Unduh ({format.toUpperCase()})
                  </button>

                  <select
                    className="field-select small"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                  </select>
                </div>
              </section>

              <aside className="qrpopup-preview" ref={previewRef}>
                <div className="preview-label">Preview</div>

                <div className="preview-box">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="qr-preview"
                      style={{ width: "300px", height: "300px" }}
                    />
                  ) : (
                    <div className="noqr">No QR</div>
                  )}
                </div>

                <div className="meta">
                  <div>
                    <small className="muted">id_asset:</small>{" "}
                    <span className="meta-value">{idAsset || "-"}</span>
                  </div>
                  <div>
                    <small className="muted">nama_asset:</small>{" "}
                    <span className="meta-value">{namaAsset || "-"}</span>
                  </div>
                </div>

                <button
                  className="btn download-fast"
                  onClick={() => {
                    setFormat("png");
                    handleDownload();
                  }}
                >
                  Unduh Cepat PNG
                </button>
              </aside>
            </main>
      </div>
    </div>
  );
}
