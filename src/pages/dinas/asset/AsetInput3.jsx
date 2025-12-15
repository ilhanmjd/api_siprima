import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetContext } from "../../../contexts/AssetContext";
import api from "../../../api";
import "./AsetInput3.css";
// AbortController presence for data fetch
const asetInput3AbortController = new AbortController();

function AssetForm() {
  const navigate = useNavigate();
  const { assetData, updateAssetData } = useAssetContext();

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isLokasiDropdownOpen, setIsLokasiDropdownOpen] = useState(false);
  const [lokasiFilter, setLokasiFilter] = useState("");
  const [isPenanggungJawabDropdownOpen, setIsPenanggungJawabDropdownOpen] = useState(false);
  const [penanggungJawabFilter, setPenanggungJawabFilter] = useState("");

  const [lokasiOptions, setLokasiOptions] = useState([]);
  const [penanggungJawabOptions, setPenanggungJawabOptions] = useState([]);

  const penanggungRef = useRef(null);
  const lokasiRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLokasi = async () => {
      try {
        const response = await api.getLokasis();
        if (!isMounted) return;
        const data = response?.data?.data;
        setLokasiOptions(Array.isArray(data) ? data : []);
      } catch (error) {
        if (isMounted) setLokasiOptions([]);
      }
    };
    const fetchPenanggungJawab = async () => {
      try {
        const response = await api.getPenanggungjawabs();
        if (!isMounted) return;
        const data = response?.data?.data;
        setPenanggungJawabOptions(Array.isArray(data) ? data : []);
      } catch (error) {
        if (isMounted) setPenanggungJawabOptions([]);
      }
    };
    fetchLokasi();
    fetchPenanggungJawab();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    updateAssetData({ [e.target.name]: e.target.value });
  };

  const handleStatusSelectChange = (value) => {
    updateAssetData({ status: value });
    setIsStatusDropdownOpen(false);
  };

  const handleLokasiSelectChange = (value) => {
    updateAssetData({ lokasi: value });
    setIsLokasiDropdownOpen(false);
  };

  const handleLokasiInputChange = (e) => {
    const value = e.target.value;
    updateAssetData({ lokasi: value });
    setLokasiFilter(value);
    setIsLokasiDropdownOpen(true);
  };

  const handlePenanggungJawabSelectChange = (value) => {
    updateAssetData({ penanggung_jawab: value });
    setIsPenanggungJawabDropdownOpen(false);
  };

  const handlePenanggungJawabInputChange = (e) => {
    const value = e.target.value;
    updateAssetData({ penanggung_jawab: value });
    setPenanggungJawabFilter(value);
    setIsPenanggungJawabDropdownOpen(true);
  };

  const filteredLokasiOptions = lokasiOptions.filter(option =>
    option && option.nama && option.nama.toLowerCase().includes(lokasiFilter.toLowerCase())
  );

  const filteredPenanggungJawabOptions = penanggungJawabOptions.filter(option =>
    option && option.nama && option.nama.toLowerCase().includes(penanggungJawabFilter.toLowerCase())
  );

  const handleBack = () => {
    navigate("/AsetInput2");
  };

  const handleNext = () => {
    navigate("/konfirmasi-input-aset");
  };

  const allFilled = assetData.penanggung_jawab && assetData.lokasi && assetData.status;

  return (
    <div className="asset-container">
      {/* === PROGRESS BAR === */}
      <div className="progress-wrapper">
        {/* Step 1 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img src="/identitas%20aset.png" alt="Identitas Aset" width="30" height="23" />
          </div>
          <p>Identitas Aset</p>
        </div>

        {/* Connector 1 */}
        <div className="connector active-connector"></div>

        {/* Step 2 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img src="/detail%20perolehan%20putih.png" alt="Detail Perolehan" width="20" height="23" />
          </div>
          <p>Detail Perolehan</p>
        </div>

        {/* Connector 2 */}
        <div className="connector active-connector"></div>

        {/* Step 3 */}
        <div className="step-wrapper">
          <div className="icon-box active-bg">
            <img src="/Penanggung%20Jawab%20putih.png" alt="Penanggung Jawab" width="20" height="20" />
          </div>
          <p>Penanggung Jawab</p>
        </div>
      </div>

      {/* === FORM === */}
      <form className="asset-form">
        <label>Penanggung Jawab</label>
        <div className="dropdown">
          <div className="text-dropdown-container">
            <input
              type="text"
              className="dropdown-input"
              value={assetData.penanggung_jawab || ""}
              onChange={handlePenanggungJawabInputChange}
              onClick={() => setIsPenanggungJawabDropdownOpen(!isPenanggungJawabDropdownOpen)}
              ref={penanggungRef}
              placeholder="Pilih atau ketik Penanggung Jawab"
            />
            <span className="dropdown-arrow" onClick={() => setIsPenanggungJawabDropdownOpen(!isPenanggungJawabDropdownOpen)}>▾</span>
          </div>
          <div className={`dropdown-content penanggung-jawab-dropdown ${isPenanggungJawabDropdownOpen ? 'show' : ''}`}>
            {filteredPenanggungJawabOptions.map((option) => (
              <div key={option.id} onClick={() => handlePenanggungJawabSelectChange(option.nama)}>{option.nama}</div>
            ))}
          </div>
        </div>

        <label>Lokasi</label>
        <div className="dropdown">
          <div className="text-dropdown-container">
            <input
              type="text"
              className="dropdown-input"
              value={assetData.lokasi || ""}
              onChange={handleLokasiInputChange}
              onClick={() => setIsLokasiDropdownOpen(!isLokasiDropdownOpen)}
              ref={lokasiRef}
              placeholder="Pilih atau ketik Lokasi"
            />
            <span className="dropdown-arrow" onClick={() => setIsLokasiDropdownOpen(!isLokasiDropdownOpen)}>▾</span>
          </div>
          <div className={`dropdown-content lokasi-dropdown ${isLokasiDropdownOpen ? 'show' : ''}`}>
            {filteredLokasiOptions.map((option) => (
              <div key={option.id} onClick={() => handleLokasiSelectChange(option.nama)}>{option.nama}</div>
            ))}
          </div>
        </div>

        <label>Status</label>
        <div className="dropdown">
          <button
            type="button"
            className="dropdown-btn"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            ref={statusRef}
          >
            {assetData.status || "Pilih Status"} <span>▾</span>
          </button>
          <div className={`dropdown-content ${isStatusDropdownOpen ? 'show' : ''}`}>
            <div onClick={() => handleStatusSelectChange("Active")}>Active</div>
            <div onClick={() => handleStatusSelectChange("Inactive")}>Inactive</div>
          </div>
        </div>

        <div className="button-group">
          <button
            type="button"
            className="next-btn active"
            onClick={handleBack}
          >
            BACK
          </button>
          <button
            type="button"
            className={`next-btn ${allFilled ? "active" : "disabled"}`}
            disabled={!allFilled}
            onClick={handleNext}
            style={{ backgroundColor: allFilled ? "#29AE08" : undefined }}
          >
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssetForm;
