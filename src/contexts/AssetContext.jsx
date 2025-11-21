import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getAssets, addAsset as apiAddAsset, getRisks, addRisk as apiAddRisk } from '../api'; // Import fungsi API

const AssetContext = createContext();

export const useAssetContext = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error("useAssetContext must be used within an AssetProvider");
  }
  return context;
};

export const AssetProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true); // Tambahkan state loading
  const [error, setError] = useState(null); // Tambahkan state error

  // Load assets dan risks dari API saat komponen mount, hanya jika ada token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    const loadData = async () => {
      try {
        const [assetsData, risksData] = await Promise.all([getAssets(), getRisks()]);
        setAssets(assetsData);
        setRisks(risksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const [assetData, setAssetData] = useState({
    kategori: "",
    subKategori: "",
    namaAset: "",
    deskripsiAset: "",
    tanggalPerolehan: "",
    nilaiPerolehan: "",
    kondisiAset: "",
    doc: null,
    penanggungJawab: "",
    lokasi: "",
    idAsset: "",
    tipeAsset: "",
    statusAsset: "Aktif",
  });



  const updateAssetData = (newData) => {
    setAssetData((prevData) => ({ ...prevData, ...newData }));
  };

  const resetAssetData = useCallback(() => {
    setAssetData({
      kategori: "",
      subKategori: "",
      namaAset: "",
      deskripsiAset: "",
      tanggalPerolehan: "",
      nilaiPerolehan: "",
      kondisiAset: "",
      doc: null,
      penanggungJawab: "",
      lokasi: "",
      idAsset: "",
      tipeAsset: "",
      statusAsset: "Aktif",
    });
  }, []);

  const addAsset = async (newAsset) => {
    try {
      const addedAsset = await apiAddAsset(newAsset);
      setAssets((prevAssets) => [...prevAssets, addedAsset]);
    } catch (err) {
      setError(err.message);
    }
  };

  const addRisk = async (newRisk) => {
    try {
      const addedRisk = await apiAddRisk(newRisk);
      setRisks((prevRisks) => [...prevRisks, addedRisk]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AssetContext.Provider
      value={{
        assets,
        risks,
        assetData,
        loading,
        error,
        updateAssetData,
        resetAssetData,
        addAsset,
        addRisk,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};
