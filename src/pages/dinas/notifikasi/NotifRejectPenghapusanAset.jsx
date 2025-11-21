import React from "react";
import "./NotifRejectPenghapusanAset.css";

export default function NotifRejectPenghapusanAset() {
  return (
    <div className="reject-wrapper">

      {/* RED CROSS ICON */}
      <div className="cross-box">
        <svg
          width="360"
          height="360"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#E74C3C"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>

      {/* TEXT */}
      <div className="reject-text">
        The asset submission has been <br />
        <strong>rejected by the verifier.</strong>
      </div>

    </div>
  );
}
