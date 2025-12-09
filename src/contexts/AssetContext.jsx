import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import api from "../api";

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
  const [risks] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [assetsError, setAssetsError] = useState(null);

  const assetsRef = useRef([]);
  const assetsPromiseRef = useRef(null);
  const assetsControllerRef = useRef(null);

  useEffect(() => {
    assetsRef.current = assets;
  }, [assets]);

  useEffect(() => {
    return () => {
      if (assetsControllerRef.current) {
        assetsControllerRef.current.abort();
      }
    };
  }, []);

  const fetchAssetsOnce = useCallback(async () => {
    if (assetsPromiseRef.current) {
      return assetsPromiseRef.current;
    }
    if (assetsRef.current.length) {
      return assetsRef.current;
    }

    const controller = new AbortController();
    assetsControllerRef.current = controller;

    const promise = (async () => {
      try {
        setLoadingAssets(true);
        setAssetsError(null);
        const response = await api.getAssets({
          page: 1,
          limit: 50,
          signal: controller.signal,
        });
        const list = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        setAssets(list);
        assetsRef.current = list;
        return list;
      } catch (err) {
        if (controller.signal.aborted) return null;
        setAssetsError(err.message || "Gagal memuat aset");
        return null;
      } finally {
        setLoadingAssets(false);
        assetsPromiseRef.current = null;
        assetsControllerRef.current = null;
      }
    })();

    assetsPromiseRef.current = promise;
    return promise;
  }, [assets]);

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
    penanggungJawabId: "",
    lokasi: "",
    idAsset: "",
    tipeAsset: "",
    statusAsset: "Aktif",
    idRisiko: "",
    strategi: "",
    pengendalian: "",
    targetTanggal: "",
    biaya: "",
    probabilitasAkhir: "",
    dampakAkhir: "",
    levelResidual: "",
  });

  const updateAssetData = useCallback((newData) => {
    setAssetData((prevData) => ({ ...prevData, ...newData }));
  }, []);

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
      penanggungJawabId: "",
      lokasi: "",
      idAsset: "",
      tipeAsset: "",
      statusAsset: "Aktif",
      idRisiko: "",
      strategi: "",
      pengendalian: "",
      targetTanggal: "",
      biaya: "",
      probabilitasAkhir: "",
      dampakAkhir: "",
      levelResidual: "",
    });
  }, []);

  return (
    <AssetContext.Provider
      value={{
        assets,
        risks,
        assetData,
        loadingAssets,
        assetsError,
        loading: loadingAssets,
        error: assetsError,
        updateAssetData,
        resetAssetData,
        fetchAssetsOnce,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};
