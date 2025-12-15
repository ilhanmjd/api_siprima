import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api";
import "./RiskTreatment1.css";

function RiskTreatment1() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();
  const [riskOptions, setRiskOptions] = useState([]);
  const [loadingRisks, setLoadingRisks] = useState(false);
  const [loadingPenanggungJawab, setLoadingPenanggungJawab] = useState(false);
  const [isRiskDropdownOpen, setIsRiskDropdownOpen] = useState(false);
  const [riskFilter, setRiskFilter] = useState("");
  const [selectedRiskDisplay, setSelectedRiskDisplay] = useState("");
  const riskRef = useRef(null);



  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleBiayaChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    updateAssetData({ biaya: value });
  };

  useEffect(() => {
    const fetchRisks = async () => {
      setLoadingRisks(true);
      try {
        const res = await api.getRisks();
        const list = res?.data?.data ?? res?.data ?? [];
        console.log("Risks API response:", res); // Debug log
        console.log("Risks list:", list); // Debug log
        if (list.length > 0) {
          console.log("First risk object structure:", list[0]); // Debug log
        }
        setRiskOptions(Array.isArray(list) ? list : []);
      } catch (error) {
        setRiskOptions([]);
      } finally {
        setLoadingRisks(false);
      }
    };
    fetchRisks();
  }, []);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (riskRef.current && !riskRef.current.contains(event.target)) {
        setIsRiskDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  const filteredRisks = useMemo(() => {
    const term = (riskFilter || "").toLowerCase();
    return (Array.isArray(riskOptions) ? riskOptions : []).filter((risk) => {
      const text =
        risk?.judul?.toLowerCase() ||
        risk?.nama?.toLowerCase() ||
        String(risk?.id ?? "").toLowerCase();
      return text.includes(term) && risk.status === "accepted";
    });
  }, [riskFilter, riskOptions]);





  const handleRiskInputChange = (e) => {
    const value = e.target.value;
    setRiskFilter(value);
    setSelectedRiskDisplay("");
    setIsRiskDropdownOpen(true);
  };

  const handleRiskSelect = async (risk) => {
    console.log("Selected risk:", risk); // Debug log
    updateAssetData({ idRisiko: risk?.id || "" });
    setSelectedRiskDisplay(`(${risk?.id}) - ${risk?.judul}`);
    setIsRiskDropdownOpen(false);

    // Fetch penanggung jawab if available
    const penanggungJawabId = risk?.penanggungjawab_id || risk?.asset?.penanggungjawab_id;
    if (penanggungJawabId) {
      console.log("Fetching penanggung jawab for ID:", penanggungJawabId); // Debug log
      setLoadingPenanggungJawab(true);
      try {
        const res = await api.getPenanggungjawabById(penanggungJawabId);
        console.log("Penanggung jawab API response:", res); // Debug log
        const penanggungJawabData = res?.data?.data ?? res?.data;
        if (penanggungJawabData?.nama) {
          updateAssetData({ penanggungJawab: penanggungJawabData.nama, penanggungJawabId: penanggungJawabId });
        }
      } catch (error) {
        console.error("Error fetching penanggung jawab:", error);
      } finally {
        setLoadingPenanggungJawab(false);
      }
    } else {
      console.log("No penanggungjawab_id found in risk or asset object"); // Debug log
    }
  };



const handleNext = () => {
    navigate("/RiskTreatment2");
  };

  const handleBack = () => {
    navigate("/notif-accept-risk");
  };

  const allFilled =
    assetData.idRisiko &&
    assetData.strategi &&
    assetData.pengendalian &&
    assetData.penanggungJawab &&
    assetData.targetTanggal &&
    assetData.biaya;

  return (
    <div className="asset-container">
      <button className="back-btn" onClick={handleBack}>
        <img src="/kembali.png" alt="Kembali" width="26" height="52" />
      </button>
      {/* === PROGRESS BAR === */}
      <div className="progress-wrapper">
        {/* Step 1 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img
              src="/identifikasi risiko.png"
              alt="Identifikasi Risiko"
              width="30"
              height="23"
            />
          </div>
          <p>Identifikasi Risiko</p>
        </div>

        {/* Connector 1 */}
        <div className="connector active-connector"></div>

        {/* Step 2 */}
        <div className="step-wrapper">
          <div className="icon-box inactive-bg">
            <img
              src="/Analisis Awal.png"
              alt="Analisis Awal"
              width="20"
              height="23"
            />
          </div>
          <p>Analisis Awal</p>
        </div>
      </div>

      {/* === FORM === */}
      <form className="asset-form">
        
        <label>ID Risiko</label>
        <div className="dropdown">
          <div className="text-dropdown-container">
            <input
              type="text"
              className="dropdown-input"
              value={selectedRiskDisplay || riskFilter}
              onChange={handleRiskInputChange}
              onClick={() => setIsRiskDropdownOpen(!isRiskDropdownOpen)}
              ref={riskRef}
              placeholder={loadingRisks ? "Memuat..." : "Pilih atau ketik ID Risiko"}
            />
            <span className="dropdown-arrow" onClick={() => setIsRiskDropdownOpen(!isRiskDropdownOpen)}>▾</span>
          </div>
          <div className={`dropdown-content risk-dropdown ${isRiskDropdownOpen ? 'show' : ''}`}>
            {filteredRisks.map((risk) => (
              <div key={risk.id} onClick={() => handleRiskSelect(risk)}>({risk.id}) - {risk.judul}</div>
            ))}
          </div>
        </div>

        <label>Strategi</label>
        <input
          type="text"
          name="strategi"
          value={assetData.strategi || ""}
          onChange={handleChange}
        />

        <label>Pengendalian</label>
        <input
          type="text"
          name="pengendalian"
          value={assetData.pengendalian || ""}
          onChange={handleChange}
        />

        <label>Penanggung Jawab</label>
        <input
          type="text"
          name="penanggungJawab"
          value={assetData.penanggungJawab || ""}
          onChange={handleChange}
          placeholder={loadingPenanggungJawab ? "Memuat..." : ""}
        />

        <label>Target Tanggal</label>
        <input
          type="date"
          name="targetTanggal"
          value={assetData.targetTanggal || ""}
          onChange={handleChange}
        />

        <label>Biaya</label>
        <input
          type="text"
          name="biaya"
          value={assetData.biaya || ""}
          onChange={handleBiayaChange}
        />

        <button
          type="button"
          className={`next-btn ${allFilled ? "active" : "disabled"}`}
          disabled={!allFilled}
          onClick={handleNext}
        >
          NEXT
        </button>
      </form>
    </div>
  );
}

export default RiskTreatment1;
