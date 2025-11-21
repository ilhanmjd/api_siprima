import React from "react";
import "./NotifAcceptPenghapusanAset.css";

export default function NotifAcceptPenghapusanAset() {
  return (
    <div className="success-wrapper">
      <div className="checkmark-box">
        <svg
          width="360"
          height="360"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5C8FF5"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>

      <div className="success-text">
        The asset deletion request has been <br />
        <strong>accepted successfully.</strong>
      </div>
    </div>
  );
}
